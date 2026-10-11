import os
import sys

# Ensure root workspace is on python path so packages.climatefit_engine is importable
workspace_root = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../"))
if workspace_root not in sys.path:
    sys.path.insert(0, workspace_root)

current_dir = os.path.abspath(os.path.dirname(__file__))
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)

from app.main import app

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
