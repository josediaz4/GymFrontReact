import apiClient from "../api/apiClient";

export const getHorarios = async () => {
  const response = await apiClient.get("/horarios");
  return response.data;
};

export const crearHorario = async (horario) => {
  const response = await apiClient.post("/horarios", horario);
  return response.data;
};

export const actualizarHorario = async (idHorario, horario) => {
  const response = await apiClient.put(`/horarios/${idHorario}`, horario);
  return response.data;
};

export const eliminarHorario = async (id) => {
  const response = await apiClient.delete(`/horarios/${id}`);
  return response.data;
};
