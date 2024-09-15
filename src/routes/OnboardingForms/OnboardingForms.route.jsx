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
import { useEffect, useState } from "react";
import OnboardingFormModal from "../../components/OnboardingFormModal/OnboardingFormModal";
import { useAuth, useSupabase } from "../../providers/AuthContextProvider";
import {
  deleteOnboardingForm,
  getOnboardingFormsByUserId,
} from "../../services/query";

export const OnboardingFormsRoute = () => {
  const [forms, setForms] = useState([]);
  const [responsesOpen, setResponseOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const supabase = useSupabase();
  const { user } = useAuth();

  const getForms = async () => {
    const { data: _forms } = await getOnboardingFormsByUserId(
      supabase,
      user.id
    );

    setForms(_forms || []);
  };

  useEffect(() => {
    if (!user) {
      return;
    }

    getForms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <>
      <PageContainer>
        <Grid2 container spacing={2} sx={{ pb: 10 }}>
          {forms.map((form) => (
            <Grid2 xs={12} md={6} key={form.id}>
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
                      <strong>Sent to:</strong>{" "}
                      {form.onboarding_form_response.length}
                    </span>
                    <span style={{ marginLeft: 12 }}>
                      <strong>Completed:</strong>{" "}
                      {
                        form.onboarding_form_response.filter(
                          (r) => r.status === "completed"
                        ).length
                      }
                    </span>
                  </Box>
                  <Box display="flex">
                    <Button
                      color="primary"
                      size="small"
                      startIcon={<Edit />}
                      onClick={() => setFormOpen(form)}
                    >
                      Edit
                    </Button>
                    <Button
                      color="primary"
                      size="small"
                      startIcon={<List />}
                      onClick={() => setResponseOpen(form)}
                    >
                      Responses
                    </Button>
                    <IconButton
                      sx={{ ml: "auto" }}
                      color="pink"
                      onClick={() => {
                        if (
                          window.confirm(
                            "Are you sure you want to delete this form?"
                          )
                        ) {
                          deleteOnboardingForm(supabase, form.id)
                            .then(() => {
                              getForms();
                            })
                            .catch((error) => {
                              console.error(error);
                            });
                        }
                      }}
                    >
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
        open={!!responsesOpen}
        formData={responsesOpen}
        handleClose={() => setResponseOpen(false)}
      />
      <OnboardingFormModal
        open={!!formOpen}
        handleClose={() => setFormOpen(false)}
        formData={formOpen === true ? {} : formOpen}
        onSuccess={(form) => {
          setFormOpen(false);
          getForms();
        }}
      />
    </>
  );
};
