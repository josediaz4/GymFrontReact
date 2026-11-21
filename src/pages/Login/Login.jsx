import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import { useState } from "react";
import { toast } from "react-toastify";
import { mensajeError } from "../../utils/mensajeError";
import "./Login.css";

function Login() {
  const { login, estaAutenticado } = useAuth();
  const location = useLocation();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [cargando, setCargando] = useState(false);
  const [verPassword, setVerPassword] = useState(false);
  const [sacudir, setSacudir] = useState(false);

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
      setSacudir(true);
      setCargando(false);
    }
  };

  if (estaAutenticado) return <Navigate to={destino} replace />;

  return (
    <div className="login-page">
      <section className="login-hero">
        <div className="login-brand">🏋️ Gym-m@nu</div>
        <div>
          <h1 className="login-title">
            Entrená
            <br />
            <span>Superate</span>
            <br />
            Repetí
          </h1>
          <p className="login-sub">
            Panel de administración: socios, clases, asistencias y pagos en un
            solo lugar.
          </p>
        </div>
        <div className="login-pills">
          <span>👥 Socios</span>
          <span>🕒 Clases</span>
          <span>✅ Asistencias</span>
          <span>💰 Pagos</span>
        </div>
      </section>

      <section className="login-side">
        <form
          className={`login-card ${sacudir ? "login-shake" : ""}`}
          onSubmit={handleSubmit}
          onAnimationEnd={() => setSacudir(false)}
        >
          <h2 className="login-heading">Bienvenido</h2>
          <p className="login-caption">
            Ingresá con tu cuenta de administrador
          </p>

          <div className="mb-3">
            <label className="form-label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              className="form-control"
              value={formData.email}
              placeholder="ejemplo@email.com"
              autoComplete="username"
              onChange={handleChange}
              autoFocus
              required
            />
          </div>

          <div className="mb-4">
            <label className="login-label" htmlFor="password">
              Contraseña
            </label>
            <div className="login-password">
              <input
                id="password"
                type={verPassword ? "text" : "password"}
                name="password"
                className="form-control login-input"
                placeholder="******"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="login-toggle"
                onClick={() => setVerPassword(!verPassword)}
                tabIndex={-1}
              >
                {verPassword ? "Ocultar" : "Mostrar"}
              </button>
            </div>
          </div>

          <button type="sumit" className="login-btn" disabled={cargando}>
            {cargando ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" />
                Ingresando...
              </>
            ) : (
              "Ingresar"
            )}
          </button>
        </form>
      </section>
    </div>

    // <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
    //   <div className="card shadow" style={{ width: "380px" }}>
    //     <div className="card-body p-4">
    //       <h4 className="text-center mb-4">🏋️ Gym-m@nu</h4>
    //       <form onSubmit={handleSubmit}>
    //         <div className="mb-3">
    //           <label className="form-label">Email</label>
    //           <input
    //             type="text"
    //             name="email"
    //             className="form-control"
    //             value={formData.email}
    //             placeholder="ejemplo@email.com"
    //             onChange={handleChange}
    //             autoFocus
    //             required
    //           />
    //         </div>
    //         <div className="mb-4">
    //           <label className="form-label">Contraseña</label>
    //           <input
    //             type="password"
    //             name="password"
    //             className="form-control"
    //             value={formData.password}
    //             onChange={handleChange}
    //             required
    //           />
    //         </div>
    //         <button
    //           type="submit"
    //           className="btn btn-dark w-100"
    //           disabled={cargando}
    //         >
    //           {cargando ? "Ingresando..." : "Ingresar"}
    //         </button>
    //       </form>
    //     </div>
    //   </div>
    // </div>
  );
}

export default Login;
