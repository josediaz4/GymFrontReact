import { useEffect, useState } from "react";
import { getPagos } from "../../services/pagosService";

function Pagos() {
  const [pagos, setPagos] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    cargarPagos();
  }, []);

  //Cargar Pagos
  const cargarPagos = async () => {
    try {
      const pagosData = await getPagos();
      setPagos(pagosData);
    } catch (error) {
      console.error(error);
    }
  };
  //Filtrar pagos
  const pagosFiltrados = pagos.filter((pago) =>
    pago.nombreCompletoSocio?.toLowerCase().includes(busqueda.toLowerCase()),
  );

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Pagos</h2>
        <input
          type="text"
          className="form-control w-25"
          placeholder="Buscar socio..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>
      <div className="card shadow">
        <div className="card-body">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Socio</th>
                <th>Plan</th>
                <th>Monto</th>
                <th>Método</th>
                <th>Vencimiento</th>
              </tr>
            </thead>
            <tbody>
              {pagosFiltrados.map((pago) => (
                <tr key={pago.idPago}>
                  <td>{new Date(pago.fechaPago).toLocaleDateString()}</td>
                  <td>{pago.nombreCompletoSocio}</td>
                  <td>{pago.nombrePlan}</td>
                  <td>${pago.monto}</td>
                  <td>{pago.metodoPago}</td>
                  <td>
                    {new Date(pago.fechaVencimiento).toLocaleDateString()}
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
export default Pagos;
