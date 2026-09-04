import apiClient from "./client";

export const getSavedServices = async () => {
  const response = await apiClient.get("/saved-services");
  return response.data;
};

export const saveService = async (serviceId) => {
  const response = await apiClient.post(`/saved-services/${serviceId}`);
  return response.data;
};

export const removeSavedService = async (serviceId) => {
  const response = await apiClient.delete(`/saved-services/${serviceId}`);
  return response.data;
};
