import { Box, Toolbar } from "@mui/material";

export const PageContainer = ({ children, ...props }) => (
  <Box
    {...props}
    minHeight="100%"
    sx={{
      p: {
        xs: 1,
        sm: 2,
        md: 3,
        lg: 4,
      },
      py: {
        xs: 3,
        sm: 3,
        md: 4,
        lg: 4,
      },
    }}
  >
    <Toolbar />
    {children}
  </Box>
);
