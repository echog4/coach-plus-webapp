import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Autocomplete, Box, TextField, Typography } from "@mui/material";
import { useAuth, useSupabase } from "../../providers/AuthContextProvider";
import { useEffect, useState } from "react";
import {
  getAthleteByEmail,
  getCoachAthlete,
  getOnboardingFormsByUserId,
  insertAthlete,
  insertCoachAthlete,
  insertOnboardingFormResponse,
} from "../../services/query";

export default function AthleteInviteModal({ open, handleClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [forms, setForms] = useState([]);
  const [email, setEmail] = useState("");
  const [selectedForm, setSelectedForm] = useState(null);

  const supabase = useSupabase();
  const { user } = useAuth();

  const handleInvite = async () => {
    setLoading(true);
    if (!email || !email.endsWith("@gmail.com")) {
      return alert("Please enter a Gmail address");
    }
    if (!selectedForm) {
      return alert("Please select an onboarding form");
    }

    let athlete = {
      status: "PENDING",
      email,
    };

    const { data: existingAthlete, error: _athleteError } =
      await getAthleteByEmail(supabase, email);

    if (existingAthlete.length > 0) {
      athlete = existingAthlete[0];
    } else {
      const { data: newAthlete } = await insertAthlete(supabase, [athlete]);
      if (newAthlete) {
        athlete = newAthlete[0];
      }
    }

    console.log({ athlete, _athleteError });

    // create "onboarding_form_response"
    const { data: newResponse, error: newResponseError } =
      await insertOnboardingFormResponse(supabase, [
        {
          athlete_id: athlete.id,
          coach_id: user.id,
          form_id: selectedForm.id,
          status: "sent",
        },
      ]);

    console.log({ newResponse, newResponseError });

    // find coach_athlete
    const { data: coachAthlete, error: coachAthleteError } =
      await getCoachAthlete(supabase, user.id, athlete.id);

    console.log({ coachAthlete, coachAthleteError });

    if (coachAthlete.length === 0) {
      const { data: newCoachAthlete, error: newCoachAthleteError } =
        await insertCoachAthlete(supabase, [
          {
            coach_id: user.id,
            athlete_id: athlete.id,
          },
        ]);
      console.log({ newCoachAthlete, newCoachAthleteError });
    }

    setLoading(false);
    onSuccess();
    handleClose();
    // create coach_athletes
  };

  useEffect(() => {
    if (!user) {
      return;
    }

    const getForms = async () => {
      const { data: _forms } = await getOnboardingFormsByUserId(
        supabase,
        user.id
      );

      setForms(_forms || []);
    };

    getForms();
  }, [user, open, supabase]);
  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" mb={0}>
          <Typography variant="subtitle">Invite your client</Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          Select an onboarding form, enter your clients gmail address and Invite
          them to join you in Coach+.
        </DialogContentText>
        <Box mb={3} mt={3}>
          <TextField
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            label="Gmail address"
            type="email"
            fullWidth
          />
        </Box>
        <Box mb={3}>
          <Autocomplete
            disablePortal
            options={forms}
            sx={{
              width: "100%",
            }}
            renderInput={(params) => (
              <TextField {...params} label="Onboarding Form" />
            )}
            onChange={(e, v) => setSelectedForm(v)}
            getOptionLabel={(option) => `${option.icon} ${option.title}`}
            getOptionKey={(option) => option.id}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
        <Button onClick={handleInvite} disabled={loading}>
          Invite
        </Button>
      </DialogActions>
    </Dialog>
  );
}