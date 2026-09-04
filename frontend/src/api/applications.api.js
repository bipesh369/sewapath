import apiClient from "./client";

export const createApplication = async (serviceId, eligibility) => {
  const response = await apiClient.post("/applications", {
    serviceId,
    eligible: eligibility?.eligible ?? true,
    eligibilityReason: eligibility?.reason,
  });
  return response.data;
};

export const getMyApplications = async () => {
  const response = await apiClient.get("/applications/me");
  return response.data;
};

export const getApplicationById = async (id) => {
  const response = await apiClient.get(`/applications/${id}`);
  return response.data;
};

export const updateApplicationDelivery = async (id, { deliveryChoice, chosenOffice }) => {
  const response = await apiClient.patch(`/applications/${id}/delivery`, {
    deliveryChoice,
    chosenOffice,
  });
  return response.data;
};

// ---- Admin ----

export const listApplications = async ({ status, page = 1, limit = 20 } = {}) => {
  const response = await apiClient.get("/applications", {
    params: { status, page, limit },
  });
  return response.data;
};

export const getApplicationStats = async () => {
  const response = await apiClient.get("/applications/stats");
  return response.data;
};

export const updateApplicationStatus = async (id, status) => {
  const response = await apiClient.patch(`/applications/${id}/status`, { status });
  return response.data;
};
