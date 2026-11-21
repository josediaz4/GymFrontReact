import { Navigate, Outlet, replace, Route, Routes } from "react-router-dom";
import Socios from "../pages/Socios/Socios";
import NuevoSocio from "../pages/NuevoSocio/NuevoSocio";
import Layout from "../components/Layout/Layout";
import Dashboard from "../pages/Dashboard/Dashboard";
import DetalleSocio from "../pages/DetalleSocio/DetalleSocio";
import Pagos from "../pages/Pagos/Pagos";
import Asistencias from "../pages/Asistencias/Asistencias";
import PlanesPago from "../pages/PlanesPago/PlanesPago";
import Horarios from "../pages/Horarios/Horarios";
import Login from "../pages/Login/Login";
import RutaProtegida from "./RutaProtegida";

function AppRoutes() {
  return (
    <Routes>
      <Route path="login" element={<Login />} />

      <Route element={<RutaProtegida />}>
        <Route
          element={
            <Layout>
              <Outlet />
            </Layout>
          }
        >
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/socios" element={<Socios />} />
          <Route path="/socios/nuevo" element={<NuevoSocio />} />
          <Route path="/socios/:id" element={<DetalleSocio />} />
          <Route path="/pagos" element={<Pagos />} />
          <Route path="/asistencias" element={<Asistencias />} />
          <Route path="/planespago" element={<PlanesPago />} />
          <Route path="/horarios" element={<Horarios />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default AppRoutes;
