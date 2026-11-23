import apiClient from "../api/apiClient";

export const login = async (email, password) => {
  const response = await apiClient.post("api/auth/login", { email, password });
  return response.data;
};
