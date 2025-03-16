from fastapi import APIRouter, File, UploadFile, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Optional
import pandas as pd
import networkx as nx
from database import db  
from DS import TPMSGraph, TPMSNetwork 

visualize_router = APIRouter(prefix="/api/visualize", tags=["Visualize"])

@visualize_router.post("/graph", response_model=dict)
def create_graph(
    file: UploadFile = File(...),
    db: Session = Depends(db.get_db)
):
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Only CSV files are accepted")
    
    # Read CSV into DataFrame; use only the desired columns.
    df = pd.read_csv(
        file.file,
        usecols=["timestamp", "tpms_id", "tpms_model", "car_model", "location", "latitude", "longitude"]
    )
    
    # Create TPMSGraph instance.
    graph_obj = TPMSGraph(df)
    graph_obj.build_graph()
    vehicle_groups = graph_obj.find_vehicle_groups()
    confidence_scores = graph_obj.calculate_confidence_scores()
    
    # Convert NetworkX graph to a serializable format.
    graph_data = nx.node_link_data(graph_obj.graph)
    
    return {
        "graph": graph_data,
        "vehicle_groups": vehicle_groups,
        "confidence_scores": confidence_scores
    }

# Define the CSV columns we expect.
CSV_COLUMNS = ["timestamp", "tpms_id", "tpms_model", "car_model", "location", "latitude", "longitude"]

@visualize_router.post("/network", response_model=dict)
def create_network(
    file: UploadFile = File(...),
    search_by_ids: Optional[list[str]] = None,
    search_by_model: Optional[str] = None,  # Optional; can be ignored if not used.
    build_node_path: Optional[str] = None,
    db: Session = Depends(db.get_db)
):
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Only CSV files are accepted")
    
    # Read CSV into DataFrame using only the desired columns.
    df = pd.read_csv(file.file, usecols=CSV_COLUMNS)
    
    # Create a new TPMSNetwork instance.
    detection_graph = TPMSNetwork()

    # Iterate over rows and add events.
    for _, row in df.iterrows():
        try:
            event = {
                "timestamp": pd.to_datetime(row["timestamp"]),
                "location": row["location"],
                "latitude": float(row["latitude"]),
                "longitude": float(row["longitude"]),
                "battery": 0.0,            # Default value since CSV doesn't provide battery.
                "signal_strength": 0.0,      # Default value since CSV doesn't provide signal strength.
                "tire_ids": [str(row["tpms_id"]).strip()],
                "car_description": row["car_model"]
            }
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Error parsing CSV row: {e}")
        
        detection_graph.add_event(**event)

    tire_detected_by_id = None
    tire_detected_by_model = None  # This remains optional.
    node_path = None
    coordinates = None

    if search_by_ids:
        tire_detected_by_id = detection_graph.search_by_tire_ids(search_by_ids)
    
    if search_by_model:
        tire_detected_by_model = detection_graph.search_by_tire_model(search_by_model)
    
    if build_node_path:
        node_path = detection_graph.get_path_by_tire(build_node_path)
    
    if node_path:
        coordinates = detection_graph.get_path_coordinates(node_path)
    
    return {
        "tire_detected_by_id": tire_detected_by_id,
        "tire_detected_by_model": tire_detected_by_model,
        "node_path": node_path,
        "path_node_coordinates": coordinates
    }
