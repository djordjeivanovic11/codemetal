from fastapi import APIRouter
from background_tasks import tpms_network_global
from typing import Dict, Any

router = APIRouter(prefix="/api/detection", tags=["Detection"])

@router.get("/")
def get_all_detections() -> Dict[str, Any]:
    """
    Return all detections as stored in the in-memory TPMS network.
    """
    return {"message": "All detections", "network": tpms_network_global.to_dict()}

@router.get("/{detection_id}")
def get_detection_by_id(detection_id: int) -> Dict[str, Any]:
    """
    Look up a detection by node ID in the in-memory network.
    """
    if detection_id not in tpms_network_global.graph:
        return {"message": f"Detection ID {detection_id} not found"}
    detection_data = tpms_network_global.graph.nodes[detection_id]
    return {"message": f"Detection ID {detection_id}", "data": detection_data}

@router.get("/latest")
def get_latest_detections() -> Dict[str, Any]:
    """
    Return the latest three detections based on their timestamps.
    """
    nodes = list(tpms_network_global.graph.nodes())
    nodes.sort(key=lambda n: tpms_network_global.graph.nodes[n].get("timestamp"))
    latest = nodes[-3:] if len(nodes) >= 3 else nodes
    latest_details = tpms_network_global.get_path_details(latest)
    return {"message": "Latest detections", "latest": latest_details}
