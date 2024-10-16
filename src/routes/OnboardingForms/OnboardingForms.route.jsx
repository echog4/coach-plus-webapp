import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { PageContainer } from "../../components/PageContainer/PageContainer";
import {
  Avatar,
  Box,
  Button,
  IconButton,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { Add, Delete, Edit } from "@mui/icons-material";
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
  const [search, setSearch] = useState("");

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
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography variant="h5">Onboarding Forms</Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            size="small"
            sx={{ marginLeft: "auto" }}
            onClick={() => setFormOpen(true)}
          >
            Add New From
          </Button>
        </Box>
        <TextField
          label="Search forms by name..."
          variant="standard"
          fullWidth
          sx={{
            maxWidth: {
              xs: "100%",
              sm: 300,
            },
            mb: 3,
          }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Grid2 container spacing={2} sx={{ pb: 10 }}>
          {forms
            .filter((form) =>
              form.title.toLowerCase().includes(search.toLowerCase())
            )
            .map((form) => (
              <Grid2 xs={12} sm={4} key={form.id}>
                <Paper variant="outlined">
                  <Box p={2}>
                    <Box display="flex" alignItems="center" mb={2}>
                      <Avatar
                        sx={{
                          backgroundColor: "success.light",
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
                      <IconButton
                        sx={{ ml: "auto" }}
                        color="pink"
                        onClick={() => {
                          if (
                            window.confirm(
                              `Deleting onboarding form "${form.title}". Please confirm.`
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
