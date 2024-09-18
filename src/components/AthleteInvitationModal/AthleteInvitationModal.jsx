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
import { trimAndValidatePhone } from "../../utils/validations";

export default function AthleteInviteModal({ open, handleClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [forms, setForms] = useState([]);
  const [email, setEmail] = useState("");
  const [areaCode, setAreaCode] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedForm, setSelectedForm] = useState(null);

  const supabase = useSupabase();
  const { user } = useAuth();

  const handleInvite = async () => {
    setLoading(true);
    if (!email || !email.match(/^[^@]+@[^@]+\.[^@]+$/)) {
      setLoading(false);
      return alert("Please enter a valid Gmail address");
    }
    if (!selectedForm) {
      setLoading(false);
      return alert("Please select an onboarding form");
    }

    const phone_number = `${areaCode}${phone}`;
    console.log({ phone_number });
    if (trimAndValidatePhone(phone_number) === false) {
      setLoading(false);
      return alert(
        "Please enter a valid phone number consisting of digits only"
      );
    }

    let athlete = {
      status: "PENDING",
      email,
      phone_number,
    };

    const { data: existingAthlete, error: _athleteError } =
      await getAthleteByEmail(supabase, email);

    if (existingAthlete.length > 0) {
      setLoading(false);
      return alert(
        "An athlete with this email already exists in the system for you or another coach."
      );
    } else {
      const { data: newAthlete, error: nae } = await insertAthlete(
        supabase,
        athlete
      );
      if (nae) {
        setLoading(false);
        return alert(
          "An athlete with this phone number already exists in the system for you or another coach."
        );
      }
      console.log({ newAthlete });
      if (newAthlete) {
        athlete = newAthlete[0];
      }
    }

    console.log({ athlete, _athleteError });

    // create "onboarding_form_response"
    const { data: newResponse, error: newResponseError } =
      await insertOnboardingFormResponse(supabase, {
        athlete_id: athlete.id,
        coach_id: user.id,
        form_id: selectedForm.id,
        status: "sent",
      });

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

    // send welcome message
    console.log({
      phone: phone_number,
      onboarding_url: `https://app.coachplus.club/onboarding-form/${newResponse[0].id}`,
      coach_name: user.full_name,
    });
    await supabase.functions.invoke("welcome-wp", {
      body: {
        phone: phone_number,
        onboarding_url: `https://app.coachplus.club/onboarding-form/${newResponse[0].id}`,
        coach_name: user.full_name,
      },
    });

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
        <Box sx={{ mb: 3 }} display="flex" alignItems="center">
          <Typography sx={{ mr: 1 }}>+</Typography>
          <TextField
            value={areaCode}
            onChange={(e) => setAreaCode(e.target.value)}
            label="Country Code"
            name="country_code"
            type="number"
            fullWidth
            sx={{ mr: 1, width: 120 }}
          />
          <TextField
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            label="Phone Number"
            name="phone"
            type="number"
            fullWidth
          />
        </Box>
        <Box mb={3}>
          <Autocomplete
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
