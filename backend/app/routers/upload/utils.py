import uuid
from typing import Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from fastapi import HTTPException, status
from models.models import Detection
from schemas.detections_schema import DetectionCreate


def create_detection_logic(detection_in: DetectionCreate, db: Session) -> Dict[str, Any]:
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
# from fastapi import APIRouter
# import pandas as pd
# from typing import List, Dict, Any
# from DS import TPMSNetwork, TPMSGraph

# df = pd.DataFrame() 
# graph = TPMSGraph(df)

# upload_router = APIRouter(prefix="/api/upload", tags=["Data Upload"])

# processed_results = {}

# def parse_timestamp(timestamp_str):
#     """Convert timestamp string to datetime object"""
#     try:
#         return pd.to_datetime(timestamp_str)
#     except:
#         raise ValueError(f"Invalid timestamp format: {timestamp_str}")

# def process_vehicle_groups(df: pd.DataFrame, time_threshold: int = 5, weight_threshold: int = 2) -> Dict[str, Any]:
#     """
#     Process TPMS data to identify vehicle groups using co-occurrence graph algorithm.
#     This function expects the data to be already filtered for a specific car model or sensor ID if needed.
    
#     Parameters:
#         df: Pandas DataFrame containing the TPMS readings
#         time_threshold: Time threshold in seconds for co-occurrence
#         weight_threshold: Weight threshold for edge pruning
        
#     Returns:
#         Dictionary with vehicle grouping results
#     """
#     # Ensure required columns exist
#     required_columns = ['timestamp', 'tpms_id', 'location']
#     missing_columns = [col for col in required_columns if col not in df.columns]
    
#     if missing_columns:
#         raise ValueError(f"DataFrame is missing required columns: {', '.join(missing_columns)}")
    
#     # Convert timestamp to datetime if it's not already
#     if not pd.api.types.is_datetime64_any_dtype(df['timestamp']):
#         df['timestamp'] = df['timestamp'].apply(parse_timestamp)
    
#     # Build co-occurrence graph
#     G = graph.build_cooccurrence_graph(df, time_threshold)
    
#     # Find vehicle groups
#     vehicle_groups = graph.find_vehicle_groups(G, weight_threshold)
    
#     # Calculate confidence scores
#     confidence_scores = graph.calculate_confidence_scores(G, vehicle_groups)
    
#     return {
#         "graph": G,
#         "vehicle_groups": vehicle_groups,
#         "confidence_scores": confidence_scores
#     }


# def build_vehicle_network(df: pd.DataFrame, vehicle_groups: List[List[str]], confidence_scores: Dict[int, float]) -> Dict[str, Any]:
#     """
#     Build a network of vehicle movements using the identified vehicle groups.
#     This function creates a TPMSNetwork to track vehicle paths and generates summary statistics.
    
#     Parameters:
#         df: Pandas DataFrame containing the TPMS readings
#         vehicle_groups: List of lists, where each inner list contains TPMS IDs for a vehicle
#         confidence_scores: Dictionary mapping group index to confidence score
        
#     Returns:
#         Dictionary with network, vehicle data, and statistics
#     """
#     # Ensure required columns exist
#     required_columns = ['timestamp', 'tpms_id', 'location', 'latitude', 'longitude']
#     missing_columns = [col for col in required_columns if col not in df.columns]
    
#     if missing_columns:
#         raise ValueError(f"DataFrame is missing required columns: {', '.join(missing_columns)}")
    
#     # Convert timestamp to datetime if it's not already
#     if not pd.api.types.is_datetime64_any_dtype(df['timestamp']):
#         df['timestamp'] = df['timestamp'].apply(parse_timestamp)
    
#     # Handle missing optional columns
#     if 'tpms_model' not in df.columns:
#         df['tpms_model'] = 'unknown'
#     if 'car_model' not in df.columns:
#         df['car_model'] = 'unknown'
#     if 'signal_strength' not in df.columns:
#         df['signal_strength'] = 0.0
    
#     # Create TPMSNetwork to track movement paths
#     network = TPMSNetwork()
    
#     # Group TPMS readings by timestamp and location to find co-occurring sensor events
#     for vehicle_idx, group in enumerate(vehicle_groups):
#         # Get confidence score for this group
#         confidence = confidence_scores.get(vehicle_idx, 0)
        
#         # Filter data for this vehicle's sensors
#         vehicle_data = df[df['tpms_id'].isin(group)]
        
#         # Skip if no data for this group
#         if vehicle_data.empty:
#             continue
        
#         # Group by approximate timestamp (rounded to nearest 5 seconds)
#         vehicle_data['timestamp_rounded'] = vehicle_data['timestamp'].dt.round('5S')
        
#         # Group by timestamp and location to find when all sensors were detected together
#         grouped_events = vehicle_data.groupby(['timestamp_rounded', 'location'])
        
