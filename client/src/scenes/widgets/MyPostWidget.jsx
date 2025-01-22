import React, { useState, useEffect } from "react";
import {
  EditOutlined,
  DeleteOutlined,
  AttachFileOutlined,
  GifBoxOutlined,
  ImageOutlined,
  MicOutlined,
  MoreHorizOutlined,
} from "@mui/icons-material";
import {
  Box,
  Divider,
  Typography,
  InputBase,
  useTheme,
  Button,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Dropzone from "react-dropzone";
import UserImage from "components/UserImage";
import WidgetWrapper from "components/WidgetWrapper";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "state";

const MyPostWidget = ({ picturePath }) => {
  const dispatch = useDispatch();
  const [isImage, setIsImage] = useState(false);
  const [image, setImage] = useState(null);
  const [post, setPost] = useState("");
  const [selectedThemes, setSelectedThemes] = useState([]);
  const [themes, setThemes] = useState([]); // To store available themes from the database
  const { palette } = useTheme();
  const { _id, role } = useSelector((state) => state.user); // Get user ID and role
  const token = useSelector((state) => state.token);
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const mediumMain = palette.neutral.mediumMain;
  const medium = palette.neutral.medium;

  // Fetch themes from the database on component mount
  useEffect(() => {
    const fetchThemes = async () => {
      const response = await fetch("http://localhost:3001/themes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setThemes(data); // Set themes to the state
    };

    fetchThemes();
  }, [token]);

  const handlePost = async () => {
    if (role !== "admin" && role !== "writer") {
      alert("You do not have permission to create a post.");
      return;
    }
  
    const formData = new FormData();
    formData.append("userId", _id);
    formData.append("description", post);
    
    // Send themes one by one instead of an array
    selectedThemes.forEach((theme) => {
      formData.append("themes[]", theme); // 'themes[]' will send each theme individually
    });
  
    if (image) {
      formData.append("picture", image);
      formData.append("picturePath", image.name);
    }
  
    const response = await fetch(`http://localhost:3001/posts`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    const posts = await response.json();
    dispatch(setPosts({ posts }));
    setImage(null);
    setPost("");
    setSelectedThemes([]); // Reset the theme selection after posting
  };

  const handleThemeChange = (theme) => {
    setSelectedThemes((prev) =>
      prev.includes(theme)
        ? prev.filter((t) => t !== theme)
        : [...prev, theme]
    );
  };

  return (
    <WidgetWrapper>
      <FlexBetween gap="1.5rem">
        <UserImage image={picturePath} />
        <InputBase
          placeholder="What's on your mind..."
          onChange={(e) => setPost(e.target.value)}
          value={post}
          sx={{
            width: "100%",
            backgroundColor: palette.neutral.light,
            borderRadius: "2rem",
            padding: "1rem 2rem",
          }}
        />
      </FlexBetween>

      {/* Theme Selection */}
      <Box sx={{ width: "100%", marginTop: "1rem" }}>
        <Typography variant="h6">Select Themes</Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(80px, 1fr))",
            gap: "0.5rem",
            mt: "1rem",
          }}
        >
          {themes.map((theme) => (
            <Box
              key={theme._id} // Use unique ID from theme object
              onClick={() => handleThemeChange(theme._id)} // Store the theme's ID
              sx={{
                padding: "0.5rem",
                borderRadius: "0.5rem",
                textAlign: "center",
                fontSize: "0.875rem",
                fontWeight: "bold",
                cursor: "pointer",
                backgroundColor: selectedThemes.includes(theme._id)
                  ? "primary.main"
                  : "grey.200",
                color: selectedThemes.includes(theme._id) ? "white" : "text.primary",
                transition: "background-color 0.3s, color 0.3s",
                "&:hover": {
                  backgroundColor: selectedThemes.includes(theme._id)
                    ? "primary.dark"
                    : "grey.300",
                },
              }}
            >
              {theme.name}
            </Box>
          ))}
        </Box>
      </Box>

      {isImage && (
        <Box
          border={`1px solid ${medium}`}
          borderRadius="5px"
          mt="1rem"
          p="1rem"
        >
          <Dropzone
            acceptedFiles=".jpg,.jpeg,.png"
            multiple={false}
            onDrop={(acceptedFiles) => setImage(acceptedFiles[0])}
          >
            {({ getRootProps, getInputProps }) => (
              <FlexBetween>
                <Box
                  {...getRootProps()}
                  border={`2px dashed ${palette.primary.main}`}
                  p="1rem"
                  width="100%"
                  sx={{ "&:hover": { cursor: "pointer" } }}
                >
                  <input {...getInputProps()} />
                  {!image ? (
                    <p>Add Image Here</p>
                  ) : (
                    <FlexBetween>
                      <Typography>{image.name}</Typography>
                      <EditOutlined />
                    </FlexBetween>
                  )}
                </Box>
                {image && (
                  <IconButton
                    onClick={() => setImage(null)}
                    sx={{ width: "15%" }}
                  >
                    <DeleteOutlined />
                  </IconButton>
                )}
              </FlexBetween>
            )}
          </Dropzone>
        </Box>
      )}

      <Divider sx={{ margin: "1.25rem 0" }} />

      <FlexBetween>
        <FlexBetween gap="0.25rem" onClick={() => setIsImage(!isImage)}>
          <ImageOutlined sx={{ color: mediumMain }} />
          <Typography
            color={mediumMain}
            sx={{ "&:hover": { cursor: "pointer", color: medium } }}
          >
            Image
          </Typography>
        </FlexBetween>

        {isNonMobileScreens ? (
          <>
            <FlexBetween gap="0.25rem">
              <GifBoxOutlined sx={{ color: mediumMain }} />
              <Typography color={mediumMain}>Clip</Typography>
            </FlexBetween>

            <FlexBetween gap="0.25rem">
              <AttachFileOutlined sx={{ color: mediumMain }} />
              <Typography color={mediumMain}>Attachment</Typography>
            </FlexBetween>

            <FlexBetween gap="0.25rem">
              <MicOutlined sx={{ color: mediumMain }} />
              <Typography color={mediumMain}>Audio</Typography>
            </FlexBetween>
          </>
        ) : (
          <FlexBetween gap="0.25rem">
            <MoreHorizOutlined sx={{ color: mediumMain }} />
          </FlexBetween>
        )}

        <Button
          disabled={!post || (role !== "admin" && role !== "writer")}
          onClick={handlePost}
          sx={{
            color: palette.background.alt,
            backgroundColor: palette.primary.main,
            borderRadius: "3rem",
          }}
        >
          POST
        </Button>
      </FlexBetween>
    </WidgetWrapper>
  );
};

export default MyPostWidget;
