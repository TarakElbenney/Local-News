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
    const { themes } = req.body; // Get the new themes from the request body
    const userId = req.user.id; // Get the authenticated user's ID

    if (!Array.isArray(themes)) {
      return res.status(400).json({ message: "Themes should be an array of IDs." });
    }

    // Update the user's themes by adding new themes without removing existing ones
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { themes: { $each: themes } } }, // Add new themes, avoiding duplicates
      { new: true } // Return the updated user document
    ).populate("themes"); // Populate theme references if needed

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