from fastapi import APIRouter, UploadFile, File, HTTPException, Depends, BackgroundTasks
from fastapi.responses import JSONResponse
import pandas as pd
import io
import uuid
import os
from typing import List, Dict, Any, Optional
from datetime import datetime
import json

from pipelines.tpms.DS import TPMSNetwork, TPMSGraph
from pipelines.tpms.algorithms import build_cooccurrence_graph, find_vehicle_groups, calculate_confidence_scores

# Router for file upload and processing
upload_router = APIRouter(prefix="/api/upload", tags=["Data Upload"])

# Store processed results
processed_results = {}

def parse_timestamp(timestamp_str):
    """Convert timestamp string to datetime object"""
    try:
        return pd.to_datetime(timestamp_str)
    except:
        raise ValueError(f"Invalid timestamp format: {timestamp_str}")

def process_csv_data(df: pd.DataFrame) -> Dict[str, Any]:
    """
    Process the uploaded CSV data and run graph algorithms
    
    Parameters:
        df: Pandas DataFrame containing the TPMS readings
        
    Returns:
        Dictionary with processing results
    """
    # Ensure required columns exist
    required_columns = ['timestamp', 'tpms_id', 'location', 'latitude', 'longitude']
    missing_columns = [col for col in required_columns if col not in df.columns]
    
    if missing_columns:
        raise ValueError(f"CSV is missing required columns: {', '.join(missing_columns)}")
    
    # Convert timestamp to datetime if it's not already
    if not pd.api.types.is_datetime64_any_dtype(df['timestamp']):
        df['timestamp'] = df['timestamp'].apply(parse_timestamp)
    
    # Handle missing optional columns
    if 'tpms_model' not in df.columns:
        df['tpms_model'] = 'unknown'
    if 'car_model' not in df.columns:
        df['car_model'] = 'unknown'
    if 'signal_strength' not in df.columns:
        df['signal_strength'] = 0.0
    
    # Run TPMS grouping algorithm
    time_threshold = 5  # seconds
    weight_threshold = 2
    
    # Build co-occurrence graph
    G = build_cooccurrence_graph(df, time_threshold)
    
    # Find vehicle groups
    vehicle_groups = find_vehicle_groups(G, weight_threshold)
    
    # Calculate confidence scores
    confidence_scores = calculate_confidence_scores(G, vehicle_groups)
    
    # Create TPMSNetwork to track movement paths
    network = TPMSNetwork()
    
    # Group TPMS readings by timestamp and location to find co-occurring sensor events
    for vehicle_idx, group in enumerate(vehicle_groups):
        # Get confidence score for this group
        confidence = confidence_scores.get(vehicle_idx, 0)
        
        # Filter data for this vehicle's sensors
        vehicle_data = df[df['tpms_id'].isin(group)]
        
        # Group by approximate timestamp (rounded to nearest 5 seconds)
        vehicle_data['timestamp_rounded'] = vehicle_data['timestamp'].dt.round('5S')
        
        # Group by timestamp and location to find when all sensors were detected together
        grouped_events = vehicle_data.groupby(['timestamp_rounded', 'location'])
        
        for (timestamp, location), event_data in grouped_events:
            # Check if we have at least 2 sensors in this group (more likely to be a valid detection)
            if len(event_data) >= 2:
                # Get representative data for this event
                lat = event_data['latitude'].mean()
                lon = event_data['longitude'].mean()
                signal = event_data['signal_strength'].mean() if 'signal_strength' in event_data else 0
                battery = event_data.get('battery', [0]).mean() if 'battery' in event_data else 0
                
                # Get list of tire IDs for this event
                tire_ids = event_data['tpms_id'].tolist()
                
                # Add event to network
                network.add_event(
                    timestamp=timestamp,
                    location=location,
                    latitude=lat,
                    longitude=lon,
                    battery=battery,
                    signal_strength=signal,
                    tire_ids=tire_ids,
                    car_description=f"Vehicle Group {vehicle_idx+1} (Confidence: {confidence:.1f}%)"
                )
    
    # Extract summary statistics
    stats = {
        "total_readings": len(df),
        "unique_sensors": df['tpms_id'].nunique(),
        "vehicle_groups": len(vehicle_groups),
        "locations": df['location'].nunique(),
        "time_range": {
            "start": df['timestamp'].min().isoformat(),
            "end": df['timestamp'].max().isoformat()
        }
    }
    
    # Prepare vehicle group data for frontend
    vehicles_data = []
    for i, group in enumerate(vehicle_groups):
        confidence = confidence_scores.get(i, 0)
        
        # Get sample readings for this group
        group_readings = df[df['tpms_id'].isin(group)].sort_values('timestamp')
        
        # Extract model information if available
        tpms_models = group_readings['tpms_model'].unique().tolist() if 'tpms_model' in group_readings else []
        car_models = group_readings['car_model'].unique().tolist() if 'car_model' in group_readings else []
        
        # Get path information
        if len(group) > 0:
            # Use first tire ID to get the path
            path = network.get_path_by_tire(group[0])
            path_details = network.get_path_details(path)
        else:
            path_details = []
        
        vehicles_data.append({
            "group_id": i,
            "tire_ids": group,
            "confidence": confidence,
            "tpms_models": tpms_models,
            "car_models": car_models,
            "detection_count": len(group_readings),
            "path": path_details
        })
    
    # Return results
    return {
        "stats": stats,
        "vehicles": vehicles_data,
        "network": network.to_dict()
    }

