import os
import json
from typing import Dict, Any, Optional

BUCKET = os.getenv("ROOFWISE_S3_BUCKET", "roofwise-runs")
REGION = os.getenv("AWS_REGION", "ap-south-1")

class S3StorageService:
    def __init__(self):
        self.bucket = BUCKET
        self.region = REGION
        self._s3_client = None
        try:
            import boto3
            self._s3_client = boto3.client("s3", region_name=self.region)
        except Exception:
            self._s3_client = None

    def upload_run_report(self, user_id: str, run_id: str, payload: Dict[str, Any]) -> str:
        """
        Uploads run snapshot JSON to user-isolated S3 prefix: s3://{bucket}/{user_id}/{run_id}.json
        Returns a 1-hour pre-signed download URL.
        If S3 credentials are unavailable, returns a fallback local download endpoint.
        """
        key = f"{user_id}/{run_id}.json"

        if self._s3_client:
            try:
                self._s3_client.put_object(
                    Bucket=self.bucket,
                    Key=key,
                    Body=json.dumps(payload, indent=2, default=str),
                    ContentType="application/json",
                    ServerSideEncryption="AES256"
                )
                url = self._s3_client.generate_presigned_url(
                    "get_object",
                    Params={"Bucket": self.bucket, "Key": key},
                    ExpiresIn=3600
                )
                return url
            except Exception as e:
                print(f"[StorageService] S3 upload error: {e}")

        # Local fallback URL
        return f"/simulations/{run_id}"

storage_service = S3StorageService()
