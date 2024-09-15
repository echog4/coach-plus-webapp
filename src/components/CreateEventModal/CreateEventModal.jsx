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
import {
  getAthletesByCoachId,
  getPlansByCoachId,
  insertEvent,
} from "../../services/query";
import { useCalendar } from "../../providers/CalendarProvider";
import { getTimeZone, renderGCalDescription } from "../../utils/calendar";
import { addDays, format } from "date-fns";

export const CreateEventModal = ({
  open,
  handleClose,
  onSuccess,
  athleteId,
}) => {
  const [loading, setLoading] = useState(false);
  const [eventDate, setEventDate] = useState(null);

  const [athletes, setAthletes] = useState([]);
  const [selectedAthlete, setSelectedAthlete] = useState(null);

  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const supabase = useSupabase();
  const { user } = useAuth();
  const { createEvent } = useCalendar();

  useEffect(() => {
    if (!user) {
      return;
    }

    getAthletesByCoachId(supabase, user.id).then((res) => {
      const athletes = res.data
        .map((a) => a.athletes)
        .filter((a) => a.calendars.length > 0);
      const athlete = athletes.find((a) => a.id === parseInt(athleteId));

      setSelectedAthlete(athlete || null);
      setAthletes(athletes);
    });

    getPlansByCoachId(supabase, user.id).then((res) => {
      setPlans(res.data);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleSubmit = async () => {
    setLoading(true);

    if (!selectedAthlete || !eventDate || !selectedPlan) {
      setLoading(false);
      return alert("Please fill all fields");
    }

    const gcal_id = selectedAthlete.calendars[0].gcal_id;

    const start = format(eventDate, "yyyy-MM-dd");
    const end = format(addDays(eventDate, 1), "yyyy-MM-dd");

    // Create google calendar event
    const gcal_payload = {
      summary: `C+ ${getAthleteName(selectedAthlete)} - ${selectedPlan.name}`,
      description: renderGCalDescription(selectedPlan),
      start: {
        date: start,
        timeZone: getTimeZone(),
      },
      end: {
        date: end,
        timeZone: getTimeZone(),
      },
      attendees: [
        {
          email: selectedAthlete.email,
          displayName: getAthleteName(selectedAthlete),
        },
      ],
      reminders: {
        useDefault: true,
      },
    };
    const gcal_event = await createEvent(gcal_id, gcal_payload);
    // Create supabase event
    const sb_event = {
      date: eventDate,
      calendar_id: selectedAthlete.calendars[0].id,
      gcal_id,
      payload: gcal_event,
      coach_id: user.id,
      athlete_id: selectedAthlete.id,
      plan_id: selectedPlan.id,
    };
    await insertEvent(supabase, sb_event);

    setLoading(false);
    onSuccess && onSuccess();
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center">
          <Typography variant="subtitle">Create New Event</Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        {athletes.length > 0 ? (
          <>
            <Box mb={3} pt={2}>
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
                getOptionLabel={(option) => `${getAthleteName(option)}`}
                getOptionKey={(option) => option.id}
                defaultValue={selectedAthlete}
                value={selectedAthlete}
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
                options={plans}
                sx={{
                  width: "100%",
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Select Program" />
                )}
                onChange={(e, v) => setSelectedPlan(v)}
                getOptionLabel={(option) => option.name}
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
        <Button onClick={handleSubmit} disabled={loading} color="success">
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};
