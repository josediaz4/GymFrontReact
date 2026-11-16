import apiClient from "../api/apiClient";

export const renovarMembresia = async (data) => {
  const response = await apiClient.post("/pagos/renovar", data);
  return response.data;
};

export const getPagos = async () => {
  const response = await apiClient.get("/pagos");
  return response.data;
};
