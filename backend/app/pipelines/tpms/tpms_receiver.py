import time
import random
from datetime import datetime
from config import SIMULATION, SERIAL_PORTS, SERIAL_BAUD_RATE
import serial

class TPMSData:
    def __init__(self, sensor_id, timestamp, tire_id, model, pressure):
        self.sensor_id = sensor_id
        self.timestamp = timestamp 
        self.tire_id = tire_id
        self.model = model
        self.pressure = pressure

    def to_dict(self):
        return {
            "sensor_id": self.sensor_id,
            "timestamp": self.timestamp,
            "tire_id": self.tire_id,
            "model": self.model,
            "pressure": self.pressure
        }

    def __repr__(self):
        return str(self.to_dict())

class TPMSReceiver:
    def __init__(self, port=None):
        if port is None:
            port = SERIAL_PORTS[0]
        self.port = port
        if not SIMULATION:
            self.serial_conn = serial.Serial(self.port, SERIAL_BAUD_RATE, timeout=1)

    def read_data(self):
        """
        In simulation mode, generate random TPMS data.
        Replace this with real serial reading code as needed.
        """
        if SIMULATION:
            sensor_id = random.randint(1000, 9999)
            timestamp = datetime.utcnow().timestamp()
            tire_id = random.choice([1, 2, 3, 4])
            model = random.choice(["ModelA", "ModelB"])
            pressure = round(random.uniform(28, 36), 2)
            return TPMSData(sensor_id, timestamp, tire_id, model, pressure)
        else:
           
            line = self.serial_conn.readline().decode('utf-8').strip()
            data_parts = line.split(',')
            if len(data_parts) == 5:
                return TPMSData(data_parts[0], float(data_parts[1]), data_parts[2], data_parts[3], float(data_parts[4]))
            pass

    def run(self, callback, poll_interval=1.0):
        """
        Continuously read TPMS data and call the provided callback with each data record.
        """
        while True:
            data = self.read_data()
            if data:
                callback(data)
            time.sleep(poll_interval)
