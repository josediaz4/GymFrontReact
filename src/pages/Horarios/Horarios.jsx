import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  getHorarios,
  crearHorario,
  actualizarHorario,
  eliminarHorario,
} from "../../services/horariosService";
import { getSocios } from "../../services/sociosService";
import {
  getInscriptosPorHorario,
  inscribirSocio,
  desincribirSocio,
} from "../../services/inscripcionesService";
import { mensajeError } from "../../utils/mensajeError";

// "valor" es lo que espera el backend (sin tilde), "etiqueta" lo que se muestra
const DIAS = [
  { valor: "Lunes", etiqueta: "Lunes" },
  { valor: "Martes", etiqueta: "Martes" },
  { valor: "Miercoles", etiqueta: "Miércoles" },
  { valor: "Jueves", etiqueta: "Jueves" },
  { valor: "Viernes", etiqueta: "Viernes" },
  { valor: "Sabado", etiqueta: "Sábado" },
];

const horarioVacio = {
  nombreActividad: "",
  diaSemana: "Lunes",
  horaInicio: "",
  horaFin: "",
  capacidadMaxima: "",
};

// El backend manda "18:00:00"; el input y la tabla usan "18:00"
const recortarHora = (hora) => hora?.slice(0, 5) ?? "";
const etiquetaDia = (valor) =>
  DIAS.find((d) => d.valor === valor)?.etiqueta ?? valor;

