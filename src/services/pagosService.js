import apiClient from "../api/apiClient";

export const renovarMembresia = async (data) => {
  const response = await apiClient.post("/pagos/renovar", data);
  return response.data;
};
