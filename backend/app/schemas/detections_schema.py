import uuid
from datetime import datetime
from pydantic import BaseModel

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
