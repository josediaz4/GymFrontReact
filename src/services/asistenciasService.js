import apiClient from "../api/apiClient";

export const getResumenAsistencias = async (idSocio) => {
  const response = await apiClient.get(`/asistencias/resumen/${idSocio}`);
  return response.data;
};

export const registarAsistncia = async (idSocio) => {
  const response = await apiClient.post("/asistencias", { idSocio });
  return response.data;
};

export const getAsistenciasPorSocio = async (idSocio) => {
  const response = await apiClient.get(`/asistencias/socio/${idSocio}`);
  return response.data;
};

export const invalidarAsistencia = async (id) => {
  const response = await apiClient.put(`/asistencias/${id}/invalidar`);
  return response.data;
};
