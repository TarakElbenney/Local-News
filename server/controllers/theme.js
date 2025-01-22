import Theme from "../models/Theme.js";
import Post from "../models/Post.js";
import User from "../models/User.js";
// Create a new theme
export const createTheme = async (req, res) => {
  try {
    const { name } = req.body;

    const existingTheme = await Theme.findOne({ name });
    if (existingTheme) {
      return res.status(400).json({ message: "Theme already exists" });
    }

    const newTheme = new Theme({ name });
    await newTheme.save();
    res.status(201).json(newTheme);
  } catch (error) {
    console.error(error); // Added better logging
    res.status(500).json({ message: error.message });
  }
};

// Get all themes
export const getAllThemes = async (req, res) => {
    try {
      const themes = await Theme.find().populate("posts", "name");
      res.status(200).json(themes); // Return the themes as a JSON response
    } catch (error) {
      console.error("Error fetching themes:", error);
      res.status(500).json({ message: error.message }); // Handle server errors
    }
  };

// Delete a theme
export const deleteTheme = async (req, res) => {
  try {
    const { id } = req.params;

    const theme = await Theme.findById(id);
    if (!theme) {
      return res.status(404).json({ message: "Theme not found" });
    }

    await Theme.findByIdAndDelete(id); // Replaced deprecated remove
    await Post.updateMany({ themes: id }, { $pull: { themes: id } });

    res.status(200).json({ message: "Theme deleted successfully" });
  } catch (error) {
    console.error(error); // Added better logging
    res.status(500).json({ message: error.message });
  }
};


// Update a theme
export const updateTheme = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    // Check if the theme exists
    const theme = await Theme.findById(id);
    if (!theme) {
      return res.status(404).json({ message: "Theme not found" });
    }

    // Update the theme
    theme.name = name || theme.name;
    await theme.save();

    res.status(200).json(theme);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getThemePosts = async (req, res) => {
  try {
    console.log("🔵 [Server] Fetching theme posts for user ID:", req.user.id);

    const userId = req.user.id;
    const user = await User.findById(userId).populate("themes");

    if (!user) {
      console.log("❌ [Server] User not found!");
      return res.status(404).json({ message: "User not found" });
    }

    console.log("✅ [Server] User found:", user);

    const themeIds = user.themes.map((theme) => theme._id);
    console.log("📌 [Server] User's theme IDs:", themeIds);

    // Populate themes when fetching posts
    const posts = await Post.find({ themes: { $in: themeIds } })
      .populate("themes", "name") // Populate themes and return only the name
      .exec();

    console.log("🟢 [Server] Found posts with populated themes:", posts);

    res.status(200).json(posts);
  } catch (err) {
    console.error("❌ [Server] Error fetching theme posts:", err);
    res.status(500).json({ message: err.message });
  }
};