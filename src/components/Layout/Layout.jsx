import Sidebar from "../Sidebar/Sidebar";

function Layout({ children }) {
  return (
    <div className="d-flex">
      <Sidebar />

      <div
        className="flex-grow-1 p-4"
        style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}
      >
        {children}
      </div>
    </div>
  );
}

export default Layout;
