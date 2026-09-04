import apiClient from "./client";

export const getEligibilityQuestions = async (serviceId) => {
  const response = await apiClient.get(`/services/${serviceId}/eligibility`);

  return response.data;
};

export const evaluateEligibility = async (serviceId, answers) => {
  const response = await apiClient.post(
    `/services/${serviceId}/eligibility/evaluate`,
    { answers }
  );

  return response.data;
};

export const createEligibilityQuestion = async (serviceId, payload) => {
  const response = await apiClient.post(
    `/services/${serviceId}/eligibility`,
    payload
  );

  return response.data;
};
