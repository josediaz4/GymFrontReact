export const mensajeError = (err, porDefecto) => {
  const data = err?.response?.data;

  if (!data) return porDefecto;
  if (typeof data === "string") return data;

  //Validaciones de modelo (en el Program.cs del back)
  if (Array.isArray(data.errors)) {
    const primero = data.errors[0]?.errores?.[0];
    if (primero) return primero;
  }

  //Formato estandar de ASP.NET (cuando necesite usarlo)
  if (data.errors && typeof data.errors === "object") {
    const primero = Object.values(data.errors).flat()[0];
    if (typeof primero === "string") return primero;
  }

  // ExceptionMiddleware (Message) y respuestas con mensaje
  return data.message || data.Message || data.mensaje || porDefecto;
};
