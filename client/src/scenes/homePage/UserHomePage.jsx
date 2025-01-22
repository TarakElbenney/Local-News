import { useState } from "react";
import { Box, useMediaQuery, Button } from "@mui/material";
import { useSelector } from "react-redux";
import Navbar from "scenes/navbar";
import UserWidget from "scenes/widgets/UserWidget";
import AdvertWidget from "scenes/widgets/AdvertWidget";
import ThemeWidget from "scenes/widgets/ThemeWidget";
import PostsWidget from "scenes/widgets/PostsWidget";
import FeedWidget from "scenes/widgets/FeedWidget"; // Import FeedWidget

const UserHomePage = () => {
  const [selectedFeed, setSelectedFeed] = useState("globalFeed"); // Track selected feed
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const { _id, picturePath } = useSelector((state) => state.user);

  return (
    <Box>
      <Navbar />
      <Box
        width="100%"
        padding="2rem 6%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="0.5rem"
        justifyContent="space-between"
      >
        {/* Left Sidebar */}
        <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
          <UserWidget userId={_id} picturePath={picturePath} />
        </Box>

        {/* Main Content */}
        <Box flexBasis={isNonMobileScreens ? "42%" : undefined} mt={isNonMobileScreens ? undefined : "2rem"}>
          <ThemeWidget />
          

          {/* Button to toggle between feeds */}
          <Box mt="2rem">
            <Button
              variant={selectedFeed === "globalFeed" ? "contained" : "outlined"}
              onClick={() => setSelectedFeed("globalFeed")}
            >
              Global Feed
            </Button>
            <Button
              variant={selectedFeed === "themeFeed" ? "contained" : "outlined"}
              onClick={() => setSelectedFeed("themeFeed")}
              sx={{ marginLeft: "1rem" }}
            >
              Theme Feed
            </Button>
          </Box>

          {/* Render the selected feed */}
          <Box mt="2rem">
            {selectedFeed === "globalFeed" ? (
              <FeedWidget /> // All posts
            ) : (
              <PostsWidget /> // Posts based on themes
            )}
          </Box>
        </Box>

        {/* Right Sidebar */}
        {isNonMobileScreens && (
          <Box flexBasis="26%">
            <AdvertWidget />
            
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default UserHomePage;
