import { useEffect, useState } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import { useSelector } from "react-redux";
import PostWidget from "./PostWidget";

const PostsWidget = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = useSelector((state) => state.token);

  useEffect(() => {
    const fetchThemePosts = async () => {
      try {
        const response = await fetch("http://localhost:3001/themes/posts", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();

        // Sort posts by latest first
        const sortedPosts = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        setPosts(sortedPosts);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setLoading(false);
      }
    };

    fetchThemePosts();
  }, [token]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" mb={2}>
        Posts based on your themes
      </Typography>
      {posts.length > 0 ? (
        posts.map((post) => (
          <PostWidget
            key={post._id}
            postId={post._id}
            postUserId={post.userId}
            firstName={post.firstName}
            lastName={post.lastName}
            description={post.description}
            location={post.location}
            picturePath={post.picturePath}
            userPicturePath={post.userPicturePath}
            likes={post.likes}
            comments={post.comments}
            themes={post.themes}
          />
        ))
      ) : (
        <Typography>No posts available for your themes.</Typography>
      )}
    </Box>
  );
};

export default PostsWidget;
