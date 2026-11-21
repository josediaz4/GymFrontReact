import apiClient from "../api/apiClient";

export const getInscripcionesPorSocio = async (idSocio) => {
  const response = await apiClient.get(`/inscripciones/socio/${idSocio}`);
  return response.data;
};

export const getInscriptosPorHorario = async (idHorario) => {
  //otra forma
  // (await apiClient.get(`/inscripciones/horario/${idHorario}`)).data;
  const response = await apiClient.get(`/inscripciones/horario/${idHorario}`);
  return response.data;
};

export const inscribirSocio = async (idSocio, idHorario) => {
  const response = await apiClient.post("/inscripciones", {
    idSocio,
    idHorario,
  });
  return response.data;
};

export const desincribirSocio = async (id) => {
  const response = await apiClient.delete(`/inscripciones/${id}`);
  return response.data;
};
