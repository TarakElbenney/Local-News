import React, { useEffect, useState } from "react"; 
import { useDispatch, useSelector } from "react-redux";
import { setThemes } from "state"; 
import { Box, Typography, Button } from "@mui/material";
import WidgetWrapper from "components/WidgetWrapper";

const ThemeWidget = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const [themes, setThemesList] = useState([]);
  const [selectedThemes, setSelectedThemes] = useState([]);

  useEffect(() => {
    const getThemes = async () => {
      try {
        const response = await fetch("http://localhost:3001/themes", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch themes");
        }

        const data = await response.json();
        setThemesList(data); 
        dispatch(setThemes({ themes: data })); 
      } catch (error) {
        console.error("Error fetching themes:", error);
      }
    };

    getThemes();
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
            key={theme._id}
            onClick={() => handleThemeClick(theme._id)} // Updated onClick
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
      <Button
        variant="contained"
        color="primary"
        onClick={applyThemes} // Apply themes on button click
        sx={{ mt: "1.5rem", padding: "0.5rem 1.5rem", fontSize: "0.875rem" }}
      >
        Apply Themes
      </Button>
    </WidgetWrapper>
  );
};

export default ThemeWidget;
