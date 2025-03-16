import axiosInstance from '../axiosInstance';


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

export interface CreateDetectionPayload {
  timestamp: string;
  tpms_id: string;
  tpms_model: string;
  car_model: string;
  location: string;
  latitude: number;
  longitude: number;
}

export interface CreateDetectionResponse {
  id: string;
  message: string;
}

export interface GetAllDetectionsResponse {
  detections: Detection[];
}

export interface GetDetectionResponse {
  detection: Detection;
}

export interface GetLatestDetectionsResponse {
  latest: Detection[];
}

/**
 * Retrieve all detections from the backend.
 */
export const getAllDetections = async (): Promise<GetAllDetectionsResponse> => {
  const response = await axiosInstance.get<GetAllDetectionsResponse>('/api/detection/');
  return response.data;
};

/**
 * Retrieve a detection by its ID.
 *
 * @param detectionId - The UUID of the detection.
 */
export const getDetectionById = async (detectionId: string): Promise<GetDetectionResponse> => {
  const response = await axiosInstance.get<GetDetectionResponse>(`/api/detection/${detectionId}`);
  return response.data;
};

/**
 * Retrieve the latest three detections.
 */
export const getLatestDetections = async (): Promise<GetLatestDetectionsResponse> => {
  const response = await axiosInstance.get<GetLatestDetectionsResponse>('/api/detection/latest');
  return response.data;
};

/**
 * Create a new detection.
 *
 * @param detectionData - The payload with detection details.
 */
export const createDetection = async (
  detectionData: CreateDetectionPayload
): Promise<CreateDetectionResponse> => {
  const response = await axiosInstance.post<CreateDetectionResponse>('/api/detection/', detectionData);
  return response.data;
};
