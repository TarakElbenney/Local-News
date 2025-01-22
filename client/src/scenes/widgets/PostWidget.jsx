import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
} from "@mui/icons-material";
import { Box, Divider, IconButton, TextField, Typography, useTheme, Button, Stack, Chip } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPost } from "state";

const PostWidget = ({
  postId,
  postUserId,
  firstName,
  lastName,
  description,
  location,
  picturePath,
  userPicturePath,
  likes,
  comments,
  themes,
}) => {
  const [isComments, setIsComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user._id);
  const isLiked = Boolean(likes[loggedInUserId]);
  const likeCount = Object.keys(likes).length;

  const { palette } = useTheme();
  const main = palette.neutral.main;
  const primary = palette.primary.main;

  const patchLike = async () => {
    const response = await fetch(`http://localhost:3001/posts/${postId}/like`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: loggedInUserId }),
    });
    const updatedPost = await response.json();
    dispatch(setPost({ post: updatedPost }));
  };

  const addComment = async () => {
    if (!newComment.trim()) return;
    const response = await fetch(`http://localhost:3001/posts/${postId}/comment`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: loggedInUserId, comment: newComment }),
    });
    const updatedPost = await response.json();
    dispatch(setPost({ post: updatedPost }));
    setNewComment("");
  };

  return (
    <WidgetWrapper m="2rem 0">
      <Friend friendId={postUserId} name={`${firstName} ${lastName}`} subtitle={location} userPicturePath={userPicturePath} />
      <Typography color={main} sx={{ mt: "1rem" }}>
        {description}
      </Typography>

      {themes && themes.length > 0 && (
        <Box mt="1rem">
          <Typography variant="subtitle2" sx={{ fontWeight: "bold", color: main, mb: "0.5rem" }}>
            Themes:
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {themes.map((theme, index) => (
              <Chip
                key={index}
                label={theme.name || theme} // Support both cases
                sx={{
                  backgroundColor: primary,
                  color: "white",
                  fontWeight: "bold",
                  borderRadius: "5px",
                  fontSize: "0.85rem",
                }}
              />
            ))}
          </Stack>
        </Box>
      )}

      {picturePath && (
        <img
          width="100%"
          height="auto"
          alt="post"
          style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
          src={`http://localhost:3001/assets/${picturePath}`}
        />
      )}

      <FlexBetween mt="0.25rem">
        <FlexBetween gap="1rem">
          <FlexBetween gap="0.3rem">
            <IconButton onClick={patchLike}>
              {isLiked ? <FavoriteOutlined sx={{ color: primary }} /> : <FavoriteBorderOutlined />}
            </IconButton>
            <Typography>{likeCount}</Typography>
          </FlexBetween>

          <FlexBetween gap="0.3rem">
            <IconButton onClick={() => setIsComments(!isComments)}>
              <ChatBubbleOutlineOutlined />
            </IconButton>
            <Typography>{comments.length}</Typography>
          </FlexBetween>
        </FlexBetween>

        <IconButton>
          <ShareOutlined />
        </IconButton>
      </FlexBetween>

      {isComments && (
        <Box mt="0.5rem">
          {comments.map((comment, i) => (
            <Box key={`${firstName}-${i}`}>
              <Divider />
              <Typography sx={{ color: main, m: "0.5rem 0", pl: "1rem" }}>
                {comment}
              </Typography>
            </Box>
          ))}
          <Divider />
          <Box mt="1rem">
            <TextField
              fullWidth
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              variant="outlined"
              size="small"
            />
            <Button onClick={addComment} variant="contained" sx={{ mt: "0.5rem" }} color="primary">
              Submit
            </Button>
          </Box>
        </Box>
      )}
    </WidgetWrapper>
  );
};

export default PostWidget;
