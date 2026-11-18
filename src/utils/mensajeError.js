export const mensajeError = (err, porDefecto) => {
  const data = err.response?.data;
  return typeof data === "string" ? data : data?.mensaje || porDefecto;
};
