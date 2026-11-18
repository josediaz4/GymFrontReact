import { useEffect, useState } from "react";
import {
  actualizarSocio,
  eliminarSocio,
  getSocioPorId,
  getSocios,
} from "../../services/sociosService";
import { Link } from "react-router-dom";
import { mensajeError } from "../../utils/mensajeError";
import { toast } from "react-toastify";

const socioVacio = {
  nombre: "",
  apellido: "",
  dni: "",
  email: "",
  telefono: "",
};

function Socios() {
  const [socios, setSocios] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("todos");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [socioEditado, setSocioEditado] = useState(null);
  const [formData, setFormData] = useState(socioVacio);
  const [error, setError] = useState("");

  useEffect(() => {
    cargarSocios();
  }, []);

  const cargarSocios = async () => {
    try {
      setSocios(await getSocios());
    } catch (err) {
      console.error(err);
    }
  };
  //Filtro combinado: nombre/DNI + estado
  const sociosFiltrados = socios.filter((s) => {
    const texto = busqueda.toLowerCase();
    const coincideTexto =
      s.nombreCompleto?.toLowerCase().includes(texto) ||
      s.dni?.toString().includes(texto);
    const coincideEstado =
      estadoFiltro === "todos" || s.estadoMembresia === parseInt(estadoFiltro);
    return coincideTexto && coincideEstado;
  });
  //Estado personalizados con colores
  const renderEstadoBadge = (estado) => {
    switch (estado) {
      case 1:
        return <span className="badge bg-success">Activo</span>;
      case 2:
        return <span className="badge bg-danger">Vencido</span>;
      case 3:
        return <span className="badge bg-warning text-dark">Suspendido</span>;
      default:
        return <span className="badge bg-secondary">Sin estado</span>;
    }
  };
  //Modal editar socio
  const modalEditarSocio = async (idSocio) => {
    setError("");
    try {
      const socio = await getSocioPorId(idSocio);
      setSocioEditado(idSocio);
      setFormData({
        nombre: socio.nombre ?? "",
        apellido: socio.apellido ?? "",
        dni: socio.dni ?? "",
        email: socio.email ?? "",
        telefono: socio.telefono ?? "",
      });
      setMostrarModal(true);
    } catch (err) {
      console.error(err);
      toast.error(mensajeError(err, "No se pudo cargar el socio."));
    }
  };
  //Cerrar modal
  const cerrarModal = () => {
    setMostrarModal(false);
    setSocioEditado(null);
    setFormData(socioVacio);
    setError("");
  };
  //cambios dinamicos
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  //Guardar
  const handleGuardar = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await actualizarSocio(socioEditado, formData);
      cerrarModal();
      await cargarSocios();
      toast.success("Socio actualizado correctamente");
    } catch (err) {
      console.error(err);
      setError(mensajeError(err, "Error al guardar el socio."));
    }
  };
  //Eliminar
  const handleEliminar = async (socio) => {
    if (
      !window.confirm(
        `Eliminar a ${socio.nombreCompleto}? Se borraran todos sus pagos y asistencias.`,
      )
    )
      return;
    try {
      await eliminarSocio(socio.idSocio);
      await cargarSocios();
      toast.success("Socio eliminado");
    } catch (err) {
      console.error(err);
      toast.error(mensajeError(err, "No se pudo eliminar el socio."));
    }
  };

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Socios</h2>
        <div className="d-flex gap-2">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por nombre o DNI..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <select
            className="form-select"
            value={estadoFiltro}
            onChange={(e) => setEstadoFiltro(e.target.value)}
          >
            <option value="todos">Todos</option>
            <option value="1">Activos</option>
            <option value="2">Vencidos</option>
            <option value="3">Suspendidos</option>
          </select>
          <Link to={"/socios/nuevo"} className="btn btn-success text-nowrap">
            ➕ Nuevo Socio
          </Link>
        </div>
      </div>
      <div className="card shadow">
        <div className="card-body">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>DNI</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {sociosFiltrados.map((socio) => (
                <tr key={socio.idSocio}>
                  <td>{socio.nombreCompleto}</td>
                  <td>{socio.email}</td>
                  <td>{socio.dni}</td>
                  <td>{renderEstadoBadge(socio.estadoMembresia)}</td>
                  <td className="d-flex gap-2">
                    <Link
                      to={`/socios/${socio.idSocio}`}
                      className="btn btn-primary btn-sm"
                    >
                      Detalles
                    </Link>
                    <button
                      className="btn btn-warning btn-sm"
                      onClick={() => modalEditarSocio(socio.idSocio)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleEliminar(socio.idSocio)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
              {sociosFiltrados.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center text-muted">
                    No se encontraron socios.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {mostrarModal && (
        <>
          <div className="modal show d-block" tabIndex="-1">
            <div className="modal-dialog">
              <form className="modal-content" onSubmit={handleGuardar}>
                <div className="modal-header">
                  <h5 className="modal-title">Editar Socio</h5>
                  <button
                    type="button"
                    className="btn btn-close"
                    onClick={cerrarModal}
                  />
                </div>
                <div className="modal-body">
                  {error && <div className="alert alert-danger">{error}</div>}
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Nombre</label>
                      <input
                        type="text"
                        className="form-control"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Apellido</label>
                      <input
                        type="text"
                        className="form-control"
                        name="apellido"
                        value={formData.apellido}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">DNI</label>
                    <input
                      type="text"
                      className="form-control"
                      name="dni"
                      value={formData.dni}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Telefono</label>
                    <input
                      type="text"
                      className="form-control"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleChange}
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
    </div>
  );
}

export default Socios;
