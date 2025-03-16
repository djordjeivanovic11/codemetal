import axios from "axios";

// Base URL for your API – adjust as needed or set in your environment variables.
const BASE_URL: string = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Define the Detection interface matching the backend structure.
export interface Detection {
  id: string;
  timestamp: string;
  tpms_id: string;
  tpms_model: string;
  car_model: string;
  location: string;
  latitude: number;
  longitude: number;
}

// Define the response shape.
export interface DetectionsResponse {
  detections: Detection[];
}

/**
 * Search detections by a list of TPMS IDs.
 * Accepts between 1 and 4 IDs.
 * Example usage:
 *    searchByIds(["123", "456"])
 */
export async function searchByIds(ids: string[]): Promise<DetectionsResponse> {
  try {
    const response = await axios.get<DetectionsResponse>(`${BASE_URL}/api/search/ids`, {
      params: { "ids[]": ids },
    });
    return response.data;
  } catch (error: unknown) {
    console.error("Error searching by IDs:", error);
    throw error;
  }
}

/**
 * Search detections by sensor model.
 * Performs a case-insensitive search.
 * Example usage:
 *    searchByModel("ABC123")
 */
export async function searchByModel(modelName: string): Promise<DetectionsResponse> {
  try {
    const response = await axios.get<DetectionsResponse>(
      `${BASE_URL}/api/search/model/${encodeURIComponent(modelName)}`
    );
    return response.data;
  } catch (error: unknown) {
    console.error("Error searching by model:", error);
    throw error;
  }
}

/**
 * Search detections by sensor model and TPMS ID.
 * Example usage:
 *    searchByModelAndId("ABC123", "123")
 */
export async function searchByModelAndId(
  modelName: string,
  tpmsId: string
): Promise<DetectionsResponse> {
  try {
    const response = await axios.get<DetectionsResponse>(
      `${BASE_URL}/api/search/model/${encodeURIComponent(modelName)}/id/${encodeURIComponent(tpmsId)}`
    );
    return response.data;
  } catch (error: unknown) {
    console.error("Error searching by model and ID:", error);
    throw error;
  }
}

/**
 * Search detections by a list of TPMS IDs and return a summary.
 * Returns only: timestamp, location, latitude, and longitude.
 * Accepts between 1 and 4 IDs.
 * Example usage:
 *    searchIdsSummary(["123", "456"])
 */
export async function searchIdsSummary(ids: string[]): Promise<DetectionsResponse> {
  try {
    const response = await axios.get<DetectionsResponse>(`${BASE_URL}/api/search/ids/summary`, {
      params: { "ids[]": ids },
    });
    return response.data;
  } catch (error: unknown) {
    console.error("Error searching summary by IDs:", error);
    throw error;
  }
}
