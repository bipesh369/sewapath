import apiClient from "./client";

const getServices = async (page = 1, limit = 10) => {
  const response = await apiClient.get("/services", {
    params: {
      page,
      limit,
    },
  });

  return response.data;
};

export default getServices;