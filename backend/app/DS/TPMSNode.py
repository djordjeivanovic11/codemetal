from DS import Readings
from DS.Detection import Detection
from typing import List, Dict, Any

class TPMSNode:
    def __init__(self, name: str, latitude: float, longitude: float, location: str, battery: float, signal_strength: float):
        """
        Initialize a TPMS reader node.
        
        Parameters:
            name (str): A unique name or identifier for the reader.
            latitude (float): Latitude coordinate.
            longitude (float): Longitude coordinate.
            location (str): A human-friendly location name.
        """
        self.name = name
        self.latitude = latitude
        self.longitude = longitude
        self.location = location
        self.battery = battery
        self.signal_strength = signal_strength
        self.readings = Readings()  # Each reader holds its own collection of readings.
    
    def add_reading(self, detection: Detection):
        """
        Add a detection reading to this TPMS reader.
        """
        self.readings.add(detection)
    
    def search_readings(self, **kwargs) -> List[Detection]:
        """
        Search the readings within this TPMS reader using provided key=value parameters.
        """
        return self.readings.search(**kwargs)
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            'name': self.name,
            'latitude': self.latitude,
            'longitude': self.longitude,
            'location': self.location,
            'readings': self.readings.to_list()
        }
    
    def __repr__(self):
        return f"TPMSReader(name={self.name}, location={self.location})"


