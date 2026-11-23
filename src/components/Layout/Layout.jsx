import { useState } from "react";
import Sidebar from "../Sidebar/Sidebar";

function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="d-flex">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div
        className="flex-grow-1 p-4"
        style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}
      >
        {/* Boton hamburguesa Solo telefonos */}
        <div className="d-md-none p-2">
          <button className="btn btn-dark" onClick={() => setSidebarOpen(true)}>
            ☰
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}

export default Layout;
