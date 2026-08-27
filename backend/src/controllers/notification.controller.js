import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import Notification from "../models/notification.model.js";

const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({
    userId: req.user._id,
  }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    message: "Notifications fetched successfully",
    data: notifications,
  });
});

const markNotificationAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findOneAndUpdate(
    {
      _id: req.params.id,
      userId: req.user._id,
    },
    {
      read: true,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!notification) {
    throw new ApiError(404, "Notification not found");
  }

  res.status(200).json({
    success: true,
    message: "Notification marked as read",
    data: notification,
  });
});

export default {
  getNotifications,
  markNotificationAsRead,
};