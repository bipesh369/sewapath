import apiClient from "./client";

export const getNotifications = async () => {
  const response = await apiClient.get("/notifications");
  return response.data;
};

export const markNotificationAsRead = async (id) => {
  const response = await apiClient.patch(`/notifications/${id}/read`);
  return response.data;
};
