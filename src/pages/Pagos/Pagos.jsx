import { useEffect, useState } from "react";
import { getPagos } from "../../services/pagosService";

function Pagos() {
  const [pagos, setPagos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [filtroMetodo, setFiltroMetodo] = useState("");
  const [filtroPlan, setFiltroPlan] = useState("");

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
  //Extraer opciones únicas para los selects dinámicamente
  const metodosDisponibles = [
    ...new Set(pagos.map((p) => p.metodoPago).filter(Boolean)),
  ];
  const planesDisponibles = [
    ...new Set(pagos.map((p) => p.nombrePlan).filter(Boolean)),
  ];
  //Filtrado combinado: nombre, metodo, plan
  const pagosFiltrados = pagos.filter((pago) => {
    const coincideNombre = pago.nombreCompletoSocio
      ?.toLowerCase()
      .includes(busqueda.toLowerCase());
    const coincideMetodo =
      filtroPlan === "" || pago.metodoPago === filtroMetodo;
    const coincidePlan = filtroPlan === "" || pago.nombrePlan === filtroPlan;

    return coincideNombre && coincideMetodo && coincidePlan;
  });
  //Calculos para las tarjetas
  const totalPagos = pagos.length;
  const totalRecaudado = pagos.reduce((total, pago) => total + pago.monto, 0);
  const promedio = totalPagos > 0 ? totalRecaudado / totalPagos : 0;
  //Formateador para moneda
  const formatearMoneda = (valor) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 0,
    }).format(valor);
  };
  //Limpiar todos los filtros
  const limpiarFiltros = () => {
    setBusqueda("");
    setFiltroMetodo("");
    setFiltroPlan("");
  };

  const hayFiltrosActivos =
    busqueda !== "" || filtroMetodo !== "" || filtroPlan !== "";

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Pagos</h2>
        {/* Filtro por nombre */}
        <input
          type="text"
          className="form-control w-25"
          placeholder="Buscar socio..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />

        {/* Filtro por metodo pago */}
        <select
          className="format-select w-30"
          value={filtroMetodo}
          onChange={(e) => setFiltroMetodo(e.target.value)}
        >
          <option value="">Todos los métodos</option>
          {metodosDisponibles.map((metodo) => (
            <option key={metodo} value={metodo}>
              {metodo}
            </option>
          ))}
        </select>

        {/* Filtro por plan */}
        <select
          className="format-select"
          value={filtroPlan}
          onChange={(e) => setFiltroPlan(e.target.value)}
        >
          <option value="">Todos los planes</option>
          {planesDisponibles.map((plan) => (
            <option key={plan} value={plan}>
              {plan}
            </option>
          ))}
        </select>
        {/* Resetear filtros */}
        {hayFiltrosActivos && (
          <button
            className="btn btn-outline-secondary"
            onClick={limpiarFiltros}
          >
            Limpiar
          </button>
        )}
      </div>
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card shadow border-0">
            <div className="card-body">
              <h6 className="text-muted">Total Pagos</h6>
              <h2>{totalPagos}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow border-0">
            <div className="card-body">
              <h6 className="text-muted">Recaudación</h6>
              <h2 className="text-success">
                {formatearMoneda(totalRecaudado)}
              </h2>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow border-0">
            <div className="card-body">
              <h6 className="text-muted">Promedio</h6>
              <h2 className="text-danger">{formatearMoneda(promedio)}</h2>
            </div>
          </div>
        </div>
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
                  <td>{formatearMoneda(pago.monto)}</td>
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
