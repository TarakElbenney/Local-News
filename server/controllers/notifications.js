import Notification from "../models/Notification.js";  // Assuming your Notification model

export const getUserNotifications = async (req, res) => {
  try {
    const userId = req.user.id; // Extract user ID from the verified token
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Fetch notifications for the user, sorted by newest first
    const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Server error, unable to fetch notifications" });
  }
};
export const markNotificationsAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;

    await Notification.findByIdAndUpdate(notificationId, { isRead: true });

    res.status(200).json({ message: "Notification marked as read" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
    