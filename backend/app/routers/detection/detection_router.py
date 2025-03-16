from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from datetime import datetime
import uuid
from typing import Dict, Any
from database import db
from models.models import Detection
from schemas.detections_schema import DetectionCreate

router = APIRouter(prefix="/api/detection", tags=["Detection"])

@router.get("/", response_model=Dict[str, Any])
def get_all_detections(db: Session = Depends(db.get_db)) -> Dict[str, Any]:
    """
    Return all detections from the database.
    """
    try:
        detections = db.query(Detection).all()
    except SQLAlchemyError:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error fetching detections."
        )
    
    if not detections:
        return {"message": "No detections found"}
    
    # Convert detections to dictionaries
    detections_data = []
    for detection in detections:
        data = detection.__dict__.copy()
        data.pop('_sa_instance_state', None)
        detections_data.append(data)
    
    return {"detections": detections_data}


@router.get("/{detection_id}", response_model=Dict[str, Any])
def get_detection_by_id(detection_id: str, db: Session = Depends(db.get_db)) -> Dict[str, Any]:
    """
    Look up a detection by ID from the database.
    """
    try:
        detection_uuid = uuid.UUID(detection_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid detection ID format."
        )
    
    detection = db.query(Detection).filter(Detection.id == detection_uuid).first()
    if detection is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Detection ID {detection_id} not found."
        )
    
    data = detection.__dict__.copy()
    data.pop('_sa_instance_state', None)
    return {"detection": data}


@router.get("/latest", response_model=Dict[str, Any])
def get_latest_detections(db: Session = Depends(db.get_db)) -> Dict[str, Any]:
    """
    Return the latest three detections based on their timestamps.
    """
    try:
        latest_detections = (
            db.query(Detection)
            .order_by(Detection.timestamp.desc())
            .limit(3)
            .all()
        )
    except SQLAlchemyError:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error fetching latest detections."
        )
    
    if not latest_detections:
        return {"message": "No detections found"}
    
    latest_data = []
    for detection in latest_detections:
        data = detection.__dict__.copy()
        data.pop('_sa_instance_state', None)
        latest_data.append(data)
    
    return {"latest": latest_data}

@router.post("/", response_model=Dict[str, Any])
def create_detection(
    detection_in: DetectionCreate,
) -> Dict[str, Any]:
    new_detection = Detection(
        id=uuid.uuid4(),
        timestamp=detection_in.timestamp,
        tpms_id=detection_in.tpms_id,
        tpms_model=detection_in.tpms_model,
        car_model=detection_in.car_model,
        location=detection_in.location,
        latitude=detection_in.latitude,
        longitude=detection_in.longitude,
    )

    try:
        db.add(new_detection)
        db.commit()
        db.refresh(new_detection)
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create detection."
        ) from e

    return {"id": str(new_detection.id), "message": "Detection created successfully."}
