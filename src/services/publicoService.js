import apiClient from "../api/apiClient";

export const getPlanesPublicos = async () => {
  const response = await apiClient.get("/publico/planes");
  return response.data;
};

export const getHorariosPublicos = async () => {
  const response = await apiClient.get("/publico/horarios");
  return response.data;
};
