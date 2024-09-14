import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Autocomplete, Box, TextField, Typography } from "@mui/material";
import { useAuth, useSupabase } from "../../providers/AuthContextProvider";
import { useEffect, useState } from "react";
import { getAthleteName } from "../../utils/selectors";
import { MobileDatePicker } from "@mui/x-date-pickers";

export const CreateEventModal = ({
  open,
  handleClose,
  onSuccess,
  athletes,
  athleteId,
}) => {
  const [loading, setLoading] = useState(false);
  const [selectedAthlete, setSelectedAthlete] = useState(
    athleteId ? athletes.find((a) => a.id === athleteId) : null
  );
  const [eventDate, setEventDate] = useState(null);

  const supabase = useSupabase();
  const { user } = useAuth();

  const handleSubmit = async () => {
    setLoading(true);

    setLoading(false);
    onSuccess && onSuccess();
    handleClose();
  };

  useEffect(() => {
    if (!user) {
      return;
    }
  }, [user, open, supabase]);
  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" mb={0}>
          <Typography variant="subtitle">Create New Event</Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        {athletes.length > 0 ? (
          <>
            <Box mb={3}>
              <Autocomplete
                disablePortal
                options={athletes}
                sx={{
                  width: "100%",
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Athlete" />
                )}
                onChange={(e, v) => setSelectedAthlete(v)}
                getOptionLabel={(option) =>
                  `${option.id} - ${getAthleteName(option)}`
                }
                getOptionKey={(option) => option.id}
              />
            </Box>
            <Box mb={3}>
              <MobileDatePicker
                label="Event Date"
                sx={{
                  width: "100%",
                }}
                value={eventDate}
                onChange={(date) => setEventDate(date)}
              />
            </Box>

            <Box mb={3}>
              <Autocomplete
                disablePortal
                options={athletes}
                sx={{
                  width: "100%",
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Select Program" />
                )}
                onChange={(e, v) => setSelectedAthlete(v)}
                getOptionLabel={(option) =>
                  `${option.id} - ${getAthleteName(option)}`
                }
                getOptionKey={(option) => option.id}
              />
            </Box>
          </>
        ) : (
          <DialogContentText>
            No athletes with calendars found.
            <br />
            <br />
            - Invite an athlete using the "INVITE" button in your Dashboard.
            <br />
            - Once the athlete completes their onboarding, go to their profile
            and create their calendar.
            <br />
            - Once the calendar is created, youo should be able to create events
            for them.
            <br />
          </DialogContentText>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
        <Button onClick={handleSubmit} disabled={loading}>
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};
