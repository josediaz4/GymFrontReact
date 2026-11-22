import { useEffect, useState } from "react";
import { getPlanes } from "../../services/planesService";
import { getHorarios } from "../../services/horariosService";
import { crearSocio } from "../../services/sociosService";
import { toast } from "react-toastify";
import { mensajeError } from "../../utils/mensajeError";
import { descripcionClase } from "../../utils/horarios";

const formVacio = {
  nombre: "",
  apellido: "",
  dni: "",
  email: "",
  telefono: "",
  idPlan: "",
  metodoPago: "Efectivo",
};

function NuevoSocio() {
  const [planes, setPlanes] = useState([]);
  const [horarios, setHorarios] = useState([]);
  const [formData, setFormData] = useState(formVacio);
  const [clasesElegidas, setClasesElegidas] = useState([]); // ids de horarios
  const [claseSeleccionada, setClaseSeleccionada] = useState("");
  const [error, setError] = useState("");
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    cargarPlanes();
    cargarHorarios();
  }, []);

  const cargarPlanes = async () => {
    try {
      const data = await getPlanes();
      setPlanes(data);
    } catch (err) {
      console.log(err);
      setError("Error al cargar los planes.");
    }
  };

  const cargarHorarios = async () => {
    try {
      setHorarios(await getHorarios());
    } catch (err) {
      console.error(err);
      toast.error(mensajeError(err, "Error al cargar las clases."));
    }
  };

  const cuposLibres = (h) => h.capacidadMaxima - h.inscriptos;

  //Clases con cupo y q todavia no se agregaron
  const clasesDisponibles = formData.idPlan
    ? horarios.filter(
        (h) => cuposLibres(h) > 0 && !clasesElegidas.includes(h.idHorario),
      )
    : [];

  const clasesElegidasDetalles = clasesElegidas
    .map((id) => horarios.find((h) => h.idHorario === id))
    .filter(Boolean);

  const agregarClase = () => {
    if (!formData.idPlan || !claseSeleccionada) return;
    setClasesElegidas([...clasesElegidas, parseInt(claseSeleccionada)]);
    setClaseSeleccionada("");
  };

  const quitarClase = (idHorario) =>
    setClasesElegidas(clasesElegidas.filter((id) => id !== idHorario));

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setGuardando(true);

    try {
      await crearSocio({
        ...formData,
        idPlan: parseInt(formData.idPlan),
        idsHorarios: clasesElegidas,
      });
      toast.success("Socio creado correctamente.");

      setFormData(formVacio);
      setClasesElegidas([]);
      setClaseSeleccionada("");
    } catch (err) {
      console.error(err);
      toast.error(mensajeError(err, "No se pudo crear el socio."));
    } finally {
      setGuardando(false);
      await cargarHorarios(); //refrescar los cupos
    }
  };

  return (
    <div className="container mt-4">
      <div className="card shadow">
        <div className="card-header bg-primary text-white">
          <h3 className="mb-0">Nuevo Socio</h3>
        </div>

        <div className="card-body">
          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Nombre</label>
                <input
                  type="text"
                  name="nombre"
                  className="form-control"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Apellido</label>
                <input
                  type="text"
                  name="apellido"
                  className="form-control"
                  value={formData.apellido}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">DNI</label>
                <input
                  type="text"
                  name="dni"
                  className="form-control"
                  value={formData.dni}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">Teléfono</label>
              <input
                type="text"
                name="telefono"
                className="form-control"
                value={formData.telefono}
                onChange={handleChange}
              />
            </div>
            <hr />

            <h5>Membresía Inicial</h5>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Plan</label>
                <select
                  className="form-select"
                  name="idPlan"
                  value={formData.idPlan}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccionar un plan</option>
                  {planes.map((plan) => (
                    <option key={plan.idPlan} value={plan.idPlan}>
                      {plan.nombrePlan}
                      {" - $"}
                      {plan.precio}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Método de Pago</label>
                <select
                  className="form-select"
                  name="metodoPago"
                  value={formData.metodoPago}
                  onChange={handleChange}
                >
                  <option value="Efectivo">Efectivo</option>
                  <option value="Transferencia">Transferencia</option>
                </select>
              </div>
            </div>
            <hr />

            <h5>Clases</h5>
            <p className="text-muted small">
              Opcional. Podés inscribirlo en una o más clases ahora; también se
              puede hacer después desde Horarios → Inscriptos.
            </p>

            <div className="d-flex gap-2 mb-3">
              <select
                className="form-select"
                value={claseSeleccionada}
                onChange={(e) => setClaseSeleccionada(e.target.value)}
                disabled={!formData.idPlan}
              >
                <option value="">
                  {formData.idPlan
                    ? "--Seleccionar clase--"
                    : "Primero seleccioná un plan"}
                </option>
                {clasesDisponibles.map((h) => (
                  <option key={h.idHorario} value={h.idHorario}>
                    {descripcionClase(h)} ({cuposLibres(h)} cupos)
                  </option>
                ))}
              </select>
              <button
                type="button"
                className="btn btn-outline-success text-nowrap"
                onClick={agregarClase}
                disabled={!formData || !claseSeleccionada}
              >
                Agregar
              </button>
            </div>

            <div className="d-flex flex-wrap gap-2 mb-4">
              {clasesElegidasDetalles.map((h) => (
                <span
                  key={h.idHorario}
                  className="badge bg-secondary d-flex align-items-center gap-2 fs-6 fw-normal"
                >
                  {descripcionClase(h)}
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    style={{ fontSize: "0.6rem" }}
                    aria-label="Quitar"
                    onClick={() => quitarClase(h.idHorario)}
                  />
                </span>
              ))}
            </div>

            <button
              type="submit"
              className="btn btn-success"
              disabled={guardando}
            >
              {guardando ? "Guardando..." : "Guardar Socio"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default NuevoSocio;
