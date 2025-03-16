from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
import subprocess

router = APIRouter(prefix="/live", tags=["live"])

@router.get("/live_data", response_class=FileResponse)
async def live_data():
    remote_path = "donkey@10.26.203.17:/home/donkey/data.csv"
    local_path = "./data.csv"
    
    # Run SCP command to copy file from remote host
    try:
        result = subprocess.run(
            ["scp", remote_path, local_path],
            check=True,
            capture_output=True,
            text=True,
        )
    except subprocess.CalledProcessError as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch live data: {e.stderr}")
    
    # Return the fetched file as a CSV response
    return FileResponse(local_path, media_type="text/csv", filename="data.csv")
