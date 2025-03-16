import axiosInstance from "../axiosInstance";

export const getLiveData = async (): Promise<Blob> => {
  const response = await axiosInstance.get("/live/live_data", {
    responseType: "blob",
  });
  return response.data as Blob;
};
