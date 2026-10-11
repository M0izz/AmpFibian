import os
import json
import uuid
from datetime import datetime, timezone
from typing import Dict, Any, Optional, List

def _resolve_saved_runs_dir():
    candidate = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../../data/saved_runs"))
    try:
        os.makedirs(candidate, exist_ok=True)
        test_file = os.path.join(candidate, ".write_test")
        with open(test_file, "w") as f:
            f.write("ok")
        os.remove(test_file)
        return candidate
    except Exception:
        tmp_dir = os.path.join("/tmp", "saved_runs")
        try:
            os.makedirs(tmp_dir, exist_ok=True)
            return tmp_dir
        except Exception:
            return candidate

SAVED_RUNS_DIR = _resolve_saved_runs_dir()

def json_default(obj):
    if hasattr(obj, "model_dump"):
        return obj.model_dump()
    if hasattr(obj, "__dict__"):
        return obj.__dict__
    return str(obj)

class PersistenceService:
    def __init__(self):
        try:
            os.makedirs(SAVED_RUNS_DIR, exist_ok=True)
        except Exception:
            pass
        self.mode = os.getenv("PERSISTENCE_MODE", "local_file")
        self.dynamodb_table_name = os.getenv("DYNAMODB_TABLE_NAME", "roofwise_simulation_runs")
        self._memory_cache: Dict[str, Dict[str, Any]] = {}
        self._dynamodb_client = None

        if self.mode == "dynamodb":
            try:
                import boto3
                region = os.getenv("AWS_REGION", "ap-south-1")
                self._dynamodb_client = boto3.resource("dynamodb", region_name=region)
            except Exception as e:
                print(f"[Persistence] Failed to initialize DynamoDB, falling back to local files: {e}")
                self.mode = "local_file"

    def save_run(self, snapshot: Dict[str, Any], user_id: str = "anon_default_user") -> str:
        run_id = snapshot.get("run_id") or f"run_mum_{datetime.now(timezone.utc).strftime('%Y%m%d')}_{uuid.uuid4().hex[:8]}"
        snapshot["run_id"] = run_id
        snapshot["user_id"] = user_id
        snapshot["created_at"] = snapshot.get("created_at") or datetime.now(timezone.utc).isoformat()
        
        # Cache in memory
        self._memory_cache[run_id] = snapshot

        # Save to local file (with user-isolated folder)
        user_dir = os.path.join(SAVED_RUNS_DIR, user_id)
        os.makedirs(user_dir, exist_ok=True)
        user_file_path = os.path.join(user_dir, f"{run_id}.json")
        flat_file_path = os.path.join(SAVED_RUNS_DIR, f"{run_id}.json")

        try:
            with open(user_file_path, "w", encoding="utf-8") as f:
                json.dump(snapshot, f, indent=2, default=json_default)
            # Maintain flat file for backward compatibility
            with open(flat_file_path, "w", encoding="utf-8") as f:
                json.dump(snapshot, f, indent=2, default=json_default)
        except Exception as e:
            print(f"[Persistence] Error writing local files: {e}")

        # If DynamoDB is active, persist with user_id as Partition Key and run_id as Sort Key
        if self.mode == "dynamodb" and self._dynamodb_client:
            try:
                table = self._dynamodb_client.Table(self.dynamodb_table_name)
                table.put_item(Item={
                    "user_id": user_id,
                    "run_id": run_id,
                    "created_at": snapshot["created_at"],
                    "rainfall_year": snapshot.get("rainfall_year", "2020_median"),
                    "building_name": snapshot.get("building_input", {}).get("name", "Unknown"),
                    "engine_version": snapshot.get("engine_version", "1.2.0"),
                    "snapshot_json": json.dumps(snapshot, default=json_default)
                })
            except Exception as e:
                print(f"[Persistence] DynamoDB save warning: {e}")

        return run_id

    def get_run(self, run_id: str, user_id: Optional[str] = None) -> Optional[Dict[str, Any]]:
        # Check cache
        if run_id in self._memory_cache:
            item = self._memory_cache[run_id]
            if user_id and item.get("user_id") and item.get("user_id") != user_id and item.get("user_id") != "anon_default_user":
                return None
            return item

        # Check user-specific file first if user_id known
        if user_id:
            user_file = os.path.join(SAVED_RUNS_DIR, user_id, f"{run_id}.json")
            if os.path.exists(user_file):
                try:
                    with open(user_file, "r", encoding="utf-8") as f:
                        data = json.load(f)
                        self._memory_cache[run_id] = data
                        return data
                except Exception as e:
                    print(f"[Persistence] Error reading user file {user_file}: {e}")

        # Check flat file fallback
        flat_file = os.path.join(SAVED_RUNS_DIR, f"{run_id}.json")
        if os.path.exists(flat_file):
            try:
                with open(flat_file, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    self._memory_cache[run_id] = data
                    return data
            except Exception as e:
                print(f"[Persistence] Error reading file {flat_file}: {e}")

        # Check DynamoDB
        if self.mode == "dynamodb" and self._dynamodb_client:
            try:
                table = self._dynamodb_client.Table(self.dynamodb_table_name)
                key = {"user_id": user_id or "anon_default_user", "run_id": run_id}
                res = table.get_item(Key=key)
                if "Item" in res and "snapshot_json" in res["Item"]:
                    data = json.loads(res["Item"]["snapshot_json"])
                    self._memory_cache[run_id] = data
                    return data
            except Exception as e:
                print(f"[Persistence] DynamoDB get warning: {e}")

        return None

    def get_runs_by_user(self, user_id: str) -> List[Dict[str, Any]]:
        """
        Retrieves all simulation runs belonging strictly to the specified user_id.
        """
        runs: List[Dict[str, Any]] = []

        # DynamoDB Query
        if self.mode == "dynamodb" and self._dynamodb_client:
            try:
                from boto3.dynamodb.conditions import Key
                table = self._dynamodb_client.Table(self.dynamodb_table_name)
                response = table.query(
                    KeyConditionExpression=Key("user_id").eq(user_id)
                )
                items = response.get("Items", [])
                for item in items:
                    if "snapshot_json" in item:
                        runs.append(json.loads(item["snapshot_json"]))
                return runs
            except Exception as e:
                print(f"[Persistence] DynamoDB query warning: {e}")

        # Local directory check
        user_dir = os.path.join(SAVED_RUNS_DIR, user_id)
        if os.path.exists(user_dir):
            for filename in os.listdir(user_dir):
                if filename.endswith(".json"):
                    try:
                        with open(os.path.join(user_dir, filename), "r", encoding="utf-8") as f:
                            runs.append(json.load(f))
                    except Exception:
                        pass

        # Also search memory cache for this user
        for item in self._memory_cache.values():
            if item.get("user_id") == user_id and item not in runs:
                runs.append(item)

        # Sort runs by created_at descending
        runs.sort(key=lambda r: r.get("created_at", ""), reverse=True)
        return runs

    def delete_run(self, run_id: str, user_id: str) -> bool:
        """
        Deletes a run belonging to the user from memory, local storage, and DynamoDB.
        """
        # Remove from cache
        if run_id in self._memory_cache and self._memory_cache[run_id].get("user_id") == user_id:
            del self._memory_cache[run_id]

        # Remove local file
        user_file = os.path.join(SAVED_RUNS_DIR, user_id, f"{run_id}.json")
        if os.path.exists(user_file):
            try:
                os.remove(user_file)
            except Exception as e:
                print(f"[Persistence] Error removing user file: {e}")

        # Remove from DynamoDB
        if self.mode == "dynamodb" and self._dynamodb_client:
            try:
                table = self._dynamodb_client.Table(self.dynamodb_table_name)
                table.delete_item(Key={"user_id": user_id, "run_id": run_id})
            except Exception as e:
                print(f"[Persistence] DynamoDB delete error: {e}")

        return True

persistence_service = PersistenceService()
