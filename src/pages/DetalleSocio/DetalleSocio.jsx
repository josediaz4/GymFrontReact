import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getHistorialPagos,
  getMembresiaActual,
} from "../../services/sociosService";
import { getResumenAsistencias } from "../../services/asistenciasService";
import { getPlanes } from "../../services/planesService";
import { renovarMembresia } from "../../services/pagosService";
import { registarAsistncia } from "../../services/asistenciasService";
import {
  invalidarAsistencia,
  getAsistenciasPorSocio,
} from "../../services/asistenciasService";

function DetalleSocio() {
  const { id } = useParams();
  const [mostrarModal, setMostrarModal] = useState(false);
  const [membresia, setMembresia] = useState(null);
  const [historial, setHistorial] = useState([]);
  const [resumen, setResumen] = useState(null);
  const [planes, setPlanes] = useState([]);
  const [asistencias, setAsistencias] = useState([]);
  const [renovacion, setRenovacion] = useState({
    idPlan: "",
    metodoPago: "Efectivo",
  });

  useEffect(() => {
    cargarDatos();
    cargarPlanes();
  }, []);

  const cargarDatos = async () => {
    try {
      const membresiaData = await getMembresiaActual(id);
      const historialData = await getHistorialPagos(id);
      const resumenData = await getResumenAsistencias(id);
      const asistenciasData = await getAsistenciasPorSocio(id);

      setMembresia(membresiaData);
      setHistorial(historialData);
      setResumen(resumenData);
      setAsistencias(asistenciasData);
    } catch (error) {
      console.log(error);

      setMembresia({
        nombreCompleto: "Socio sin membresía",
        nombrePlan: "Sin plan",
        metodoPago: "-",
        estadoMembresia: 2,
      });
    }
    //   try {
    //     const historialData = await getHistorialPagos(id);
    //     setHistorial(historialData);
    //   } catch (error) {
    //     console.log(error);
    //   }
    //   try {
    //     const resumenData = await getResumenAsistencias(id);
    //     setResumen(resumenData);
    //   } catch (error) {
    //     console.log(error);
    //   }
  };

  const cargarPlanes = async () => {
    try {
      const data = await getPlanes();
      setPlanes(data);
    } catch (err) {
      console.log(err);
      setError("Error al cargar los planes.");
    }
  };

  const handleRenovar = async () => {
    try {
      await renovarMembresia({
        idSocio: parseInt(id),
        idPlan: parseInt(renovacion.idPlan),
        metodoPago: renovacion.metodoPago,
      });

      //Actualizar datos
      await cargarDatos();

      //Limpiar modal
      setRenovacion({
        idPlan: "",
        metodoPago: "Efectivo",
      });

      //Cerrar modal
      setMostrarModal(false);
    } catch (error) {
      console.log(error);
      alert("Error al renovar");
    }
  };
  //Estado personalizados con colores
  const renderEstadoBadge = (estado) => {
    switch (estado) {
      case 1:
        return <span className="badge bg-success">Activo</span>;
      case 2:
        return <span className="badge bg-danger">Vencido</span>;
      case 3:
        return <span className="badge bg-warning text-dark">Suspendido</span>;
    }
  };
  //Registrar asistencia
  const handleRegistrarAsistencia = async () => {
    try {
      await registarAsistncia(parseInt(id));
      await cargarDatos();
    } catch (error) {
      alert(error.response?.data?.mensaje);
    }
  };
  //Invalidar asistencia
  const handleInvalidarAsistencia = async (idAsistencia) => {
    try {
      await invalidarAsistencia(idAsistencia);
      await cargarDatos();
    } catch (error) {
      console.log(error);
      alert("Error al invalidar la asistencia.");
    }
  };
  //Formateador para moneda
  const formatearMoneda = (valor) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 0,
    }).format(valor);
  };

  if (!membresia) return <p>Cargando...</p>;

  return (
    <div className="container">
      {/* Membresia */}
      <h2 className="mb-4">{membresia.nombreCompleto}</h2>
      <div className="row">
        <div className="col-md-6">
          <div className="card mb-4">
            <div className="card-header">Membresía actual</div>
            <div className="card-body">
              <p>
                <strong>Plan:</strong> {membresia.nombrePlan}
              </p>
              <p>
                <strong>Estado:</strong>{" "}
                {renderEstadoBadge(membresia.estadoMembresia)}
              </p>
              <p>
                <strong>Vence:</strong>{" "}
                {new Date(membresia.fechaVencimiento).toLocaleDateString()}
              </p>
              <p>
                <strong>Método:</strong> {membresia.metodoPago}
              </p>
              <button
                className="btn btn-success mt-3"
                onClick={() => setMostrarModal(true)}
              >
                Renovar Membresía
              </button>
            </div>
          </div>
        </div>
        {/* Resumen de clases */}
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">Resumen de Clases</div>
            <div className="card-body">
              <p>Permitidas: {resumen?.clasesPermitidas}</p>
              <p>Utilizadas: {resumen?.clasesUtilizadas}</p>
              <p>Restantes: {resumen?.clasesRestantes}</p>
              <button
                className="btn btn-primary mt-2"
                onClick={handleRegistrarAsistencia}
              >
                Registrar Asistencia
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Historial Pagos */}
      <div className="card mt-4">
        <div className="card-header">Historial de Pagos</div>
        <div className="card-body">
          <table className="table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Plan</th>
                <th>Monto</th>
                <th>Medio Pago</th>
              </tr>
            </thead>
            <tbody>
              {historial.map((pago) => (
                <tr key={pago.idPago}>
                  <td>{new Date(pago.fechaPago).toLocaleDateString()}</td>
                  <td>{pago.nombrePlan}</td>
                  <td>{formatearMoneda(pago.monto)}</td>
                  <td>{pago.metodoPago}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Invalidar asistencia */}
      <div className="card mt-4">
        <div className="card-header">Historial de asistencias</div>
        <div className="card-body">
          <table className="table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Estado</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {asistencias.map((asistencia) => (
                <tr key={asistencia.idAsistencia}>
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
                        onClick={() =>
                          handleInvalidarAsistencia(asistencia.idAsistencia)
                        }
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
      {/* Modal Renovar Mebresia (con React) */}
      {mostrarModal && (
        <>
          <div className="modal show d-block" tabIndex="-1">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Renovar Membresía</h5>
                  <button
                    className="btn-close"
                    onClick={() => setMostrarModal(false)}
                  />
                </div>
                <div className="modal-body">
                  {/* PLAN */}
                  <select
                    className="form-select mb-3"
                    value={renovacion.idPlan}
                    onChange={(e) =>
                      setRenovacion({
                        ...renovacion,
                        idPlan: e.target.value,
                      })
                    }
                  >
                    <option value="">--Seleccionar un plan--</option>
                    {planes.map((plan) => (
                      <option key={plan.idPlan} value={plan.idPlan}>
                        {plan.nombrePlan}
                      </option>
                    ))}
                  </select>

                  {/* METODO PAGO */}
                  <select
                    className="form-select"
                    value={renovacion.metodoPago}
                    onChange={(e) =>
                      setRenovacion({
                        ...renovacion,
                        metodoPago: e.target.value,
                      })
                    }
                  >
                    <option>Efectivo</option>
                    <option>Tranferencia</option>
                  </select>
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setMostrarModal(false)}
                  >
                    Cancelar
                  </button>
                  <button className="btn btn-success" onClick={handleRenovar}>
                    Guardar
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* OCULTAROverlay  */}
          <div className="modal-backdrop fade show" />
        </>
      )}
    </div>
  );
}

export default DetalleSocio;
