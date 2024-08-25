import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { PageContainer } from "../../components/PageContainer/PageContainer";
import {
  Avatar,
  Box,
  Button,
  Fab,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import { Add, Delete, Edit, List } from "@mui/icons-material";
import ResponsesModal from "../../components/ResponsesModal/ResponsesModal";
import { useState } from "react";
import OnboardingFormModal from "../../components/OnboardingFormModal/OnboardingFormModal";

const forms = [
  {
    id: 1,
    icon: "🏊",
    title: "Swimming Training",
    sentTo: 4,
    responded: 2,
  },
  {
    id: 2,
    icon: "👵🏻",
    title: "Old people training",
    sentTo: 9,
    responded: 3,
  },
  {
    id: 3,
    icon: "🏋🏻",
    title: "Weight Training",
    sentTo: 8,
    responded: 4,
  },
  {
    id: 4,
    icon: "🏊",
    title: "Swimming Training",
    sentTo: 4,
    responded: 2,
  },
];

export const OnboardingFormsRoute = () => {
  const [responsesOpen, setResponseOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(true);

  return (
    <>
      <PageContainer>
        <Grid2 container spacing={2} sx={{ pb: 10 }}>
          {forms.map((form) => (
            <Grid2 item xs={12} md={6} key={form.id}>
              <Paper>
                <Box p={2}>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Avatar
                      sx={{
                        backgroundColor: "green.light",
                        fontSize: 24,
                        mr: 2,
                      }}
                    >
                      {form.icon}
                    </Avatar>
                    <Typography variant="subtitle2">{form.title}</Typography>
                  </Box>
                  <Box display="flex" alignItems="center" mb={2}>
                    <span>
                      <strong>Sent to:</strong> {form.sentTo}
                    </span>
                    <span style={{ marginLeft: 12 }}>
                      <strong>Responded:</strong> {form.responded}
                    </span>
                  </Box>
                  <Box display="flex">
                    <Button
                      color="primary"
                      size="small"
                      startIcon={<Edit />}
                      onClick={() => setFormOpen(true)}
                    >
                      Edit
                    </Button>
                    <Button
                      color="primary"
                      size="small"
                      startIcon={<List />}
                      onClick={() => setResponseOpen(true)}
                    >
                      Responses
                    </Button>
                    <IconButton sx={{ ml: "auto" }} color="pink">
                      <Delete />
                    </IconButton>
                  </Box>
                </Box>
              </Paper>
            </Grid2>
          ))}
        </Grid2>
      </PageContainer>
      <Fab
        variant="extended"
        sx={{ position: "fixed", bottom: 32, right: 32 }}
        color="info"
        onClick={() => setFormOpen(true)}
      >
        <Add sx={{ mr: 1 }} />
        Create New Form
      </Fab>
      <ResponsesModal
        open={responsesOpen}
        handleClose={() => setResponseOpen(false)}
      />
      <OnboardingFormModal
        open={formOpen}
        handleClose={() => setFormOpen(false)}
      />
    </>
  );
};
