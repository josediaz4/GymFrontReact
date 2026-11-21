import { useState } from "react";
import { AuthContext } from "./AuthContext";
import { login as loginRequest } from "../services/authService";

const leerSesion = () => {
  try {
    return JSON.parse(localStorage.getItem("auth"));
  } catch {
    return null;
  }
};

export function AuthProvider({ children }) {
  const [sesion, setSesion] = useState(leerSesion);

  const login = async (email, password) => {
    const data = await loginRequest(email, password);
    const nueva = { token: data.token, usuario: data.usuario };
    localStorage.setItem("auth", JSON.stringify(nueva));
    setSesion(nueva);
  };

  const logout = () => {
    localStorage.removeItem("auth");
    setSesion(null);
  };

  return (
    <AuthContext.Provider
      value={{
        usuario: sesion?.usuario ?? null,
        estaAutenticado: Boolean(sesion?.token),
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
