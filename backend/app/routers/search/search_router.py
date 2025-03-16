from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from database import db
from models.models import Detection

search_router = APIRouter(prefix="/api/search", tags=["Search"])

def serialize_detection(detection: Detection) -> Dict[str, Any]:
    """
    Convert a Detection model instance into a dictionary.
    """
    data = detection.__dict__.copy()
    data.pop("_sa_instance_state", None)
    return data

@search_router.get("/ids", response_model=Dict[str, Any])
def search_by_ids(
    # Use alias "ids[]" to capture parameters like ids[]=value
    ids: List[str] = Query(..., alias="ids[]", min_items=1, max_items=4),
    db: Session = Depends(db.get_db)
) -> Dict[str, Any]:
    """
    Search detections by tpms_id values. Accepts between 1 and 4 ids.
    Example URL: /api/search/ids?ids[]=123&ids[]=456
    """
    # Trim whitespace from each ID.
    trimmed_ids = [id.strip() for id in ids]
    detections = db.query(Detection).filter(Detection.tpms_id.in_(trimmed_ids)).all()
    if not detections:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No detections found for the provided IDs."
        )
    return {"detections": [serialize_detection(det) for det in detections]}

@search_router.get("/model/{model_name}", response_model=Dict[str, Any])
def search_by_model(
    model_name: str,
    db: Session = Depends(db.get_db)
) -> Dict[str, Any]:
    """
    Search detections by sensor model.
    Example URL: /api/search/model/ABC123
    """
    # Trim any extra whitespace from the model name.
    model_name = model_name.strip()
    detections = db.query(Detection).filter(
        Detection.tpms_model.ilike(f"%{model_name}%")
    ).all()
    if not detections:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No detections found for the given model."
        )
    return {"detections": [serialize_detection(det) for det in detections]}

@search_router.get("/model/{model_name}/id/{tpms_id}", response_model=Dict[str, Any])
def search_by_model_and_id(
    model_name: str,
    tpms_id: str,
    db: Session = Depends(db.get_db)
) -> Dict[str, Any]:
    """
    Search detections by sensor model and sensor id.
    Example URL: /api/search/model/ABC123/id/123
    """
    model_name = model_name.strip()
    tpms_id = tpms_id.strip()
    detections = db.query(Detection).filter(
        Detection.tpms_model.ilike(f"%{model_name}%"),
        Detection.tpms_id == tpms_id
    ).all()
    if not detections:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No detections found for the given model and id."
        )
    return {"detections": [serialize_detection(det) for det in detections]}

@search_router.get("/ids/summary", response_model=Dict[str, Any])
def search_ids_summary(
    # Use alias "ids[]" to capture parameters like ids[]=value
    ids: List[str] = Query(..., alias="ids[]", min_items=1, max_items=4),
    db: Session = Depends(db.get_db)
) -> Dict[str, Any]:
    """
    Search detections by tpms_id values and return only a summary of fields:
    timestamp, location, latitude, and longitude.
    Example URL: /api/search/ids/summary?ids[]=123&ids[]=456
    """
    # Trim whitespace from each ID.
    trimmed_ids = [id.strip() for id in ids]
    detections = db.query(Detection).filter(Detection.tpms_id.in_(trimmed_ids)).all()
    if not detections:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No detections found for the provided IDs."
        )
    # Return only the desired fields.
    summary = [
        {
            "timestamp": det.timestamp,
            "location": det.location,
            "latitude": det.latitude,
            "longitude": det.longitude,
        }
        for det in detections
    ]
    return {"detections": summary}
