from fastapi import APIRouter
import json
from pipelines.tpms.DS import TPMSNetwork, TPMSGraph, Detection

# routes for network management

network_router = APIRouter(prefix="/api/network", tags=["Network"])

# get system health for a specific node in the network
@network_router.get("/health/{node_id}")
def get_node_health(node_id: int):
    return {"message": f"Health status for node {node_id}"}

# create an ability to add a csv of all the nodes in our network which 
# contains the source_id, location_name, latitude , longitude
@network_router.post("/upload")
def upload_nodes():
    return {"message": "Upload nodes from CSV"}


# add a new node to the network
@network_router.post("/node")
def add_node():
    return {"message": "Add a new node to the network"}

@network_router.delete("/node/{node_id}")
def delete_node(node_id: int):
    return {"message": f"Delete node {node_id}"}

@network_router.get("/nodes")
def get_all_nodes():
    return {"message": "Get all nodes in the network"}

# upload a csv of nodes that you set in a perimeter
@network_router.post("/upload")
def upload_nodes():
    return {"message": "Upload nodes from CSV"}
