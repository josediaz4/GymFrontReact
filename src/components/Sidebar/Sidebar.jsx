import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/useAuth";

function Sidebar() {
  const { usuario, logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.replace("/"); // vuelve a la pag principal
  };

  return (
    <div
      className="bg-dark text-white vh-100 p-3 d-flex flex-column"
      style={{ width: "250px" }}
    >
      <h4 className="mb-4">🏋️ Gym-m@nu</h4>
      <div className="nav flex-column">
        <NavLink to="/dashboard" className="nav-link text-white">
          📊 Dashboard
        </NavLink>
        <NavLink to="/socios" className="nav-link text-white">
          👥 Socios
        </NavLink>

        <NavLink to="/socios/nuevo" className="nav-link text-white">
          ➕ Nuevo Socio
        </NavLink>

        <NavLink to="/asistencias" className="nav-link text-white">
          ✅ Asistencias
        </NavLink>

        <NavLink to="/pagos" className="nav-link text-white">
          💰 Pagos
        </NavLink>

        <NavLink to="/planesPago" className="nav-link text-white">
          📱 Planes de Pago
        </NavLink>

        <NavLink to="/horarios" className="nav-link text-white">
          🕒 Horarios
        </NavLink>
      </div>
      <div className="mt-auto border-top pt-3">
        <small className="d-block text-truncate text-white-50 mb-2">
          {usuario?.email}
        </small>
        <button
          className="btn btn-outline-light btn-sm w-100"
          onClick={handleLogout}
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
