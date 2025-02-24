import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setThemes } from "state";
import { Box, Typography, Button, Divider } from "@mui/material";
import WidgetWrapper from "components/WidgetWrapper";

const ThemeWidget = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const [themes, setThemesList] = useState([]); // All available themes
  const [selectedThemes, setSelectedThemes] = useState([]); // User's chosen themes

  useEffect(() => {
    const fetchThemes = async () => {
      try {
        // Fetch all themes
        const themesResponse = await fetch("http://localhost:3001/themes", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
  
        // Fetch user's selected themes
        const userThemesResponse = await fetch("http://localhost:3001/users/get-themes", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
  
        if (!themesResponse.ok || !userThemesResponse.ok) {
          throw new Error("Failed to fetch themes");
        }
  
        
        const userThemesData = await userThemesResponse.json();
        const userSelectedThemes = userThemesData.themes.map(theme => theme._id);
        const allThemes = await themesResponse.json();
        
  
        setThemesList(allThemes);
        setSelectedThemes(userSelectedThemes); // Load user's selected themes
        dispatch(setThemes({ themes: allThemes }));
      } catch (error) {
        console.error("Error fetching themes:", error);
      }
    };
  
    fetchThemes();
  }, [dispatch, token]);

  const handleThemeClick = (themeId) => {
    setSelectedThemes((prevSelectedThemes) => {
      if (prevSelectedThemes.includes(themeId)) {
        return prevSelectedThemes.filter((id) => id !== themeId); // Remove theme
      } else {
        return [...prevSelectedThemes, themeId]; // Add theme
      }
    });
  };

  const applyThemes = async () => {
    try {
      const response = await fetch("http://localhost:3001/users/update-themes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ themes: selectedThemes }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || response.statusText);
      }

      console.log("Themes applied successfully:", data);
    } catch (error) {
      console.error("Error applying themes:", error);
    }
  };

  return (
    <WidgetWrapper m="2rem 0" sx={{ textAlign: "center" }}>
      <Typography variant="h6" gutterBottom>
        Choose Your Favorite Themes
      </Typography>

      {/* Selected Themes Section */}
      {selectedThemes.length > 0 && (
        <>
          <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
            Your Selected Themes:
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.5rem",
              justifyContent: "center",
              p: 1,
            }}
          >
            {themes
              .filter((theme) => selectedThemes.includes(theme._id))
              .map((theme) => (
                <Box
                  key={theme._id}
                  onClick={() => handleThemeClick(theme._id)}
                  sx={{
                    padding: "0.5rem 1rem",
                    borderRadius: "1rem",
                    textAlign: "center",
                    fontSize: "0.875rem",
                    fontWeight: "bold",
                    cursor: "pointer",
                    backgroundColor: "primary.main",
                    color: "white",
                    transition: "background-color 0.3s, color 0.3s",
                    "&:hover": { backgroundColor: "primary.dark" },
                  }}
                >
                  {theme.name} ✖
                </Box>
              ))}
          </Box>
          <Divider sx={{ my: 2 }} />
        </>
      )}

      {/* Available Themes Section */}
      <Typography variant="subtitle1" sx={{ mb: 1 }}>
        Available Themes:
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",
          gap: "0.5rem",
        }}
      >
        {themes
          .filter((theme) => !selectedThemes.includes(theme._id)) // Show only unselected themes
          .map((theme) => (
            <Box
              key={theme._id}
              onClick={() => handleThemeClick(theme._id)}
              sx={{
                padding: "0.5rem",
                borderRadius: "0.5rem",
                textAlign: "center",
                fontSize: "0.875rem",
                fontWeight: "bold",
                cursor: "pointer",
                backgroundColor: "grey.200",
                color: "text.primary",
                transition: "background-color 0.3s, color 0.3s",
                "&:hover": { backgroundColor: "grey.300" },
              }}
            >
              {theme.name} ➕
            </Box>
          ))}
      </Box>

      {/* Apply Button */}
      <Button
        variant="contained"
        color="primary"
        onClick={applyThemes}
        sx={{ mt: "1.5rem", padding: "0.5rem 1.5rem", fontSize: "0.875rem" }}
      >
        Apply Themes
      </Button>
    </WidgetWrapper>
  );
};

export default ThemeWidget;
