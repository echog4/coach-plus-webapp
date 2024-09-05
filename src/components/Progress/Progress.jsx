import { Box, CircularProgress } from "@mui/material";

export const Progress = ({ height = 300 }) => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: height,
    }}
  >
    <CircularProgress />
  </Box>
);
