import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/useAuth";

import {
  FaTachometerAlt,
  FaUsers,
  FaUserPlus,
  FaCheckCircle,
  FaDollarSign,
  FaClipboardList,
  FaClock,
} from "react-icons/fa";

import "./Sidebar.css";

function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const { usuario, logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.replace("/");
  };

  return (
    <>
      {sidebarOpen && (
        <div
          className="sidebar-overlay d-md-none"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className={`sidebar-custom ${sidebarOpen ? "sidebar-open" : ""}`}>
        <div className="d-flex justify-content-end d-md-none">
          <button
            className="btn btn-outline-light btn-sm"
            onClick={() => setSidebarOpen(false)}
          >
            ✕
          </button>
        </div>

        <h4 className="sidebar-logo mb-4">🏋️ Pitbull Gym</h4>

        <nav className="nav flex-column">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active-link" : ""}`
            }
          >
            <FaTachometerAlt />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/socios"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active-link" : ""}`
            }
          >
            <FaUsers />
            <span>Socios</span>
          </NavLink>

          <NavLink
            to="/socios/nuevo"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active-link" : ""}`
            }
          >
            <FaUserPlus />
            <span>Nuevo Socio</span>
          </NavLink>

          <NavLink
            to="/asistencias"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active-link" : ""}`
            }
          >
            <FaCheckCircle />
            <span>Asistencias</span>
          </NavLink>

          <NavLink
            to="/pagos"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active-link" : ""}`
            }
          >
            <FaDollarSign />
            <span>Pagos</span>
          </NavLink>

          <NavLink
            to="/planesPago"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active-link" : ""}`
            }
          >
            <FaClipboardList />
            <span>Planes de Pago</span>
          </NavLink>

          <NavLink
            to="/horarios"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active-link" : ""}`
            }
          >
            <FaClock />
            <span>Horarios</span>
          </NavLink>
        </nav>

        <div className="mt-auto border-top pt-3">
          <small className="text-white-50 d-block mb-2">{usuario?.email}</small>

          <button
            className="btn btn-outline-warning btn-sm w-100"
            onClick={handleLogout}
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
