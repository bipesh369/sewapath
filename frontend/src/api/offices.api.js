import apiClient from "./client";

export const getOffices = async () => {
  const response = await apiClient.get("/offices");
  return response.data;
};

export const getOfficeById = async (id) => {
  const response = await apiClient.get(`/offices/${id}`);
  return response.data;
};

export const createOffice = async (payload) => {
  const response = await apiClient.post("/offices", payload);
  return response.data;
};

export const updateOffice = async (id, payload) => {
  const response = await apiClient.patch(`/offices/${id}`, payload);
  return response.data;
};

export const deleteOffice = async (id) => {
  const response = await apiClient.delete(`/offices/${id}`);
  return response.data;
};
