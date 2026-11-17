import { Route, Routes } from "react-router-dom";
import Socios from "../pages/Socios/Socios";
import NuevoSocio from "../pages/NuevoSocio/NuevoSocio";
import Layout from "../components/Layout/Layout";
import Dashboard from "../pages/Dashboard/Dashboard";
import DetalleSocio from "../pages/DetalleSocio/DetalleSocio";
import Pagos from "../pages/Pagos/Pagos";
import Asistencias from "../pages/Asistencias/Asistencias";
import PlanesPago from "../pages/PlanesPago/PlanesPago";

function AppRoutes() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/socios" element={<Socios />} />
        <Route path="/socios/nuevo" element={<NuevoSocio />} />
        <Route path="/socios/:id" element={<DetalleSocio />} />
        <Route path="/pagos" element={<Pagos />} />
        <Route path="/asistencias" element={<Asistencias />} />
        <Route path="/planespago" element={<PlanesPago />} />
      </Routes>
    </Layout>
  );
}

export default AppRoutes;
