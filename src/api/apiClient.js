import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://pibullgym.runasp.net/api",
});

//adjuntamos el token a cada request
apiClient.interceptors.request.use((config) => {
  try {
    const sesion = JSON.parse(localStorage.getItem("auth"));
    if (sesion?.token) config.headers.Authorization = `Bearer ${sesion.token}`;
  } catch {
    //sesion corrupta: se ignora
  }
  return config;
});

//Si el token venció o es invalido, vuelve al login
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const esLogin = error.config?.url?.includes("auth/login");
    if (error.response?.status === 401 && !esLogin) {
      localStorage.removeItem("auth");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default apiClient;
