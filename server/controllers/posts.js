import Post from "../models/Post.js";
import User from "../models/User.js";
import Theme from "../models/Theme.js";  
/* CREATE */
import Notification from "../models/Notification.js";

export const createPost = async (req, res) => {
  try {
    const { userId, description, picturePath, themes } = req.body;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newPost = new Post({
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      description,
      userPicturePath: user.picturePath,
      picturePath,
      likes: {},
      themes,
      comments: [],
    });

    const savedPost = await newPost.save();

    await Theme.updateMany(
      { _id: { $in: themes } },
      { $push: { posts: savedPost._id } }
    );

    // **Find users subscribed to the theme**
    const usersToNotify = await User.find({ themes: { $in: themes } });

    // **Create notifications**
    const notifications = usersToNotify.map((subscriber) => ({
      userId: subscriber._id,
      message: `New post in theme you follow: ${description.substring(0, 50)}...`
    }));

    await Notification.insertMany(notifications);

    res.status(201).json(savedPost);
  } catch (err) {
    console.error("Error creating post:", err);
    res.status(500).json({ message: err.message });
  }
};

/* READ */


/* ADD COMMENT */
export const addComment = async (req, res) => {
  try {
    const { id } = req.params; // Post ID
    const { comment } = req.body; // New comment
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    post.comments.push(comment); // Add the new comment to the array
    const updatedPost = await post.save();

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* UPDATE */
export const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const post = await Post.findById(id);
    const isLiked = post.likes.get(userId);

    if (isLiked) {
      post.likes.delete(userId);
    } else {
      post.likes.set(userId, true);
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { likes: post.likes },
      { new: true }
    );

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
/* update POST */
export const editPost = async (req, res) => {
  try {
    const { id } = req.params; // Post ID
    const { description, picturePath } = req.body; // New description and picturePath

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Update the post fields
    post.description = description || post.description;
    post.picturePath = picturePath || post.picturePath;

    const updatedPost = await post.save(); // Save updated post

    res.status(200).json(updatedPost); // Return the updated post
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
/* DELETE POST */
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params; // Post ID

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    await post.remove(); // Remove the post from the database

    res.status(200).json({ message: "Post deleted successfully" }); // Return success message
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getFeedPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("themes", "name") // Populate the 'themes' field with the 'name' of the theme
      .exec();
    res.status(200).json(posts);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};


export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const post = await Post.find({ userId }).populate("themes", "name") // Populate the 'themes' field with the 'name' of the theme
    .exec();
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
