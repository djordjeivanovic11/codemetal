from fastapi import APIRouter, File, UploadFile, BackgroundTasks, HTTPException, Depends
from datetime import datetime
from database import db
from models.models import Detection
from sqlalchemy.orm import Session
from routers.detection.detection_router import create_detection
from routers.upload.utils import create_detection_logic
from schemas.detections_schema import DetectionCreate

upload_router = APIRouter(prefix="/api/upload", tags=["Upload"])


@upload_router.post("/csv")
async def upload_csv(
    file: UploadFile = File(...),
    db: Session = Depends(db.get_db)
):
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Only CSV files are accepted")

    contents = await file.read()
    lines = contents.decode().splitlines()
    header = lines[0].split(",")
    
    for row in lines[1:]:
        if not row.strip():
            continue
        values = row.split(",")
        data = dict(zip(header, values))
        
        detection_create = DetectionCreate(
            timestamp=datetime.fromisoformat(
                data.get("timestamp", datetime.now().isoformat())
            ),
            tpms_id=data.get("tpms_id", ""),
            tpms_model=data.get("tpms_model", ""),
            car_model=data.get("car_model", ""),
            location=data.get("location", ""),
            latitude=float(data.get("latitude", 0.0)),
            longitude=float(data.get("longitude", 0.0)),
            signal_strength=float(data.get("signal_strength", 0.0))
            if "signal_strength" in data else 0.0
        )
        # Use the helper function with the injected db session
        create_detection_logic(detection_create, db)
    
    return {"message": "CSV processing initiated."}



    
# @upload_router.get("/status/{job_id}")
# async def get_processing_status(job_id: str):
#     """Check the status of a CSV processing job"""
#     if job_id not in processed_results:
#         raise HTTPException(status_code=404, detail="Job not found")
    
#     job = processed_results[job_id]
    
#     # If job is complete, include paths and vehicle groups in the response
#     if job["status"] == "completed":
#         return {
#             "status": job["status"],
#             "filename": job["filename"],
#             "timestamp": job["timestamp"],
#             "stats": job["results"]["stats"],
#             "vehicle_count": len(job["results"]["vehicles"])
#         }
#     elif job["status"] == "failed":
#         return {
#             "status": job["status"],
#             "filename": job["filename"],
#             "timestamp": job["timestamp"],
#             "error": job["error"]
#         }
#     else:
#         return {
#             "status": job["status"],
#             "filename": job["filename"],
#             "timestamp": job["timestamp"]
#         }

# @upload_router.get("/results/{job_id}")
# async def get_processing_results(job_id: str):
#     """Get the full results of a completed CSV processing job"""
#     if job_id not in processed_results:
#         raise HTTPException(status_code=404, detail="Job not found")
    
#     job = processed_results[job_id]
    
#     if job["status"] != "completed":
#         raise HTTPException(status_code=400, 
#                            detail=f"Job is not completed. Current status: {job['status']}")
    
#     return job["results"]

# @upload_router.get("/vehicles/{job_id}")
# async def get_vehicle_groups(job_id: str):
#     """Get just the vehicle groups from a completed job"""
#     if job_id not in processed_results:
#         raise HTTPException(status_code=404, detail="Job not found")
    
#     job = processed_results[job_id]
    
#     if job["status"] != "completed":
#         raise HTTPException(status_code=400, 
#                            detail=f"Job is not completed. Current status: {job['status']}")
    
#     return {"vehicles": job["results"]["vehicles"]}

# @upload_router.get("/network/{job_id}")
# async def get_network(job_id: str):
#     """Get the TPMSNetwork from a completed job"""
#     if job_id not in processed_results:
#         raise HTTPException(status_code=404, detail="Job not found")
    
#     job = processed_results[job_id]
    
#     if job["status"] != "completed":
#         raise HTTPException(status_code=400, 
#                            detail=f"Job is not completed. Current status: {job['status']}")
    
#     return {"network": job["results"]["network"]}