function Horarios() {
  const [horarios, setHorarios] = useState([]);
  const [diaFiltro, setDiaFiltro] = useState("todos");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [horarioEditado, setHorarioEditado] = useState(null);
  const [horarioData, setHorarioData] = useState(horarioVacio);
  const [error, setError] = useState("");
  const [socios, setSocios] = useState([]);
  const [horarioInscriptos, setHorarioInscriptos] = useState(null);
  const [inscriptos, setInscriptos] = useState([]);
  const [idSocioNuevo, setIdSocioNuevo] = useState("");

  useEffect(() => {
    cargarHorario();
  }, []);

  const cargarHorario = async () => {
    try {
      setHorarios(await getHorarios());
    } catch (err) {
      console.error(err);
      toast.error(mensajeError(err, "Error al cargar las clases."));
    }
  };

  const horariosFiltrados = horarios.filter(
    (h) => diaFiltro === "todos" || h.diaSemana === diaFiltro,
  );

  const abriModalNuevo = () => {
    setHorarioEditado(null);
    setHorarioData(horarioVacio);
    setError("");
    setMostrarModal(true);
  };

  const abrirModalEditar = (horario) => {
    setHorarioEditado(horario);
    setHorarioData({
      nombreActividad: horario.nombreActividad,
      diaSemana: horario.diaSemana,
      horaInicio: recortarHora(horario.horaInicio),
      horaFin: recortarHora(horario.horaFin),
      capacidadMaxima: horario.capacidadMaxima,
    });
    setError("");
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setHorarioEditado(null);
    setHorarioData(horarioVacio);
    setError("");
  };

  const handleChange = (e) =>
    setHorarioData({ ...horarioData, [e.target.name]: e.target.value });

  const handleGuardar = async (e) => {
    e.preventDefault();
    setError("");

    // "HH:mm" se puede comparar como texto
    if (horarioData.horaFin <= horarioData.horaInicio) {
      setError("La hora de fin debe ser mayor que la hora de inicio.");
      return;
    }

    const payload = {
      nombreActividad: horarioData.nombreActividad.trim(),
      diaSemana: horarioData.diaSemana,
      horaInicio: `${horarioData.horaInicio}:00`,
      horaFin: `${horarioData.horaFin}:00`,
      capacidadMaxima: parseInt(horarioData.capacidadMaxima),
    };

    try {
      if (horarioEditado) {
        await actualizarHorario(horarioEditado.idHorario, {
          ...payload,
          idHorario: horarioEditado.idHorario,
        });
      } else {
        await crearHorario(payload);
      }
      cerrarModal(true);
      await cargarHorario();
      toast.success(
        horarioEditado
          ? "Clase actualizada correctamente"
          : "Clase creada correctamente.",
      );
    } catch (err) {
      console.error(err);
      setError(mensajeError(err, "Error al guardar la clase."));
    }
  };

  const handleEliminar = async (horario) => {
    if (
      !window.confirm(
        `¿Eliminar "${horario.nombreActividad}" del ${etiquetaDia(horario.diaSemana).toLowerCase()}?`,
      )
    )
      return;

    try {
      await eliminarHorario(horario.idHorario);
      await cargarHorario();
      toast.success("Clase eliminada correctamente.");
    } catch (err) {
      console.error(err);
      toast.error(mensajeError(err, "No se pudo eliminar la clase."));
    }
  };

  const cargarInscriptos = async (idHorario) => {
    try {
      setInscriptos(await getInscriptosPorHorario(idHorario));
    } catch (err) {
      console.error(err);
      toast.error(mensajeError(err, "Error al cargar los inscriptos."));
    }
  };

  const abrirInscriptos = async (horario) => {
    setHorarioInscriptos(horario);
    setInscriptos([]);
    setIdSocioNuevo("");
    try {
      setSocios(await getSocios());
    } catch (err) {
      console.error(err);
      toast.error(mensajeError(err, "Error al cargar los socios"));
    }
    await cargarInscriptos(horario.idHorario);
  };

  const cerrarInscriptos = () => {
    setHorarioInscriptos(null);
    setInscriptos([]);
    setIdSocioNuevo("");
  };

  const handleInscribir = async () => {
    try {
      await inscribirSocio(parseInt(idSocioNuevo), horarioInscriptos.idHorario);
      setIdSocioNuevo("");
      await cargarInscriptos(horarioInscriptos.idHorario);
      toast.success("Socio inscripto correctamente.");
    } catch (err) {
      console.error(err);
      toast.error(mensajeError(err, "No se pudo inscribir al socio."));
    }
  };

  const handleDesincribir = async (inscripcion) => {
    if (
      !window.confirm(
        `¿Dat de baja a ${inscripcion.nombreCompletoSocio} de esta clase?`,
      )
    )
      return;
    try {
      await desincribirSocio(inscripcion.idInscripcion);
      await cargarInscriptos(horarioInscriptos.idHorario);
      toast.success("Socio dado de baja de la clase.");
    } catch (err) {
      console.error(err);
      toast.error(mensajeError(err, "No se pudo dar de baja al socio."));
    }
  };

  //Cupos y socios que se pueden inscribir (activos y todavia no anotados)
  const cuposLibres = horarioInscriptos
    ? horarioInscriptos.capacidadMaxima - inscriptos.length
    : 0;

  const sociosDisponibles = socios
    .filter(
      (s) =>
        s.estadoMembresia === 1 &&
        !inscriptos.some((i) => i.idSocio === s.idSocio),
    )
    .sort((a, b) => a.nombreCompleto.localeCompare(b.nombreCompleto));

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Clases y horarios</h2>
        <div className="d-flex gap-2">
          <select
            className="form-select"
            value={diaFiltro}
            onChange={(e) => setDiaFiltro(e.target.value)}
          >
            <option value="todos">Todos los dias</option>
            {DIAS.map((d) => (
              <option key={d.valor} value={d.valor}>
                {d.etiqueta}
              </option>
            ))}
          </select>
          <button
            className="btn btn-success text-nowrap"
            onClick={abriModalNuevo}
          >
            ➕Nueva Clase
          </button>
        </div>
      </div>
      <div className="card show">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Actividad</th>
                  <th>Día</th>
                  <th>Horario</th>
                  <th>Capacidad</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {horariosFiltrados.map((h) => (
                  <tr key={h.idHorario}>
                    <td>{h.nombreActividad}</td>
                    <td>{etiquetaDia(h.diaSemana)}</td>
                    <td>
                      {recortarHora(h.horaInicio)} - {recortarHora(h.horaFin)}
                    </td>
                    <td>{h.capacidadMaxima}</td>
                    <td className="d-flex gap-2">
                      <button
                        className="btn btn-info btn-sm text-white"
                        onClick={() => abrirInscriptos(h)}
                      >
                        Inscriptos
                      </button>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => abrirModalEditar(h)}
                      >
                        Editar
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleEliminar(h)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
                {horariosFiltrados.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center text-muted">
                      No hay clases cargadas.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {mostrarModal && (
        <>
          <div className="modal show d-block" tabIndex="-1">
            <div className="modal-dialog">
              <form className="modal-content" onSubmit={handleGuardar}>
                <div className="modal-header">
                  <h5 className="modal-title">
                    {horarioEditado ? "Editar clase" : "Nueva clase"}
                  </h5>
                  <button
                    type="button"
                    className="btn btn-close"
                    onClick={cerrarModal}
                  />
                </div>
                <div className="modal-body">
                  {error && <div className="alert alert-danger">{error}</div>}
                  <div className="mb-3">
                    <label className="form-label">Actividad</label>
                    <input
                      type="text"
                      className="form-control"
                      name="nombreActividad"
                      value={horarioData.nombreActividad}
                      maxLength={100}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Día</label>
                    <select
                      className="form-select"
                      name="diaSemana"
                      value={horarioData.diaSemana}
                      onChange={handleChange}
                    >
                      {DIAS.map((d) => (
                        <option key={d.valor} value={d.valor}>
                          {d.etiqueta}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Hora de inicio</label>
                      <input
                        type="time"
                        name="horaInicio"
                        className="form-control"
                        value={horarioData.horaInicio}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Hora de fin</label>
                      <input
                        type="time"
                        name="horaFin"
                        className="form-control"
                        value={horarioData.horaFin}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Capacidad máxima</label>
                    <input
                      type="number"
                      name="capacidadMaxima"
                      className="form-control"
                      min="1"
                      max="100"
                      value={horarioData.capacidadMaxima}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={cerrarModal}
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-success">
                    Guardar
                  </button>
                </div>
              </form>
            </div>
          </div>
          <div className="modal-backdrop fade show" />
        </>
      )}
      {/* modal de inscriptos */}
      {horarioInscriptos && (
        <>
          <div className="modal show d-block" tabIndex="-1">
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    {horarioInscriptos.nombreActividad} -{" "}
                    {etiquetaDia(horarioInscriptos.diaSemana)}{" "}
                    {recortarHora(horarioInscriptos.horaInicio)}{" "}
                    {recortarHora(horarioInscriptos.horaFin)}{" "}
                  </h5>
                  <button
                    type="button"
                    className="btn btn-close"
                    onClick={cerrarInscriptos}
                  />
                </div>
                <div className="modal-body">
                  <p>
                    Cupos:{" "}
                    <span
                      className={`badge ${cuposLibres > 0 ? "bg-success" : "bg-danger"}`}
                    >
                      {inscriptos.length} / {horarioInscriptos.capacidadMaxima}
                    </span>
                    {cuposLibres <= 0 && (
                      <span className="text-danger ms">
                        La clase está completa
                      </span>
                    )}
                  </p>

                  <div className="d-flex gap-2 mb-4">
                    <select
                      className="form-select"
                      value={idSocioNuevo}
                      onChange={(e) => setIdSocioNuevo(e.target.value)}
                      disabled={cuposLibres <= 0}
                    >
                      <option value="">--Seleccionar socio--</option>
                      {sociosDisponibles.map((s) => (
                        <option key={s.idSocio} value={s.idSocio}>
                          {s.nombreCompleto} - DNI {s.dni}
                        </option>
                      ))}
                    </select>
                    <button
                      className="btn btn-success text-nowrap"
                      onClick={handleInscribir}
                      disabled={!idSocioNuevo || cuposLibres <= 0}
                    >
                      Inscribir
                    </button>
                  </div>

                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Socio</th>
                        <th>Inscripto desde</th>
                        <th>Acción</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inscriptos.map((i) => (
                        <tr key={i.idInscripcion}>
                          <td>{i.nombreCompletoSocio}</td>
                          <td>
                            {new Date(i.fechaInscripcion).toLocaleDateString()}
                          </td>
                          <td>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => handleDesincribir(i)}
                            >
                              Dar de baja
                            </button>
                          </td>
                        </tr>
                      ))}
                      {inscriptos.length === 0 && (
                        <tr>
                          <td colSpan="3" className="text-center text-muted">
                            No hay socios inscriptos
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={cerrarInscriptos}
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show" />
        </>
      )}
    </div>
  );
}

export default Horarios;
