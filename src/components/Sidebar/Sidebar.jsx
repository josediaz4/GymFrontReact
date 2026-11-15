import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <div className="bg-dark text-white vh-100 p-3" style={{ width: "250px" }}>
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
      </div>
    </div>
  );
}

export default Sidebar;
