import { Route, Routes } from "react-router-dom";
import Socios from "../pages/Socios/Socios";
import NuevoSocio from "../pages/NuevoSocio/NuevoSocio";
import Layout from "../components/Layout/Layout";
import Dashboard from "../pages/Dashboard/Dashboard";
import DetalleSocio from "../pages/DetalleSocio/DetalleSocio";

function AppRoutes() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Socios />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/socios" element={<Socios />} />
        <Route path="/socios/nuevo" element={<NuevoSocio />} />
        <Route path="/socios/:id" element={<DetalleSocio />} />
      </Routes>
    </Layout>
  );
}

export default AppRoutes;
