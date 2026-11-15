import { useEffect, useState } from "react";
import {
  getProximosVencimientos,
  getSocios,
} from "../../services/dashboardService";

function Dashboard() {
  const [socios, setSocios] = useState([]);
  const [vencimientos, setVencimientos] = useState([]);

  useEffect(() => {
    cargarDashboard();
  }, []);

  const cargarDashboard = async () => {
    try {
      const sociosData = await getSocios();
      const vencimientosData = await getProximosVencimientos();

      setSocios(sociosData);
      setVencimientos(vencimientosData);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container-fluid">
      <h2 className="mb-4">Dashboard</h2>
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card shadow border-0">
            <div className="card-body">
              <h6 className="text-muted">Total de Socios</h6>
              <h2>{socios.length}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow border-0">
            <div className="card-body">
              <h6 className="text-muted">Próximos vencimientos</h6>
              <h2>{vencimientos.length}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow border-0">
            <div className="card-body">
              <h6 className="text-muted">Membresías Activas</h6>
              <h2>{socios.filter((s) => s.estadoMembresia === 1).length}</h2>
            </div>
          </div>
        </div>
      </div>
      <div className="card shadow">
        <div className="card-header">Próximos Vencimientos</div>
        <div className="card-body">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Socio</th>
                <th>Plan</th>
                <th>Vence</th>
                <th>Días</th>
              </tr>
            </thead>
            <tbody>
              {vencimientos.map((venc) => (
                <tr key={venc.idSocio}>
                  <td>{venc.nombreCompleto}</td>
                  <td>{venc.nombrePlan}</td>
                  <td>
                    {new Date(venc.fechaVencimiento).toLocaleDateString()}
                  </td>
                  <td>
                    <span className="badge bg-warning text-dark">
                      {venc.diasRestantes}
                    </span>
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

export default Dashboard;
