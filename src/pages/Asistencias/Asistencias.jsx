import { useEffect, useState } from "react";
import {
  getAsistencias,
  invalidarAsistencia,
} from "../../services/asistenciasService";

function Asistencias() {
  const [asistencias, setAsistencias] = useState([]);
  const [busqueda, setBusqueda] = useState("");

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
  const filtradas = asistencias.filter((a) =>
    a.nombreCompletoSocio?.toLowerCase().includes(busqueda.toLowerCase()),
  );
  //Invalidar asistencia
  const handleInvalidar = async (idAsistencia) => {
    const confirmar = window.confirm("¿Invalidar esta asistencia?");
    if (!confirmar) return;

    try {
      await invalidarAsistencia(idAsistencia);
      await cargarAsistencias();
    } catch (error) {
      console.error(error);
      alert("Error al invalidar asistencia");
    }
  };

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-item-center mb-4">
        <h2>Asistencias</h2>
        <input
          type="text"
          className="form-contro w-25"
          placeholder="Buscar socio por ID..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>
      <div className="card shadow">
        <div className="card-bod">
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
