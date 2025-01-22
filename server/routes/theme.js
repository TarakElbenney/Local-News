import express from "express";
import {
  createTheme,
  getAllThemes,
  updateTheme,
  deleteTheme,
  getThemePosts
} from "../controllers/theme.js"; // Import theme controller
import { verifyToken } from "../middleware/auth.js";
const router = express.Router();

// Create a new theme
router.post("/", createTheme);

// Get all themes
router.get("/", getAllThemes);

router.get('/posts', verifyToken, getThemePosts);

// Update a theme
router.put("/:id", updateTheme);

// Delete a theme
router.delete("/:id", deleteTheme);
export default router;
