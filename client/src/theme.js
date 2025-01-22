export const colorTokens = { 
  grey: {
    0: "#FFFFFF",
    10: "#F9F9F9",  // Slightly lighter grey for a fresh background effect
    50: "#F0F0F0",
    100: "#D1D1D1",  // More distinct medium grey
    200: "#A0A0A0",  // Softened darker grey
    300: "#707070",  // Darker grey for subtle emphasis
    400: "#505050",  // Deep grey for clearer contrast
    500: "#333333",  // More refined dark grey for text
    600: "#1F1F1F",  // Darker for depth and focus
    700: "#141414",  // Strong dark tone for strong UI elements
    800: "#0D0D0D",  // Strong emphasis on background elements
    900: "#000000",  // True black for deep contrasts
  },
  primary: {
    50: "#E6F9FF",  // Slightly lighter blue, clean touch
    100: "#B3E6FF",  // Light and airy
    200: "#80D1FF",  // Soft blue with more presence
    300: "#4DBBFF",  // Cool blue
    400: "#33A1D1",  // Muted blue for primary buttons
    500: "#008C9E",  // Stronger primary blue
    600: "#007384",  // Darker shade of primary blue
    700: "#005F68",  // Muted dark blue for accents
    800: "#003F4E",  // Deep blue for emphasis
    900: "#001F2A",  // Dark navy blue, very deep
  },
  secondary: {
    50: "#FFF1D0",  // Light beige-yellow for secondary accents
    100: "#FFE59E",  // Soft yellow for lighter contrasts
    200: "#FFD266",  // Muted yellow for more impactful UI elements
    300: "#FFBF2E",  // Vibrant yellow for notifications or badges
    400: "#FF9900",  // Bold orange-yellow for action buttons
    500: "#FF7300",  // Strong orange for call-to-action buttons
    600: "#E65D00",  // Dark orange for secondary actions
    700: "#B34900",  // Rich orange for deeper tones
    800: "#803500",  // Very dark orange for contrasts
    900: "#4C1A00",  // Deep burnt orange, for emphasis
  },
};

// mui theme settings
export const themeSettings = (mode) => {
  return {
    palette: {
      mode: mode,
      ...(mode === "dark"
        ? {
            // Dark mode color adjustments
            primary: {
              dark: colorTokens.primary[300],
              main: colorTokens.primary[500],
              light: colorTokens.primary[700],
            },
            secondary: {
              dark: colorTokens.secondary[600],
              main: colorTokens.secondary[500],
              light: colorTokens.secondary[300],
            },
            neutral: {
              dark: colorTokens.grey[100],
              main: colorTokens.grey[200],
              mediumMain: colorTokens.grey[300],
              medium: colorTokens.grey[400],
              light: colorTokens.grey[700],
            },
            background: {
              default: colorTokens.grey[900], // Keep this as pure black for dark mode
              alt: colorTokens.grey[800],
            },
          }
        : {
            // Light mode color adjustments
            primary: {
              dark: colorTokens.primary[700],
              main: colorTokens.primary[500],
              light: colorTokens.primary[50],
            },
            secondary: {
              dark: colorTokens.secondary[600],
              main: colorTokens.secondary[500],
              light: colorTokens.secondary[100],
            },
            neutral: {
              dark: colorTokens.grey[700],
              main: colorTokens.grey[500],
              mediumMain: colorTokens.grey[400],
              medium: colorTokens.grey[300],
              light: colorTokens.grey[50],
            },
            background: {
              default: colorTokens.grey[10], // Lighter background for better visibility
              alt: colorTokens.grey[0],
            },
          }),
    },
    typography: {
      fontFamily: ["Rubik", "sans-serif"].join(","),
      fontSize: 12,
      h1: {
        fontFamily: ["Rubik", "sans-serif"].join(","),
        fontSize: 40,
      },
      h2: {
        fontFamily: ["Rubik", "sans-serif"].join(","),
        fontSize: 32,
      },
      h3: {
        fontFamily: ["Rubik", "sans-serif"].join(","),
        fontSize: 24,
      },
      h4: {
        fontFamily: ["Rubik", "sans-serif"].join(","),
        fontSize: 20,
      },
      h5: {
        fontFamily: ["Rubik", "sans-serif"].join(","),
        fontSize: 16,
      },
      h6: {
        fontFamily: ["Rubik", "sans-serif"].join(","),
        fontSize: 14,
      },
    },
  };
};
