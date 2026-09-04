import apiClient from "./client";

export const registerUser = async ({ name, email, password, phone }) => {
  const response = await apiClient.post("/auth/register", {
    name,
    email,
    password,
    phone,
  });
  return response.data;
};

export const loginUser = async ({ email, password }) => {
  const response = await apiClient.post("/auth/login", { email, password });
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await apiClient.get("/auth/me");
  return response.data;
};
