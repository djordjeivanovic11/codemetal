import axiosInstance from '../axiosInstance';

export interface CsvProcessingStatus {
  status: string;
  filename: string;
  timestamp: string;
  stats?: Record<string, unknown>;
  vehicle_count?: number;
  error?: string;
}


/**
 * Uploads a CSV file containing TPMS sensor detections.
 *
 * @param file - The CSV file to upload.
 * @returns A promise with the backend response.
 */
export const uploadCsv = async (file: File): Promise<{ message: string }> => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await axiosInstance.post<{ message: string }>('/api/upload/csv', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};
