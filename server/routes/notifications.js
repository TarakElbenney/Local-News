import express from "express";
import { getUserNotifications,markNotificationsAsRead } from "../controllers/notifications.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/",verifyToken, getUserNotifications);
router.patch("/:notificationId/read", verifyToken, markNotificationsAsRead);
export default router;
