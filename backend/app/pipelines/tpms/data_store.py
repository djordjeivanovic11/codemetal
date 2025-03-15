import threading
from datetime import datetime
from config import DATA_EXPIRY_SECONDS

class DataStore:
    def __init__(self):
        self.lock = threading.Lock()
        self.tpms_data = [] 

    def add_record(self, record):
        with self.lock:
            self.tpms_data.append(record)
            self._remove_expired_records()

    def _remove_expired_records(self):
        now = datetime.now().timestamp()
        self.tpms_data = [r for r in self.tpms_data if now - r.timestamp <= DATA_EXPIRY_SECONDS]

    def search_by_pressure(self, threshold):
        """
        Return all records with tire pressure below the given threshold.
        """
        with self.lock:
            return [r for r in self.tpms_data if r.pressure < threshold]

    def get_all_records(self):
        with self.lock:
            return list(self.tpms_data)
