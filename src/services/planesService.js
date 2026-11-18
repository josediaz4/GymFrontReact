import apiClient from "../api/apiClient";

export const getPlanes = async () => {
  const response = await apiClient.get("/planespago");
  return response.data;
};
export const crearPlan = async (plan) => {
  const response = await apiClient.post("/planespago", plan);
  return response.data;
};
export const actualizarPlan = async (id, plan) => {
  const response = await apiClient.put(`/planespago/${id}`, plan);
  return response.data;
};
export const eliminarPlan = async (id) => {
  const response = await apiClient.delete(`/planespago/${id}`);
  return response.data;
};
