import apiClient from "./client";

const getServices = async (page = 1, limit = 20) => {
  const response = await apiClient.get("/services", {
    params: { page, limit },
  });

  return response.data;
};

const getServiceById = async (id) => {
  const response = await apiClient.get(`/services/${id}`);

  return response.data;
};

// "Describe your goal" — free-text keyword matching against services.
const matchServices = async (goalText) => {
  const response = await apiClient.post("/services/match", { goalText });

  return response.data;
};

const createService = async (payload) => {
  const response = await apiClient.post("/services", payload);
  return response.data;
};

const updateService = async (id, payload) => {
  const response = await apiClient.patch(`/services/${id}`, payload);
  return response.data;
};

const deleteService = async (id) => {
  const response = await apiClient.delete(`/services/${id}`);
  return response.data;
};

export {
  getServiceById,
  matchServices,
  createService,
  updateService,
  deleteService,
};
export default getServices;
