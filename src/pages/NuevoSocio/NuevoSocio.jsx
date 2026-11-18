import { useEffect, useState } from "react";
import { getPlanes } from "../../services/planesService";
import { crearSocio } from "../../services/sociosService";
import { toast } from "react-toastify";
import { mensajeError } from "../../utils/mensajeError";

function NuevoSocio() {
  const [planes, setPlanes] = useState([]);
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    email: "",
    telefono: "",
    idPlan: "",
    metodoPago: "Efectivo",
  });
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    cargarPlanes();
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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMensaje("");
    setError("");

    try {
      await crearSocio({
        ...formData,
        idPlan: parseInt(formData.idPlan),
      });
      toast.success("Socio creado correctamente.");

      setFormData({
        nombre: "",
        apellido: "",
        dni: "",
        email: "",
        telefono: "",
        idPlan: "",
        metodoPago: "Efectivo",
      });
    } catch (err) {
      console.log(err);
      toast.error(mensajeError(err, "No se pudo crear el socio."));
    }
  };

  return (
    <div className="container mt-4">
      <div className="card shadow">
        <div className="card-header bg-primary text-white">
          <h3 className="mb-0">Nuevo Socio</h3>
        </div>

        <div className="card-body">
          {mensaje && <div className="alert alert-success">{mensaje}</div>}

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
                  <option value="Tranferencia">Transferencia</option>
                </select>
              </div>
            </div>
            <button type="submit" className="btn btn-success">
              Guardar Socio
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default NuevoSocio;
