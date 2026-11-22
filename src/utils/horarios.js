// "valor" es lo que manda el backend (sin tilde), "etiqueta" lo que se muestra
export const DIAS = [
  { valor: "Lunes", etiqueta: "Lunes" },
  { valor: "Martes", etiqueta: "Martes" },
  { valor: "Miercoles", etiqueta: "Miércoles" },
  { valor: "Jueves", etiqueta: "Jueves" },
  { valor: "Viernes", etiqueta: "Viernes" },
  { valor: "Sabado", etiqueta: "Sábado" },
];

export const etiquetaDia = (valor) =>
  DIAS.find((d) => d.valor === valor)?.etiqueta ?? valor;

// El backend manda "18:00:00"; en pantalla se usa "18:00"
export const recortarHora = (hora) => hora?.slice(0, 5) ?? "";

export const descripcionClase = (h) =>
  `${h.nombreActividad} - ${etiquetaDia(h.diaSemana)} ${recortarHora(h.horaInicio)} a a${recortarHora(h.horaFin)}`;
