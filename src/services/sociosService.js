import apiClient from "../api/apiClient";

export const getSocios = async () => {
  const response = await apiClient.get("/socios");
  return response.data;
};

export const crearSocio = async (socio) => {
  const response = await apiClient.post("/socios", socio);
  return response.data;
};

export const getMembresiaActual = async (id) => {
  const response = await apiClient.get(`/socios/${id}/membresia-actual`);
  return response.data;
};

export const getHistorialPagos = async (id) => {
  const response = await apiClient.get(`/socios/${id}/historial-pagos`);
  return response.data;
};
