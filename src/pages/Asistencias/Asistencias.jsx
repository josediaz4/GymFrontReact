import { useEffect, useState } from "react";
import {
  getAsistencias,
  invalidarAsistencia,
} from "../../services/asistenciasService";
import { mensajeError } from "../../utils/mensajeError";
import { toast } from "react-toastify";

function Asistencias() {
  const [asistencias, setAsistencias] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("todos");

  useEffect(() => {
    cargarAsistencias();
  }, []);

  //Cargar asistencias
  const cargarAsistencias = async () => {
    try {
      const asistenciasData = await getAsistencias();
      setAsistencias(asistenciasData);
    } catch (error) {
      console.error(error);
    }
  };
  //Filtrar asistencias
  const filtradas = asistencias.filter((a) => {
    const conincideBusqueda = a.nombreCompletoSocio
      ?.toLowerCase()
      .includes(busqueda.toLowerCase());
    const coincideEstado =
      estadoFiltro === "todos"
        ? true
        : estadoFiltro === "validas"
          ? a.asistenciaValida
          : !a.asistenciaValida;

    return conincideBusqueda && coincideEstado;
  });
  //Invalidar asistencia
  const handleInvalidar = async (idAsistencia) => {
    const confirmar = window.confirm("¿Invalidar esta asistencia?");
    if (!confirmar) return;

    try {
      await invalidarAsistencia(idAsistencia);
      await cargarAsistencias();
      toast.success("Asistencia invalidada correctamente.");
    } catch (err) {
      console.error(err);
      toast.error(mensajeError(err, "Error al invalidar la asistencia."));
    }
  };

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Asistencias</h2>
        <div className="d-flex gap-2">
          <input
            type="text"
            className="form-control w-30"
            placeholder="Buscar socio por nombre..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <select
            className="form-select w-30"
            value={estadoFiltro}
            onChange={(e) => setEstadoFiltro(e.target.value)}
          >
            <option value="todos">Todas</option>
            <option value="validas">Válidas</option>
            <option value="invalidas">Invalidas</option>
          </select>
        </div>
      </div>
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card shadow border-0">
            <div className="card-body">
              <h6 className="text-muted">Total Asistencias</h6>
              <h2>{asistencias.length}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow border-0">
            <div className="card-body">
              <h6 className="text-muted">Asistencias Válidas</h6>
              <h2 className="text-success">
                {asistencias.filter((a) => a.asistenciaValida).length}
              </h2>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow border-0">
            <div className="card-body">
              <h6 className="text-muted">Total Invalidas</h6>
              <h2 className="text-danger">
                {asistencias.filter((a) => !a.asistenciaValida).length}
              </h2>
            </div>
          </div>
        </div>
      </div>
      <div className="card shadow">
        <div className="card-body">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Socio</th>
                <th>Fecha</th>
                <th>Estado</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {filtradas.map((asistencia) => (
                <tr key={asistencia.idAsistencia}>
                  <td>{asistencia.nombreCompletoSocio}</td>
                  <td>
                    {new Date(asistencia.fechaAsistencia).toLocaleString()}
                  </td>
                  <td>
                    {asistencia.asistenciaValida ? (
                      <span className="badge bg-success">Válida</span>
                    ) : (
                      <span className="badge bg-danger">Invalidada</span>
                    )}
                  </td>
                  <td>
                    {asistencia.asistenciaValida ? (
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleInvalidar(asistencia.idAsistencia)}
                      >
                        Invalidar
                      </button>
                    ) : (
                      <span className="text-muted">Sin acciones</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Asistencias;
