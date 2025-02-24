import User from "../models/User.js";

/* READ */
export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUserFriends = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );
    res.status(200).json(formattedFriends);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* UPDATE */
export const addRemoveFriend = async (req, res) => {
  try {
    const { id, friendId } = req.params;
    const user = await User.findById(id);
    const friend = await User.findById(friendId);

    if (user.friends.includes(friendId)) {
      user.friends = user.friends.filter((id) => id !== friendId);
      friend.friends = friend.friends.filter((id) => id !== id);
    } else {
      user.friends.push(friendId);
      friend.friends.push(id);
    }
    await user.save();
    await friend.save();

    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );

    res.status(200).json(formattedFriends);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
export const updateUserThemes = async (req, res) => {
  try {
    const { themes } = req.body; // Get new theme IDs
    const userId = req.user.id; // Get authenticated user ID

    if (!Array.isArray(themes)) {
      return res.status(400).json({ message: "Themes should be an array of IDs." });
    }

    // Overwrite the user's themes instead of adding new ones
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { themes }, // Directly replace the themes array
      { new: true }
    ).populate("themes");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({
      message: "Themes updated successfully.",
      themes: updatedUser.themes,
    });
  } catch (err) {
    res.status(500).json({ message: "An error occurred while updating themes.", error: err.message });
  }
};

export const getUserThemes = async (req, res) => {
  try {
    const userId = req.user.id; // Extract user ID from the authenticated token
    const user = await User.findById(userId).populate("themes"); // Fetch user with themes

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ themes: user.themes });
  } catch (error) {
    res.status(500).json({ message: "Error fetching user themes", error: error.message });
  }
};

