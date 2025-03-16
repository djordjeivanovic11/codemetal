// routes.ts
import axios from "axios";

// Base URL for your API (adjust as needed)
const BASE_URL: string = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// ---------------------
// Graph Endpoint Types
// ---------------------

// Graph node as returned by NetworkX's node_link_data
export interface GraphNode {
  id: string | number;
  [key: string]: unknown;
}

// Graph edge as returned by NetworkX's node_link_data
export interface GraphEdge {
  source: string | number;
  target: string | number;
  [key: string]: unknown;
}

// Graph data in node-link format
export interface GraphData {
  directed: boolean;
  multigraph: boolean;
  graph: Record<string, unknown>;
  nodes: GraphNode[];
  links: GraphEdge[];
}

// Vehicle group type (group of sensors and total edge weight)
export interface VehicleGroup {
  group: string[];
  totalEdgeWeight: number;
}

// Graph response interface
export interface GraphResponse {
  graph: GraphData;
  vehicle_groups: VehicleGroup[];
  confidence_scores: Record<number, number>;
}

// -----------------------
// Network Endpoint Types
// -----------------------

export interface Coordinate {
  latitude: number;
  longitude: number;
}

export interface NetworkResponse {
  tire_detected_by_id?: number[] | null;
  tire_detected_by_model?: number[] | null;
  node_path?: number[] | null;
  path_node_coordinates?: Coordinate[] | null;
}

// ---------------------
// API Functions
// ---------------------

/**
 * Uploads a CSV file to create a graph.
 * Expects the CSV to include columns: timestamp, tpms_id, tpms_model, car_model, location, latitude, longitude.
 */
export async function createGraph(file: File): Promise<GraphResponse> {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post<GraphResponse>(
      `${BASE_URL}/api/visualize/graph`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response.data;
  } catch (error: unknown) {
    console.error("Error creating graph:", error);
    throw error;
  }
}

/**
 * Uploads a CSV file to create a network.
 * Optional query parameters:
 *   - search_by_ids: an array of tire IDs to search.
 *   - search_by_model: (optional) string to search by model.
 *   - build_node_path: a tire id to build an event path and return its coordinates.
 *
 * This function now uses a POST request to support file uploads.
 */
export async function createNetwork(
  file: File,
  search_by_ids?: string[],
  search_by_model?: string,
  build_node_path?: string
): Promise<NetworkResponse> {
  try {
    const formData = new FormData();
    formData.append("file", file);

    // Build query parameters.
    const params: Record<string, unknown> = {};
    if (search_by_ids) params.search_by_ids = search_by_ids;
    if (search_by_model) params.search_by_model = search_by_model;
    if (build_node_path) params.build_node_path = build_node_path;

    const response = await axios.post<NetworkResponse>(
      `${BASE_URL}/api/visualize/network`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
        params, // Send optional parameters as query parameters.
      }
    );
    return response.data;
  } catch (error: unknown) {
    console.error("Error creating network:", error);
    throw error;
  }
}
