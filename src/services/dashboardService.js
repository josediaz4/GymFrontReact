import apiClient from "../api/apiClient";

export const getSocios = async () => {
  const response = await apiClient.get("/socios");
  return response.data;
};

export const getProximosVencimientos = async () => {
  const response = await apiClient.get("/socios/proximos-vencimientos");
  return response.data;
};
