import express from "express";
import {
  getUser,
  getUserFriends,
  addRemoveFriend,
  updateUserThemes,
  getUserThemes
} from "../controllers/users.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* ✅ FIX: Place this route BEFORE any route with `/:id` */
router.get("/get-themes", verifyToken, getUserThemes);  // ✅ Fixes 404 error

/* READ */
router.get("/:id", verifyToken, getUser);
router.get("/:id/friends", verifyToken, getUserFriends);

/* UPDATE */
router.patch("/:id/:friendId", verifyToken, addRemoveFriend);
router.post("/update-themes", verifyToken, updateUserThemes);

export default router;
