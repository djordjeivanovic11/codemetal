import uuid
from datetime import datetime

class Detection:
    def __init__(self, 
                 timestamp: datetime, 
                 tpms_id: str, 
                 tpms_model: str, 
                 car_model: str, 
                 location: str, 
                 latitude: float, 
                 longitude: float, 
                 signal_strength: float,
                 id: uuid.UUID = None):
        """
        Initialize a Detection instance.
        
        Parameters:
            timestamp (datetime): The timestamp of the event.
            tpms_id (str): The TPMS sensor ID.
            tpms_model (str): The TPMS model.
            car_model (str): The car model.
            location (str): The location name.
            latitude (float): The latitude coordinate.
            longitude (float): The longitude coordinate.
            battery (float): battery of node at time of detection
            signal_strength (float): strength of signal of this detect
            id (uuid.UUID, optional): Unique identifier; generated if not provided.
        """
        self.id = id if id is not None else uuid.uuid4()
        self.timestamp = timestamp
        self.tpms_id = tpms_id
        self.tpms_model = tpms_model
        self.car_model = car_model
        self.location = location
        self.latitude = latitude
        self.longitude = longitude
        self.signal_strength = signal_strength

    # Dictionary-like access methods:
    def __getitem__(self, key):
        if key in self.keys():
            return getattr(self, key)
        raise KeyError(f"{key} is not a valid attribute.")

    def __setitem__(self, key, value):
        if key in self.keys():
            setattr(self, key, value)
        else:
            raise KeyError(f"{key} is not a valid attribute.")

    def __delitem__(self, key):
        if key in self.keys():
            setattr(self, key, None)
        else:
            raise KeyError(f"{key} is not a valid attribute.")

    def keys(self):
        return ['id', 'timestamp', 'tpms_id', 'tpms_model', 'car_model', 'location', 'latitude', 'longitude', 'signal_strength']

    def values(self):
        return [getattr(self, key) for key in self.keys()]

    def items(self):
        return ((key, getattr(self, key)) for key in self.keys())

    def __iter__(self):
        return iter(self.keys())

    def __contains__(self, key):
        return key in self.keys()

    def to_dict(self):
        return {key: getattr(self, key) for key in self.keys()}

