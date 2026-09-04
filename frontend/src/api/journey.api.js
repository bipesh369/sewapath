import apiClient from "./client";

export const getJourneySteps = async (serviceId) => {
  const response = await apiClient.get(`/services/${serviceId}/journey`);

  return response.data;
};

export const createJourneyStep = async (serviceId, payload) => {
  const response = await apiClient.post(
    `/services/${serviceId}/journey`,
    payload
  );

  return response.data;
};
