import express from "express";
import {  likePost,addComment,editPost,deletePost,getFeedPosts,getUserPosts } from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";




const router = express.Router();

/* READ */
router.get("/", verifyToken, getFeedPosts);
router.get("/:userId/posts", verifyToken, getUserPosts);

/* UPDATE */
router.patch("/:id/like", verifyToken, likePost);
router.post("/:id/comment", verifyToken, addComment);
router.patch("/:id", verifyToken, editPost); 
router.delete("/:id", verifyToken, deletePost);
export default router;
