export const mensajeError = (err, porDefecto) => {
  const data = err?.response?.data;
  if (typeof data === "string") return data;
  if (data?.errors) {
    const primero = Object.values(data.errors).flat()[0];
    if (primero) return primero;
  }
  return data?.mensaje || porDefecto;
};
