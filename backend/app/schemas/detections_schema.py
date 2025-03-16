import uuid
from datetime import datetime
from pydantic import BaseModel
from pydantic import Field

class DetectionRead(BaseModel):
    id: uuid.UUID
    timestamp: datetime
    tpms_id: str
    tpms_model: str
    car_model: str
    location: str
    latitude: float
    longitude: float

    class Config:
        orm_mode = True

class DetectionCreate(BaseModel):
    timestamp: datetime = Field(..., example="2025-03-15T12:34:56")
    tpms_id: str = Field(..., example="TPMS123")
    tpms_model: str = Field(..., example="ModelX")
    car_model: str = Field(..., example="Tesla Model 3")
    location: str = Field(..., example="Boston Downtown")
    latitude: float = Field(..., example=42.3564)
    longitude: float = Field(..., example=-71.0622)


