import { Box, Button, Paper, Typography } from "@mui/material";
import { GoogleButtonIcon } from "../../components/icons/GoogleButton";
import { PageContainer } from "../../components/PageContainer/PageContainer";
import { useAuth } from "../../providers/AuthContextProvider";
import { SportsGymnastics } from "@mui/icons-material";

export const LoginRoute = () => {
  const { signIn } = useAuth();

  return (
    <PageContainer>
      <Box px={2} height="100%">
        <Paper
          variant="outlined"
          sx={{
            py: 8,
            px: 4,
            mb: 2,
            maxWidth: 400,
            mx: "auto",
            mt: 6,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            <SportsGymnastics sx={{ height: 48, width: "auto" }} />
            <Typography variant="h4" sx={{ mb: 4 }}>
              Coach+
            </Typography>
            <Typography variant="body1" sx={{ mb: 4, textAlign: "center" }}>
              Sign in with Google and continue to your dashboard.
            </Typography>
            <Button onClick={signIn}>
              <GoogleButtonIcon />
            </Button>
          </Box>
        </Paper>
      </Box>
    </PageContainer>
  );
};
