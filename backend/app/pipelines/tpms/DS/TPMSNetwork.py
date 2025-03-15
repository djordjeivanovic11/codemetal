"""
tpms_network.py

This module defines a TPMSNetwork class to maintain a directed graph of car detection events.
Each event node includes details such as timestamp, location (with coordinates), tire IDs,
and optional fields like license plate and car description. Directed edges indicate the temporal
order in which the car was observed. The module supports searching by a single tire ID,
multiple tire IDs, or license plate so that you can reconstruct the path taken by the car.

This structure is intended to be used later to display directional markers (e.g. on Google Maps).
"""

import networkx as nx
from datetime import datetime
from typing import List, Tuple, Dict, Optional, Any


class TPMSNetwork:
    def __init__(self):
        """
        Initialize the TPMS network as a directed graph and a node counter.
        The graph will contain up to several hundred nodes representing events across the city.
        """
        self.graph: nx.DiGraph = nx.DiGraph()
        self.next_node_id: int = 0

    def add_event(self, 
                  timestamp: datetime, 
                  location: str, 
                  latitude: float, 
                  longitude: float, 
                  tire_ids: List[str], 
                  license_plate: str = "", 
                  car_description: str = "") -> int:
        """
        Add an event (a detection of a car) to the TPMS network.
        
        Each event is stored as a node with the given attributes.
        If a previous event for the same car exists (matched by license_plate or overlapping tire IDs),
        a directed edge is created from that event to the new one.
        
        Parameters:
            timestamp (datetime): The timestamp of the event.
            location (str): A name or description of the location.
            latitude (float): Latitude coordinate.
            longitude (float): Longitude coordinate.
            tire_ids (List[str]): List of tire (sensor) IDs associated with this event.
            license_plate (str, optional): The car's license plate.
            car_description (str, optional): A description of the car.
        
        Returns:
            int: A unique node ID representing this event.
        """
        node_id = self.next_node_id
        self.next_node_id += 1

        self.graph.add_node(node_id,
                            timestamp=timestamp,
                            location=location,
                            latitude=latitude,
                            longitude=longitude,
                            tire_ids=tire_ids,
                            license_plate=license_plate,
                            car_description=car_description)
        
        # Link this event to the latest event for the same car (if available).
        prev_node = self._find_latest_event_for_car(tire_ids, license_plate, timestamp)
        if prev_node is not None:
            self.graph.add_edge(prev_node, node_id)
        return node_id

    def _find_latest_event_for_car(self, 
                                   tire_ids: List[str], 
                                   license_plate: str, 
                                   current_timestamp: datetime) -> Optional[int]:
        """
        Find the most recent event node (by timestamp) for the same car.
        
        Matching is performed primarily by license_plate (if available) or by checking if any tire ID overlaps.
        
        Parameters:
            tire_ids (List[str]): Tire IDs of the current event.
            license_plate (str): License plate of the current event.
            current_timestamp (datetime): Timestamp of the current event.
        
        Returns:
            Optional[int]: The node ID of the most recent matching event, or None if not found.
        """
        candidate: Optional[int] = None
        candidate_time: Optional[datetime] = None

        for n, data in self.graph.nodes(data=True):
            event_time = data.get('timestamp')
            if event_time is None or event_time >= current_timestamp:
                continue

            # Primary matching by license plate (if both events have one)
            if license_plate and data.get('license_plate'):
                if license_plate == data.get('license_plate'):
                    if candidate is None or event_time > candidate_time:
                        candidate = n
                        candidate_time = event_time
            else:
                # Fallback: match if any tire ID overlaps.
                existing_tire_ids = data.get('tire_ids', [])
                if any(tid in existing_tire_ids for tid in tire_ids):
                    if candidate is None or event_time > candidate_time:
                        candidate = n
                        candidate_time = event_time
        return candidate

    def search_by_tire(self, tire_id: str) -> List[int]:
        """
        Search for all event nodes that include the given tire ID.
        
        Parameters:
            tire_id (str): The tire ID to search for.
        
        Returns:
            List[int]: A list of node IDs (chronologically sorted by timestamp) where this tire was detected.
        """
        results = [n for n, data in self.graph.nodes(data=True)
                   if tire_id in data.get('tire_ids', [])]
        results.sort(key=lambda n: self.graph.nodes[n]['timestamp'])
        return results

    def search_by_license_plate(self, license_plate: str) -> List[int]:
        """
        Search for all event nodes with the specified license plate.
        
        Parameters:
            license_plate (str): The license plate to search for.
        
        Returns:
            List[int]: A list of node IDs (chronologically sorted by timestamp) where this license plate was detected.
        """
        results = [n for n, data in self.graph.nodes(data=True)
                   if data.get('license_plate') == license_plate]
        results.sort(key=lambda n: self.graph.nodes[n]['timestamp'])
        return results

    def search_by_tire_ids(self, tire_ids: List[str]) -> List[int]:
        """
        Search for event nodes that match any of the given tire IDs.
        Useful when you want to search using all four tires.
        
        Parameters:
            tire_ids (List[str]): List of tire IDs.
        
        Returns:
            List[int]: A list of matching node IDs sorted chronologically.
        """
        results = [n for n, data in self.graph.nodes(data=True)
                   if any(tid in data.get('tire_ids', []) for tid in tire_ids)]
        results.sort(key=lambda n: self.graph.nodes[n]['timestamp'])
        return results

    def get_path_for_node(self, node_id: int) -> List[int]:
        """
        Reconstruct the full path (sequence of event nodes) for a car by traversing backwards
        from the given node. This assumes that the event chain is linear.
        
        Parameters:
            node_id (int): The node ID to start the backward traversal from.
        
        Returns:
            List[int]: A list of node IDs representing the car's path (chronologically ordered).
        """
        path = []
        current = node_id
        while True:
            path.append(current)
            predecessors = list(self.graph.predecessors(current))
            if not predecessors:
                break
            # Assuming a single predecessor for events from the same car.
            current = predecessors[0]
        return list(reversed(path))

    def get_path_by_tire(self, tire_id: str) -> List[int]:
        """
        Retrieve the event path for a car identified by a tire ID.
        
        Parameters:
            tire_id (str): The tire ID to search for.
        
        Returns:
            List[int]: A list of node IDs representing the car's path.
        """
        nodes = self.search_by_tire(tire_id)
        if not nodes:
            return []
        return self.get_path_for_node(nodes[0])

    def get_path_by_license_plate(self, license_plate: str) -> List[int]:
        """
        Retrieve the event path for a car identified by its license plate.
        
        Parameters:
            license_plate (str): The license plate to search for.
        
        Returns:
            List[int]: A list of node IDs representing the car's path.
        """
        nodes = self.search_by_license_plate(license_plate)
        if not nodes:
            return []
        return self.get_path_for_node(nodes[0])

    def get_path_coordinates(self, path: List[int]) -> List[Tuple[float, float]]:
        """
        Convert a list of event node IDs to a list of (latitude, longitude) pairs.
        This list can be used to display markers and a directional path on Google Maps.
        
        Parameters:
            path (List[int]): A list of node IDs.
        
        Returns:
            List[Tuple[float, float]]: A list of (latitude, longitude) tuples in order.
        """
        return [(self.graph.nodes[n]['latitude'], self.graph.nodes[n]['longitude'])
                for n in path]

    def get_path_details(self, path: List[int]) -> List[Dict[str, Any]]:
        """
        Retrieve detailed information for each event node in the given path.
        
        Parameters:
            path (List[int]): A list of node IDs.
        
        Returns:
            List[Dict[str, Any]]: A list of dictionaries with details for each event.
        """
        details = []
        for n in path:
            data = self.graph.nodes[n]
            details.append({
                'node_id': n,
                'timestamp': data.get('timestamp'),
                'location': data.get('location'),
                'latitude': data.get('latitude'),
                'longitude': data.get('longitude'),
                'tire_ids': data.get('tire_ids'),
                'license_plate': data.get('license_plate'),
                'car_description': data.get('car_description')
            })
        return details

    def search_event(self, query: Dict[str, Any]) -> List[int]:
        """
        Generic search method for events based on a query dictionary.
        The query can include keys like 'tire_ids', 'license_plate', or even 'location'.
        For 'tire_ids', the search will match if any provided tire id is found.
        
        Parameters:
            query (Dict[str, Any]): A dictionary of search criteria.
        
        Returns:
            List[int]: A list of matching node IDs (chronologically sorted).
        """
        results = []
        for n, data in self.graph.nodes(data=True):
            match = True
            for key, value in query.items():
                if key == 'tire_ids':
                    # value is expected to be a list of tire ids
                    if not any(tid in data.get('tire_ids', []) for tid in value):
                        match = False
                        break
                else:
                    if data.get(key) != value:
                        match = False
                        break
            if match:
                results.append(n)
        results.sort(key=lambda n: self.graph.nodes[n]['timestamp'])
        return results