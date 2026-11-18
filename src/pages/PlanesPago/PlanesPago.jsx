import { useEffect, useState } from "react";
import {
  actualizarPlan,
  crearPlan,
  eliminarPlan,
  getPlanes,
} from "../../services/planesService";
import { mensajeError } from "../../utils/mensajeError";
import { toast } from "react-toastify";

const planVacio = {
  nombrePlan: "",
  precio: "",
  cantidadClases: "",
  duracionDias: "",
};

function PlanesPago() {
  const [planes, setPlanes] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [planEditado, setPlanEditado] = useState(null);
  const [formData, setFormData] = useState(planVacio);
  const [error, setError] = useState("");

  useEffect(() => {
    cargarPlanes();
  }, []);

  //Cargar los planes
  const cargarPlanes = async () => {
    try {
      setPlanes(await getPlanes());
    } catch (err) {
      console.error(err);
      setError("Error al cargar los planes.");
    }
  };
  //Formatear moneda
  const formatearMoneda = (valor) =>
    new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 0,
    }).format(valor);
  //Modal nuevo plan
  const modalNuevoPlan = () => {
    setPlanEditado(null);
    setFormData(planVacio);
    setError("");
    setMostrarModal(true);
  };
  //Modal editar Plan
  const modalEditarPlan = (plan) => {
    setPlanEditado(plan);
    setFormData({
      nombrePlan: plan.nombrePlan,
      precio: plan.precio,
      cantidadClases: plan.cantidadClases ?? "",
      duracionDias: plan.duracionDias ?? "",
    });
    setError("");
    setMostrarModal(true);
  };
  //Cambios dinamicos
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  //guardar
  const handleGuardar = async (e) => {
    e.preventDefault();
    setError("");

    const payload = {
      nombrePlan: formData.nombrePlan.trim(),
      precio: parseFloat(formData.precio),
      cantidadClases: parseInt(formData.cantidadClases),
      duracionDias: parseInt(formData.duracionDias),
    };

    try {
      if (planEditado) {
        await actualizarPlan(planEditado.idPlan, payload);
      } else {
        await crearPlan(payload);
      }
      setMostrarModal(false);
      await cargarPlanes();
      toast.success("Plan creado correctamente.");
    } catch (err) {
      console.error(err);
      setError(mensajeError(err, "Error al guardar el plan."));
    }
  };
  //eliminar
  const handleEliminar = async (plan) => {
    if (!window.confirm(`¿Eliminar el plan "${plan.nombrePlan}"?`)) return;
    try {
      await eliminarPlan(plan.idPlan);
      await cargarPlanes();
      toast.success("Plan borrado correctamente.");
    } catch (err) {
      console.error(err);
      toast.error(mensajeError(err, "No se pudo eliminar el socio."));
    }
  };

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Planes Pago</h2>
        <button className="btn btn-success" onClick={modalNuevoPlan}>
          ➕Nuevo Plan
        </button>
      </div>

      {error && !mostrarModal && (
        <div className="alert alert-danger">{error}</div>
      )}
      <div className="card shadow">
        <div className="card-body">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Plan</th>
                <th>Precio</th>
                <th>Clases Permitidas</th>
                <th>Duración en Dias</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {planes.map((plan) => (
                <tr key={plan.idPlan}>
                  <td>{plan.nombrePlan}</td>
                  <td>{formatearMoneda(plan.precio)}</td>
                  <td>{plan.cantidadClases}</td>
                  <td>{plan.duracionDias}</td>
                  <td className="d-flex gap-2">
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => modalEditarPlan(plan)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleEliminar(plan)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
              {planes.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center text-muted">
                    No hay planes cargados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Logica del modal */}
      {mostrarModal && (
        <>
          <div className="modal show d-block" tabIndex="-1">
            <div className="modal-dialog">
              <form className="modal-content" onSubmit={handleGuardar}>
                <div className="modal-header">
                  <h5 className="modal-title">
                    {planEditado ? "Editar Plan" : "Nuevo Plan"}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setMostrarModal(false)}
                  />
                </div>
                <div className="modal-body">
                  {error && <div className="alert alert-danger">{error}</div>}
                  <div className="mb-3">
                    <label className="label-form">Nombre</label>
                    <input
                      type="text"
                      className="form-control"
                      name="nombrePlan"
                      value={formData.nombrePlan}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="label-form">Precio</label>
                    <input
                      type="number"
                      className="form-control"
                      name="precio"
                      min="0"
                      step="0.01"
                      value={formData.precio}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="label-form">Clases permitidas</label>
                    <input
                      type="number"
                      className="form-control"
                      name="cantidadClases"
                      min="1"
                      value={formData.cantidadClases}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="label-form">Duración en dias</label>
                    <input
                      type="number"
                      className="form-control"
                      name="duracionDias"
                      min="1"
                      value={formData.duracionDias}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondaty"
                    onClick={() => setMostrarModal(false)}
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
    </div>
  );
}
export default PlanesPago;
