import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import { useState } from "react";
import { toast } from "react-toastify";
import { mensajeError } from "../../utils/mensajeError";

function Login() {
  const { login, estaAutenticado } = useAuth();
  const location = useLocation();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [cargando, setCargando] = useState(false);

  const destino = location.state?.from?.pathname || "/dashboard";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    try {
      await login(formData.email.trim(), formData.password);
    } catch (err) {
      console.error(err);
      toast.error(mensajeError(err, "No se pudo iniciar sesion."));
      setCargando(false);
    }
  };

  if (estaAutenticado) return <Navigate to={destino} replace />;

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="card shadow" style={{ width: "380px" }}>
        <div className="card-body p-4">
          <h4 className="text-center mb-4">🏋️ Gym-m@nu</h4>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="text"
                name="email"
                className="form-control"
                value={formData.email}
                placeholder="ejemplo@email.com"
                onChange={handleChange}
                autoFocus
                required
              />
            </div>
            <div className="mb-4">
              <label className="form-label">Contraseña</label>
              <input
                type="password"
                name="password"
                className="form-control"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <button
              type="submit"
              className="btn btn-dark w-100"
              disabled={cargando}
            >
              {cargando ? "Ingresando..." : "Ingresar"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
