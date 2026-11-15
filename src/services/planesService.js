import apiClient from "../api/apiClient";

export const getPlanes = async () => {
  const response = await apiClient.get("/planespago");
  return response.data;
};
