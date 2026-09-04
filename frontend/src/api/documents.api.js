import apiClient from "./client";

export const getDocumentRequirements = async (serviceId) => {
  const response = await apiClient.get(`/services/${serviceId}/documents`);
  return response.data;
};

export const createDocumentRequirement = async (serviceId, payload) => {
  const response = await apiClient.post(
    `/services/${serviceId}/documents`,
    payload
  );
  return response.data;
};

export const updateDocumentRequirement = async (id, payload) => {
  const response = await apiClient.patch(`/documents/${id}`, payload);
  return response.data;
};

export const deleteDocumentRequirement = async (id) => {
  const response = await apiClient.delete(`/documents/${id}`);
  return response.data;
};
