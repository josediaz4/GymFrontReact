import { useEffect, useState } from "react";
import { getSocios } from "../../services/sociosService";
import { Link } from "react-router-dom";

function Socios() {
  const [socios, setSocios] = useState([]);

  useEffect(() => {
    cargarSocios();
  }, []);

  const cargarSocios = async () => {
    try {
      const data = await getSocios();
      setSocios(data);
    } catch (error) {
      console.error(error);
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

  return (
    <div className="container-fluid">
      <h2 className="mb-4">Socios</h2>
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
          {socios.map((socio) => (
            <tr key={socio.idSocio}>
              <td>{socio.nombreCompleto}</td>
              <td>{socio.email}</td>
              <td>{socio.dni}</td>
              <td>{renderEstadoBadge(socio.estadoMembresia)}</td>
              <td>
                <Link
                  to={`/socios/${socio.idSocio}`}
                  className="btn btn-primary btn-sm"
                >
                  Detalles
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Socios;
