import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://localhost:7274/api",
});

export default apiClient;
