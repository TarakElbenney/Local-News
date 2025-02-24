export const colorTokens = {
  grey: {
    0: "#FFFFFF",  // Pure white
    10: "#F9F9F9",  
    50: "#F0F0F0",  
    100: "#D1D1D1",  
    200: "#A0A0A0",  
    300: "#707070",  
    400: "#505050",  
    500: "#333333",  
    600: "#1F1F1F",  
    700: "#141414",  
    800: "#0D0D0D",  
    900: "#000000",  
  },
  primary: {
    50: "#E6F9E6",  // Light green tint
    100: "#B3E6B3",  
    200: "#80D180",  
    300: "#4DBB4D",  
    400: "#33A133",  
    500: "#008C00",  // Main green color
    600: "#007300",  
    700: "#005F00",  
    800: "#004700",  
    900: "#002F00",  
  },
  secondary: {
    50: "#F0FFF0",  // Very light green-white tint
    100: "#DFFFDF",  
    200: "#BFFFBF",  
    300: "#9FFF9F",  
    400: "#7FFF7F",  
    500: "#5FFF5F",  // Secondary green variant
    600: "#3FFF3F",  
    700: "#1FFF1F",  
    800: "#00E600",  
    900: "#00C700",  
  },
};
export const themeSettings = (mode) => {
  return {
    palette: {
      mode: mode,
      ...(mode === "dark"
        ? {
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
              default: colorTokens.grey[900], // Dark green contrast
              alt: colorTokens.grey[800],
            },
          }
        : {
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
              default: colorTokens.grey[0],  // White background for contrast
              alt: colorTokens.grey[10],
            },
          }),
    },
    typography: {
      fontFamily: ["Rubik", "sans-serif"].join(","),
      fontSize: 12,
      h1: { fontFamily: ["Rubik", "sans-serif"].join(","), fontSize: 40 },
      h2: { fontFamily: ["Rubik", "sans-serif"].join(","), fontSize: 32 },
      h3: { fontFamily: ["Rubik", "sans-serif"].join(","), fontSize: 24 },
      h4: { fontFamily: ["Rubik", "sans-serif"].join(","), fontSize: 20 },
      h5: { fontFamily: ["Rubik", "sans-serif"].join(","), fontSize: 16 },
      h6: { fontFamily: ["Rubik", "sans-serif"].join(","), fontSize: 14 },
    },
  };
};
