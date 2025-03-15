from fastapi import APIRouter
from DS import TPMSNetwork, TPMSGraph

# routes for searching specific cars in the network
search_router = APIRouter(app_prefix="/api/search", tags=["Search"])

# search endpoint
@search_router.get("/")
def search():
    return {"message": "Search endpoint"}

#search by id or a list of ids 1 min to 4 max ids)
@search_router.get("/ids/{ids}")
def search_by_ids(ids: list[int]):
    return {"message": f"Search by ids: {ids}"}
 
# search the network by a specific model
@search_router.get("/model/{model_name}")
def search_by_model(model_name: str):
    return {"message": f"Search by model: {model_name}"}

# search the network by a specific model and id
@search_router.get("/model/{model_name}/id/{id}")
def search_by_model_and_id(model_name: str, id: int):
    return {"message": f"Search by model: {model_name} and id: {id}"}

# search in a specific time window
@search_router.get("/time/{start_time}/{end_time}")
def search_by_time(start_time: str, end_time: str):
    return {"message": f"Search by time from {start_time} to {end_time}"}

# search by a radius around a specific location
@search_router.get("/location/{latitude}/{longitude}/{radius}")
def search_by_location(latitude: float, longitude: float, radius: float):
    return {"message": f"Search by location: ({latitude}, {longitude}) with radius {radius}"}
