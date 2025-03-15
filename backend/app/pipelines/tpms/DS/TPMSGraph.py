import pandas as pd
import numpy as np
import networkx as nx
from itertools import combinations

class TPMSGraph:
    def __init__(self, df):
        """
        Initialize with a DataFrame containing TPMS readings.
        
        Expected columns:
          - timestamp
          - tpms_id
          - tpms_model
          - car_model
          - location
          - latitude
          - longitude
        """
        self.df = df.copy()
        self.df['timestamp'] = pd.to_datetime(self.df['timestamp'])
        self.graph = None
        self.vehicle_groups = None

    def build_graph(self, time_threshold=5, window_minutes=30):
        """
        Build a co-occurrence graph from the TPMS readings.
        
        Parameters:
          - time_threshold: Maximum seconds difference to consider two sensors as co-occurring.
          - window_minutes: Size of the time window (in minutes) used to process the data.
          
        Each node in the graph represents a unique TPMS sensor (by tpms_id). 
        An edge is created (or its weight incremented) whenever two sensors report in the same 
        location within time_threshold seconds.
        """
        self.graph = nx.Graph()
        # Add nodes for all unique TPMS IDs.
        all_tpms_ids = self.df['tpms_id'].unique()
        self.graph.add_nodes_from(all_tpms_ids)
        
        edge_weights = {}
        start_time = self.df['timestamp'].min()
        end_time = self.df['timestamp'].max()
        window_size = pd.Timedelta(minutes=window_minutes)
        current_time = start_time

        while current_time < end_time:
            window_end = current_time + window_size
            window_data = self.df[(self.df['timestamp'] >= current_time) & (self.df['timestamp'] < window_end)]
            
            # Process each location separately.
            for location, location_data in window_data.groupby('location'):
                location_data = location_data.sort_values('timestamp')
                timestamps = location_data['timestamp'].values
                tpms_ids = location_data['tpms_id'].values
                
                # Compare each reading with subsequent ones in the same location.
                for i in range(len(timestamps)):
                    current_time_i = timestamps[i]
                    current_id_i = tpms_ids[i]
                    for j in range(i + 1, len(timestamps)):
                        time_diff = (timestamps[j] - current_time_i) / np.timedelta64(1, 's')
                        if time_diff > time_threshold:
                            break  # Further readings are too far apart.
                        current_id_j = tpms_ids[j]
                        edge = tuple(sorted([current_id_i, current_id_j]))
                        edge_weights[edge] = edge_weights.get(edge, 0) + 1
            current_time = window_end

        # Add all computed edges to the graph.
        for (node1, node2), weight in edge_weights.items():
            self.graph.add_edge(node1, node2, weight=weight)
        print(f"Built graph with {self.graph.number_of_nodes()} nodes and {self.graph.number_of_edges()} edges")
        return self.graph

    def find_vehicle_groups(self, weight_threshold=2, expected_group_size=4, max_groups=None):
        """
        Identify groups of sensors (vehicle wheels) that likely belong to the same vehicle.
        
        Parameters:
          - weight_threshold: Minimum edge weight for an edge to be considered.
          - expected_group_size: Expected number of sensors per vehicle (typically 4).
          - max_groups: Maximum number of groups to identify (None means unlimited).
        
        This method first prunes low-weight edges, then attempts to identify fully connected
        subgraphs (cliques) and finally falls back on a greedy approach to fill in groups.
        
        Returns:
          - A list of tuples: (group, total_edge_weight)
        """
        if self.graph is None:
            print("Graph has not been built yet. Call build_graph() first.")
            return None
        
        pruned_G = self.graph.copy()
        edges_to_remove = [(u, v) for u, v, d in self.graph.edges(data=True) if d['weight'] < weight_threshold]
        pruned_G.remove_edges_from(edges_to_remove)
        isolated_nodes = list(nx.isolates(pruned_G))
        pruned_G.remove_nodes_from(isolated_nodes)
        
        if pruned_G.number_of_nodes() < expected_group_size:
            print("Warning: Graph too small after pruning. Try lowering weight_threshold.")
            return []
        
        vehicle_groups = []
        remaining_nodes = set(pruned_G.nodes())

        def calculate_subgraph_weight(nodes):
            subgraph = pruned_G.subgraph(nodes)
            return sum(d['weight'] for _, _, d in subgraph.edges(data=True))
        
        # Approach 1: Look for cliques (fully connected subgraphs)
        try:
            from networkx.algorithms.clique import find_cliques
            cliques = list(find_cliques(pruned_G))
            valid_cliques = []
            for clique in cliques:
                if len(clique) >= expected_group_size:
                    # If clique is larger than expected, consider combinations of expected_group_size nodes.
                    if len(clique) > expected_group_size:
                        for sub_clique in combinations(clique, expected_group_size):
                            valid_cliques.append((list(sub_clique), calculate_subgraph_weight(sub_clique)))
                    else:
                        valid_cliques.append((clique, calculate_subgraph_weight(clique)))
            valid_cliques.sort(key=lambda x: x[1], reverse=True)
            for clique, weight in valid_cliques:
                if max_groups is not None and len(vehicle_groups) >= max_groups:
                    break
                if any(node in remaining_nodes for node in clique):
                    vehicle_groups.append(clique)
                    remaining_nodes -= set(clique)
            print(f"Found {len(vehicle_groups)} vehicle groups from cliques")
        except Exception as e:
            print(f"Error in clique finding: {e}")
        
        # Approach 2: Greedy approach for additional groups.
        if (max_groups is None or len(vehicle_groups) < max_groups) and len(remaining_nodes) >= expected_group_size:
            print("Finding additional groups using greedy approach...")
            while len(remaining_nodes) >= expected_group_size:
                if max_groups is not None and len(vehicle_groups) >= max_groups:
                    break
                candidate_nodes = list(remaining_nodes)
                best_group = None
                best_weight = 0
                if len(candidate_nodes) > 20:
                    # Start with top weighted edges as seeds.
                    edges = sorted(
                        [(u, v, d['weight']) for u, v, d in pruned_G.edges(data=True)
                         if u in remaining_nodes and v in remaining_nodes],
                        key=lambda x: x[2], reverse=True)
                    for (u, v, _) in edges[:100]:
                        current_nodes = set([u, v])
                        common_neighbors = set()
                        for node in current_nodes:
                            common_neighbors.update(n for n in pruned_G.neighbors(node) 
                                                    if n in remaining_nodes and n not in current_nodes)
                        neighbor_weights = {}
                        for n in common_neighbors:
                            weight = sum(pruned_G[n][other].get('weight', 0) 
                                         for other in current_nodes if other in pruned_G[n])
                            neighbor_weights[n] = weight
                        sorted_neighbors = sorted(neighbor_weights.keys(), key=lambda x: neighbor_weights[x], reverse=True)
                        while len(current_nodes) < expected_group_size and sorted_neighbors:
                            current_nodes.add(sorted_neighbors.pop(0))
                        if len(current_nodes) < expected_group_size:
                            continue
                        group_weight = calculate_subgraph_weight(current_nodes)
                        if group_weight > best_weight:
                            best_weight = group_weight
                            best_group = list(current_nodes)
                else:
                    for group in combinations(candidate_nodes, expected_group_size):
                        group_weight = calculate_subgraph_weight(group)
                        if group_weight > best_weight:
                            best_weight = group_weight
                            best_group = list(group)
                if best_group and best_weight > 0:
                    vehicle_groups.append(best_group)
                    remaining_nodes -= set(best_group)
                    print(f"Added group with weight {best_weight}")
                else:
                    break
        
        # Sort groups by their total edge weight.
        vehicle_groups_with_weights = [(group, calculate_subgraph_weight(group)) for group in vehicle_groups]
        vehicle_groups_with_weights.sort(key=lambda x: x[1], reverse=True)
        print(f"Final result: {len(vehicle_groups_with_weights)} vehicle groups")
        for i, (group, weight) in enumerate(vehicle_groups_with_weights):
            print(f"  Group {i+1}: {len(group)} sensors, total weight: {weight:.2f}, Sensors: {group}")
        
        self.vehicle_groups = vehicle_groups_with_weights
        return self.vehicle_groups

    def calculate_confidence_scores(self):
        """
        Calculate confidence scores for each vehicle group.
        
        Confidence score = (sum of internal edge weights) / (sum of internal + external edge weights).
        
        Returns:
          - A dictionary mapping the group index to its confidence score.
        """
        if self.graph is None or self.vehicle_groups is None:
            print("Graph or vehicle groups not available. Make sure to run build_graph() and find_vehicle_groups() first.")
            return None
        
        confidence_scores = {}
        groups = [group for group, _ in self.vehicle_groups]
        for i, group in enumerate(groups):
            subgraph = self.graph.subgraph(group)
            internal_weight = sum(d['weight'] for _, _, d in subgraph.edges(data=True))
            external_weight = 0
            for node in group:
                for neighbor in self.graph.neighbors(node):
                    if neighbor not in group:
                        external_weight += self.graph[node][neighbor]['weight']
            total_weight = internal_weight + external_weight
            confidence_scores[i] = internal_weight / total_weight if total_weight > 0 else 0
        return confidence_scores