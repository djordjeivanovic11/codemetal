import asyncio
from sqlalchemy.orm import Session
from DS import TPMSNetwork
from models.models import Detection
from database.db import SessionLocal  

tpms_network_global = TPMSNetwork()

async def update_tpms_network():
    global tpms_network_global
    while True:
        try:
            new_network = TPMSNetwork()
            with SessionLocal() as db:
                db_detections = db.query(Detection).all()
                for det in db_detections:
                    new_network.add_event(
                        timestamp=det.timestamp,
                        location=det.location,
                        latitude=det.latitude,
                        longitude=det.longitude,
                        battery=getattr(det, "battery", 100.0),       
                        signal_strength=getattr(det, "signal_strength", 0.0), 
                        tire_ids=[det.tpms_id],
                        car_description=det.car_model 
                    )
            tpms_network_global = new_network
            print("TPMS network updated.")
        except Exception as e:
            print("Error updating TPMS network:", e)
        await asyncio.sleep(15)
