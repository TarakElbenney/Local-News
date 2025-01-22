import mongoose from "mongoose";

const postSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId, // Change to ObjectId to reference the User model
      ref: "User", // Specify the ref to User model
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    location: String,
    description: String,
    picturePath: String,
    userPicturePath: String,
    likes: {
      type: Map,
      of: Boolean,
    },
    themes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Theme" }], // Change to ObjectId to reference Theme model
    comments: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

export default Post;
