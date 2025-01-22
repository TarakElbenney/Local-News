import mongoose from "mongoose";

const themeSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
  },
  { timestamps: true }
);

const Theme = mongoose.model("Theme", themeSchema);
export default Theme;