def background_process_csv(file_content: bytes, filename: str, job_id: str):
    """Background task to process CSV file"""
    try:
        # Parse CSV
        df = pd.read_csv(io.StringIO(file_content.decode('utf-8')))
        
        # Process data
        results = process_csv_data(df)
        
        # Store results
        processed_results[job_id] = {
            "status": "completed",
            "filename": filename,
            "timestamp": datetime.now().isoformat(),
            "results": results
        }
    except Exception as e:
        # Store error
        processed_results[job_id] = {
            "status": "failed",
            "filename": filename,
            "timestamp": datetime.now().isoformat(),
            "error": str(e)
        }

@upload_router.post("/csv")
async def upload_csv(background_tasks: BackgroundTasks, file: UploadFile = File(...)):
    """
    Upload and process a CSV file containing TPMS sensor readings
    
    The CSV should contain at minimum these columns:
    - timestamp: Date/time of the reading
    - tpms_id: Unique identifier for the tire sensor
    - location: Name of the detection location
    - latitude: Latitude coordinate
    - longitude: Longitude coordinate
    
    Optional columns:
    - tpms_model: Model of the TPMS sensor
    - car_model: Model of the vehicle
    - signal_strength: Signal strength of the reading
    - battery: Battery level of the sensor node
    """
    # Validate file type
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Only CSV files are accepted")
    
    # Read file content
    contents = await file.read()
    
    # Generate a job ID
    job_id = str(uuid.uuid4())
    
    # Store initial job status
    processed_results[job_id] = {
        "status": "processing",
        "filename": file.filename,
        "timestamp": datetime.now().isoformat()
    }
    
    # Process CSV in background
    background_tasks.add_task(background_process_csv, contents, file.filename, job_id)
    
    # Return job ID for status checking
    return {"job_id": job_id, "status": "processing"}

@upload_router.get("/status/{job_id}")
async def get_processing_status(job_id: str):
    """Check the status of a CSV processing job"""
    if job_id not in processed_results:
        raise HTTPException(status_code=404, detail="Job not found")
    
    job = processed_results[job_id]
    
    # If job is complete, include paths and vehicle groups in the response
    if job["status"] == "completed":
        return {
            "status": job["status"],
            "filename": job["filename"],
            "timestamp": job["timestamp"],
            "stats": job["results"]["stats"],
            "vehicle_count": len(job["results"]["vehicles"])
        }
    elif job["status"] == "failed":
        return {
            "status": job["status"],
            "filename": job["filename"],
            "timestamp": job["timestamp"],
            "error": job["error"]
        }
    else:
        return {
            "status": job["status"],
            "filename": job["filename"],
            "timestamp": job["timestamp"]
        }

@upload_router.get("/results/{job_id}")
async def get_processing_results(job_id: str):
    """Get the full results of a completed CSV processing job"""
    if job_id not in processed_results:
        raise HTTPException(status_code=404, detail="Job not found")
    
    job = processed_results[job_id]
    
    if job["status"] != "completed":
        raise HTTPException(status_code=400, 
                           detail=f"Job is not completed. Current status: {job['status']}")
    
    return job["results"]

@upload_router.get("/vehicles/{job_id}")
async def get_vehicle_groups(job_id: str):
    """Get just the vehicle groups from a completed job"""
    if job_id not in processed_results:
        raise HTTPException(status_code=404, detail="Job not found")
    
    job = processed_results[job_id]
    
    if job["status"] != "completed":
        raise HTTPException(status_code=400, 
                           detail=f"Job is not completed. Current status: {job['status']}")
    
    return {"vehicles": job["results"]["vehicles"]}

@upload_router.get("/network/{job_id}")
async def get_network(job_id: str):
    """Get the TPMSNetwork from a completed job"""
    if job_id not in processed_results:
        raise HTTPException(status_code=404, detail="Job not found")
    
    job = processed_results[job_id]
    
    if job["status"] != "completed":
        raise HTTPException(status_code=400, 
                           detail=f"Job is not completed. Current status: {job['status']}")
    
    return {"network": job["results"]["network"]}