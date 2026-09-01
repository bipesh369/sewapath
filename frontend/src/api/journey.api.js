import apiClient from "./client";

export const getJourneySteps = async (serviceId) => {
  const response = await apiClient.get(
    `/services/${serviceId}/journey`
  );

  return response.data;
};