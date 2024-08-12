import { Box, Toolbar } from "@mui/material";

export const PageContainer = ({ children, ...props }) => (
  <Box {...props} p={3} minHeight="100%">
    <Toolbar />
    {children}
  </Box>
);
