from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import db
import models
import uvicorn
import asyncio
from background_tasks import update_tpms_network

# Import the auth router from your routes file
from routers.auth.auth_router import router as auth_router
from routers.upload.upload import upload_router
from routers.detection import detection_router
from routers.network import network_router
from routers.search import search_router
from routers.visualize.route import visualize_router

app = FastAPI(title="LANTERN API", version="1.0.0")

origins = ["http://localhost:3000"]

app.add_middleware(
    CORSMiddleware, 
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the authentication router
app.include_router(auth_router)
app.include_router(upload_router)
app.include_router(detection_router.router)
app.include_router(network_router.network_router)
app.include_router(search_router.search_router)
app.include_router(visualize_router)

# Create database tables
db.Base.metadata.create_all(bind=db.engine)

@app.on_event("startup")
async def startup_event():
    # Start the update task for the TPMS network.
    asyncio.create_task(update_tpms_network())


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
