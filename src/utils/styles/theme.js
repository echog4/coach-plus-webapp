import { createTheme } from "@mui/material";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#222",
    },
    error: {
      main: "#f73e34",
      light: "#ffcfcb",
    },
    warning: {
      main: "#fa9b2a",
      light: "#ffe4c9",
    },
    yellow: {
      main: "#f7d154",
      light: "#f9c712",
    },
    success: {
      main: "#19c558",
      light: "#d1f2d8",
    },
    info: {
      main: "#2f80ed",
      light: "#51a6ec",
    },
    purple: {
      main: "#5856d0",
      light: "#d0d0f5",
    },
    pink: {
      main: "#f73e34",
      light: "#ffcfcb",
    },
  },
});

export const getReadableTextColor = (hexColor) => {
  // Convert hex to RGB
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);

  // Calculate relative luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  // Return black for light backgrounds, white for dark backgrounds
  return luminance > 0.5 ? "#000000" : "#FFFFFF";
};
