from fastapi import APIRouter
from pipelines.tpms.DS import TPMSNetwork, TPMSGraph

# routes for detection management
network_router = APIRouter(prefix="/api/detection", tags=["Detection"])

# get all detections
@network_router.get("/")
def get_all_detections():
    return {"message": "Get all detections"}

# get detection by id
@network_router.get("/{detection_id}")
def get_detection_by_id(detection_id: str):
    return {"message": f"Get detection by id: {detection_id}"}

# get latest three readings
@network_router.get("/readings/latest")
def get_latest_three_readings():
    return {"message": "Get latest three readings"}