#         for (timestamp, location), event_data in grouped_events:
#             # Check if we have at least 2 sensors in this group (more likely to be a valid detection)
#             if len(event_data) >= 2:
#                 # Get representative data for this event
#                 lat = event_data['latitude'].mean()
#                 lon = event_data['longitude'].mean()
#                 signal = event_data['signal_strength'].mean() if 'signal_strength' in event_data else 0
#                 battery = event_data.get('battery', [0]).mean() if 'battery' in event_data else 0
                
#                 # Get list of tire IDs for this event
#                 tire_ids = event_data['tpms_id'].tolist()
                
#                 # Add event to network
#                 network.add_event(
#                     timestamp=timestamp,
#                     location=location,
#                     latitude=lat,
#                     longitude=lon,
#                     battery=battery,
#                     signal_strength=signal,
#                     tire_ids=tire_ids,
#                     car_description=f"Vehicle Group {vehicle_idx+1} (Confidence: {confidence:.1f}%)"
#                 )
    
#     # Extract summary statistics
#     stats = {
#         "total_readings": len(df),
#         "unique_sensors": df['tpms_id'].nunique(),
#         "vehicle_groups": len(vehicle_groups),
#         "locations": df['location'].nunique(),
#         "time_range": {
#             "start": df['timestamp'].min().isoformat(),
#             "end": df['timestamp'].max().isoformat()
#         }
#     }
    
#     # Prepare vehicle group data for frontend
#     vehicles_data = []
#     for i, group in enumerate(vehicle_groups):
#         confidence = confidence_scores.get(i, 0)
        
#         # Get sample readings for this group
#         group_readings = df[df['tpms_id'].isin(group)].sort_values('timestamp')
        
#         # Skip if no readings
#         if group_readings.empty:
#             continue
        
#         # Extract model information if available
#         tpms_models = group_readings['tpms_model'].unique().tolist() if 'tpms_model' in group_readings else []
#         car_models = group_readings['car_model'].unique().tolist() if 'car_model' in group_readings else []
        
#         # Get path information
#         if len(group) > 0:
#             # Use first tire ID to get the path
#             path = network.get_path_by_tire(group[0])
#             path_details = network.get_path_details(path)
#         else:
#             path_details = []
        
#         vehicles_data.append({
#             "group_id": i,
#             "tire_ids": group,
#             "confidence": confidence,
#             "tpms_models": tpms_models,
#             "car_models": car_models,
#             "detection_count": len(group_readings),
#             "path": path_details
#         })
    
#     # Return results
#     return {
#         "stats": stats,
#         "vehicles": vehicles_data,
#         "network": network.to_dict()
#     }


# # Example of how to use these functions in sequence:
# def process_csv_data(df: pd.DataFrame) -> Dict[str, Any]:
#     """
#     Process the uploaded CSV data and run graph algorithms
    
#     Parameters:
#         df: Pandas DataFrame containing the TPMS readings
        
#     Returns:
#         Dictionary with processing results
#     """
#     # First, process the data to identify vehicle groups
#     grouping_results = process_vehicle_groups(df)
    
#     # Then, build the network using the identified groups
#     network_results = build_vehicle_network(
#         df, 
#         grouping_results["vehicle_groups"], 
#         grouping_results["confidence_scores"]
#     )
    
#     # You can also include the graph in the results if needed
#     network_results["graph"] = grouping_results["graph"]
    
#     return network_results


# # Example of how to filter data before grouping:
# def process_filtered_data(df: pd.DataFrame, filter_model: str = None, filter_tpms_id: str = None) -> Dict[str, Any]:
#     """
#     Filter data for a specific model or TPMS ID, then process it
    
#     Parameters:
#         df: Pandas DataFrame containing the TPMS readings
#         filter_model: Optional model name to filter by
#         filter_tpms_id: Optional TPMS ID to filter by
        
#     Returns:
#         Dictionary with processing results
#     """
#     # Apply filters if provided
#     filtered_df = df.copy()
    
#     if filter_model and 'tpms_model' in df.columns:
#         filtered_df = filtered_df[filtered_df['tpms_model'] == filter_model]
    
#     if filter_tpms_id:
#         # If filtering by a specific TPMS ID, we might want to include other sensors 
#         # from the same vehicle, but we don't know which ones yet
#         # For now, just filter by the ID
#         filtered_df = filtered_df[filtered_df['tpms_id'] == filter_tpms_id]
    
#     # Check if we have enough data after filtering
#     if len(filtered_df) < 10:
#         raise ValueError("Not enough data after filtering")
    
#     # Process the filtered data
#     grouping_results = process_vehicle_groups(filtered_df)
    
#     # Build network using the original dataframe but only for the identified groups
#     # This way we include all the data for the identified vehicles
#     network_results = build_vehicle_network(
#         df,  # Use full dataset
#         grouping_results["vehicle_groups"], 
#         grouping_results["confidence_scores"]
#     )
    
#     # Include the graph in the results
#     network_results["graph"] = grouping_results["graph"]
    
#     return network_results
