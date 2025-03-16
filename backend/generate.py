import csv
import uuid
import random
import datetime

# Define CSV header
header = ["uuid", "timestamp", "tpms_id", "sensor_model", "car_model", "location", "latitude", "longitude"]

# Fixed sensor data for the new sensor
tpms_id = "TPMS_NEW_200_NODE"
sensor_model = "Test Sensor Model"
car_model = "Test Car Model"
location = "Downtown Boston"

# Downtown Boston approximate center
center_lat = 42.3601
center_lon = -71.0589
variation = 0.01  # Variation for coordinates (~1km range)

def random_coord(center: float, variation: float) -> float:
    return center + random.uniform(-variation, variation)

# Set the time window: between 06:00:00 and 07:00:00 on June 15, 2023.
start_time = datetime.datetime(2023, 6, 15, 6, 0, 0)
end_time = datetime.datetime(2023, 6, 15, 7, 0, 0)
total_seconds = (end_time - start_time).total_seconds()

# Open a file to write the CSV data.
with open("generated_data.csv", "w", newline="") as f:
    writer = csv.writer(f)
    writer.writerow(header)
    
    # Generate 200 rows of sample data.
    for _ in range(200):
        # Generate a random unique identifier.
        uid = str(uuid.uuid4())
        
        # Generate a random timestamp within the interval.
        random_seconds = random.uniform(0, total_seconds)
        timestamp = start_time + datetime.timedelta(seconds=random_seconds)
        # Format timestamp as ISO8601 with microseconds and a "T" separator.
        timestamp_str = timestamp.strftime("%Y-%m-%dT%H:%M:%S.%f")
        
        # Generate random coordinates around downtown Boston.
        lat = random_coord(center_lat, variation)
        lon = random_coord(center_lon, variation)
        
        # Write the row.
        writer.writerow([uid, timestamp_str, tpms_id, sensor_model, car_model, location, lat, lon])

print("CSV file 'generated_data.csv' generated with 200 rows.")
