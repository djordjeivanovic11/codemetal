from DS.Detection import Detection
from collections import defaultdict
import uuid
from datetime import datetime
from typing import List, Dict, Any, Optional

class Readings:
    def __init__(self, detections: Optional[List[Detection]] = None):
        """
        Initialize the Readings container with an optional list of Detection objects.
        Internal indexes are built for fast lookup.
        """
        self._detections: List[Detection] = detections if detections is not None else []
        # Build indexes for faster searches.
        self.index_by_id: Dict[uuid.UUID, Detection] = {}
        self.index_by_tpms_model: Dict[str, List[Detection]] = defaultdict(list)
        self.index_by_car_model: Dict[str, List[Detection]] = defaultdict(list)
        self.index_by_tpms_id: Dict[str, List[Detection]] = defaultdict(list)
        
        for detection in self._detections:
            self._add_to_indexes(detection)

    def _add_to_indexes(self, detection: Detection):
        self.index_by_id[detection.id] = detection
        self.index_by_tpms_model[detection.tpms_model].append(detection)
        self.index_by_car_model[detection.car_model].append(detection)
        self.index_by_tpms_id[detection.tpms_id].append(detection)

    def add(self, detection: Detection):
        """
        Add a new Detection to the collection and update indexes.
        """
        self._detections.append(detection)
        self._add_to_indexes(detection)

    def search(self, **kwargs) -> List[Detection]:
        """
        Optimized search for detections using key=value parameters.
        
        Supported keys include:
            - id (UUID)
            - tpms_id (str)
            - tpms_model (str)
            - car_model (str)
            - location (str)
            - timestamp (datetime)  (Exact match)
        
        For the indexed keys (id, tpms_model, car_model, tpms_id), set intersections are used.
        Any non-indexed keys are applied as additional filters.
        """
        # Gather sets for keys that are indexed.
        sets = []
        if 'id' in kwargs:
            detection = self.index_by_id.get(kwargs['id'])
            sets.append({detection} if detection is not None else set())
            del kwargs['id']
        if 'tpms_model' in kwargs:
            detections = self.index_by_tpms_model.get(kwargs['tpms_model'], [])
            sets.append(set(detections))
            del kwargs['tpms_model']
        if 'car_model' in kwargs:
            detections = self.index_by_car_model.get(kwargs['car_model'], [])
            sets.append(set(detections))
            del kwargs['car_model']
        if 'tpms_id' in kwargs:
            detections = self.index_by_tpms_id.get(kwargs['tpms_id'], [])
            sets.append(set(detections))
            del kwargs['tpms_id']
        
        # Start with all detections if no indexed key is provided.
        if sets:
            result_set = set.intersection(*sets)
        else:
            result_set = set(self._detections)
        
        # Filter remaining non-indexed keys (e.g. location, timestamp).
        filtered = [
            d for d in result_set 
            if all(getattr(d, key, None) == value for key, value in kwargs.items())
        ]
        
        # Return results sorted by timestamp.
        return sorted(filtered, key=lambda d: d.timestamp)

    def __iter__(self):
        return iter(self._detections)

    def __len__(self):
        return len(self._detections)

    def __getitem__(self, index):
        return self._detections[index]

    def to_list(self) -> List[Dict[str, Any]]:
        """
        Returns the list of detections as dictionaries.
        """
        return [d.to_dict() for d in self._detections]