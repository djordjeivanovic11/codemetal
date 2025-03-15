"""
tpms_network.py

This module defines a TPMSNetwork class to maintain a directed graph of vehicle detection events.
Each event node includes details such as timestamp, location (with coordinates), and tire IDs.
Directed edges indicate the temporal order in which the vehicle was observed. The module 
supports searching by single or multiple tire IDs so that you can reconstruct the path taken
by the vehicle.

This structure is intended to be used to display directional markers (e.g. on Google Maps).
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
        # Add indexes for faster lookups
        self.tire_index: Dict[str, List[int]] = {}  # Maps tire_id to node_ids

    def add_event(self, 
                  timestamp: datetime, 
                  location: str, 
                  latitude: float, 
                  longitude: float, 
                  battery: float, 
                  signal_strength: float,
                  tire_ids: List[str], 
                  car_description: str = "") -> int:
        """
        Add an event (a detection of a vehicle) to the TPMS network.
        
        Each event is stored as a node with the given attributes.
        If a previous event for the same vehicle exists (matched by overlapping tire IDs),
        a directed edge is created from that event to the new one.
        
        Parameters:
            timestamp (datetime): The timestamp of the event.
            location (str): A name or description of the location.
            latitude (float): Latitude coordinate.
            longitude (float): Longitude coordinate.
            battery (float): Battery level of the sensor node.
            signal_strength (float): Signal strength of the detection.
            tire_ids (List[str]): List of tire (sensor) IDs associated with this event.
            car_description (str, optional): A description of the car.
        
        Returns:
            int: A unique node ID representing this event.
        """
        # Validate inputs
        if not isinstance(timestamp, datetime):
            raise TypeError("timestamp must be a datetime object")
        if not isinstance(tire_ids, list) or not tire_ids:
            raise ValueError("tire_ids must be a non-empty list")
        if not isinstance(latitude, (int, float)) or not isinstance(longitude, (int, float)):
            raise TypeError("latitude and longitude must be numeric")
            
        node_id = self.next_node_id
        self.next_node_id += 1

        self.graph.add_node(node_id,
                            timestamp=timestamp,
                            location=location,
                            latitude=latitude,
                            longitude=longitude,
                            battery=battery,
                            signal_strength=signal_strength,
                            tire_ids=tire_ids,
                            car_description=car_description)
        
        # Link this event to the latest event for the same car (if available).
        prev_node = self._find_latest_event_for_car(tire_ids, timestamp)
        if prev_node is not None:
            self.graph.add_edge(prev_node, node_id)
            
        # Update tire index
        for tid in tire_ids:
            if tid not in self.tire_index:
                self.tire_index[tid] = []
            self.tire_index[tid].append(node_id)
            
        return node_id

    def _find_latest_event_for_car(self, 
                                   tire_ids: List[str], 
                                   current_timestamp: datetime,
                                   time_threshold_seconds: int = 3600) -> Optional[int]:
        """
        Find the most recent event node (by timestamp) for the same car.
        
        Matching is performed by checking if any tire ID overlaps with previous events.
        
        Parameters:
            tire_ids (List[str]): Tire IDs of the current event.
            current_timestamp (datetime): Timestamp of the current event.
            time_threshold_seconds (int): Maximum time difference to consider (default: 1 hour)
        
        Returns:
            Optional[int]: The node ID of the most recent matching event, or None if not found.
        """
        candidate: Optional[int] = None
        candidate_time: Optional[datetime] = None

        # Get potential matching nodes using the index
        potential_nodes = set()
        for tid in tire_ids:
            if tid in self.tire_index:
                potential_nodes.update(self.tire_index[tid])
        
        # Find the most recent matching node
        for n in potential_nodes:
            data = self.graph.nodes[n]
            event_time = data.get('timestamp')
            if event_time is None or event_time >= current_timestamp:
                continue

            existing_tire_ids = data.get('tire_ids', [])
            if any(tid in existing_tire_ids for tid in tire_ids):
                if candidate is None or event_time > candidate_time:
                    candidate = n
                    candidate_time = event_time
        
        # Check time threshold
        if candidate_time is not None:
            time_diff = current_timestamp - candidate_time
            if time_diff.total_seconds() > time_threshold_seconds:
                return None
                
        return candidate

    def search_by_tire(self, tire_id: str) -> List[int]:
        """
        Search for all event nodes that include the given tire ID.
        Uses index for faster lookup.
        
        Parameters:
            tire_id (str): The tire ID to search for.
        
        Returns:
            List[int]: A list of node IDs (chronologically sorted by timestamp) where this tire was detected.
        """
        if tire_id not in self.tire_index:
            return []
        
        results = self.tire_index[tire_id].copy()
        results.sort(key=lambda n: self.graph.nodes[n]['timestamp'])
        return results

    def search_by_tire_ids(self, tire_ids: List[str]) -> List[int]:
        """
        Search for event nodes that match any of the given tire IDs.
        Useful when you want to search using multiple or all four tires.
        
        Parameters:
            tire_ids (List[str]): List of tire IDs.
        
        Returns:
            List[int]: A list of matching node IDs sorted chronologically.
        """
        results = set()
        for tid in tire_ids:
            if tid in self.tire_index:
                results.update(self.tire_index[tid])
        
        results_list = list(results)
        results_list.sort(key=lambda n: self.graph.nodes[n]['timestamp'])
        return results_list

    def get_path_for_node(self, node_id: int) -> List[int]:
        """
        Reconstruct the full path (sequence of event nodes) for a vehicle by traversing backwards
        from the given node. This assumes that the event chain is linear.
        
        Parameters:
            node_id (int): The node ID to start the backward traversal from.
        
        Returns:
            List[int]: A list of node IDs representing the vehicle's path (chronologically ordered).
        """
        if node_id not in self.graph:
            return []
            
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
        Retrieve the event path for a vehicle identified by a tire ID.
        
        Parameters:
            tire_id (str): The tire ID to search for.
        
        Returns:
            List[int]: A list of node IDs representing the vehicle's path.
        """
        nodes = self.search_by_tire(tire_id)
        if not nodes:
            return []
        return self.get_path_for_node(nodes[-1])  # Use most recent detection

    def get_path_coordinates(self, path: List[int]) -> List[Tuple[float, float]]:
        """
        Convert a list of event node IDs to a list of (latitude, longitude) pairs.
        This list can be used to display markers and a directional path on a map.
        
        Parameters:
            path (List[int]): A list of node IDs.
        
        Returns:
            List[Tuple[float, float]]: A list of (latitude, longitude) tuples in order.
        """
        return [(self.graph.nodes[n]['latitude'], self.graph.nodes[n]['longitude'])
                for n in path if n in self.graph]

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
            if n not in self.graph:
                continue
                
            data = self.graph.nodes[n]
            details.append({
                'node_id': n,
                'timestamp': data.get('timestamp'),
                'location': data.get('location'),
                'latitude': data.get('latitude'),
                'longitude': data.get('longitude'),
                'battery': data.get('battery'),
                'signal_strength': data.get('signal_strength'),
                'tire_ids': data.get('tire_ids'),
                'car_description': data.get('car_description')
            })
        return details

    def search_event(self, query: Dict[str, Any]) -> List[int]:
        """
        Generic search method for events based on a query dictionary.
        The query can include keys like 'tire_ids' or 'location'.
        For 'tire_ids', the search will match if any provided tire id is found.
        
        Parameters:
            query (Dict[str, Any]): A dictionary of search criteria.
        
        Returns:
            List[int]: A list of matching node IDs (chronologically sorted).
        """
        results = []
        
        # Use tire index if only searching by tire_ids
        if set(query.keys()) == {'tire_ids'}:
            return self.search_by_tire_ids(query['tire_ids'])
            
        # Otherwise, perform full search
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
        
    def to_dict(self) -> Dict[str, Any]:
        """
        Convert the network to a dictionary for serialization.
        
        Returns:
            Dict[str, Any]: Dictionary representation of the network.
        """
        return {
            'next_node_id': self.next_node_id,
            'nodes': [{
                'id': n,
                **{k: v for k, v in data.items()}
            } for n, data in self.graph.nodes(data=True)],
            'edges': [(u, v) for u, v in self.graph.edges()]
        }
       
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'TPMSNetwork':
        """
        Create a network from a dictionary representation.
        
        Parameters:
            data (Dict[str, Any]): Dictionary representation of the network.
            
        Returns:
            TPMSNetwork: Reconstructed network.
        """
        network = cls()
        network.next_node_id = data['next_node_id']
       
        for node_data in data['nodes']:
            node_id = node_data.pop('id')
            network.graph.add_node(node_id, **node_data)
           
            # Update tire index
            for tid in node_data.get('tire_ids', []):
                if tid not in network.tire_index:
                    network.tire_index[tid] = []
                network.tire_index[tid].append(node_id)
               
        for u, v in data['edges']:
            network.graph.add_edge(u, v)
           
        return network