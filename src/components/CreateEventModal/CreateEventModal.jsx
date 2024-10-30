import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import {
  Autocomplete,
  Box,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
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
import {
  getTimeZone,
  renderGCalDescription,
  getSQLDate,
} from "../../utils/calendar";
import { addDays, format } from "date-fns";
import { Delete } from "@mui/icons-material";

const defaultEvent = {
  plan: null,
  date: null,
};

export const CreateEventModal = ({
  open,
  handleClose,
  onSuccess,
  athleteId,
}) => {
  const [athletes, setAthletes] = useState([]);
  const [plans, setPlans] = useState([]);
  const [events, setEvents] = useState([defaultEvent]);
  const [eventCount, setEventCount] = useState(0);

  const [selectedAthlete, setSelectedAthlete] = useState(null);

  const [loading, setLoading] = useState(false);

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

    const isInvalid = events.some((e) => !e.date || !e.plan);

    if (isInvalid) {
      setLoading(false);
      return alert("Please fill all fields for all the events");
    }

    const gcal_id = selectedAthlete.calendars[0].gcal_id;

    const events_payload = events.map((e) => {
      const start = format(e.date, "yyyy-MM-dd");
      const end = format(addDays(e.date, 1), "yyyy-MM-dd");
      const sb_start = getSQLDate(e.date);

      const gcal_event = {
        summary: `C+ ${getAthleteName(selectedAthlete)} - ${e.plan.name}`,
        description: renderGCalDescription(
          e.plan,
          selectedAthlete.email,
          e.plan.id
        ),
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

      const sb_event = {
        date: sb_start,
        calendar_id: selectedAthlete.calendars[0].id,
        gcal_id,
        payload: gcal_event,
        coach_id: user.id,
        athlete_id: selectedAthlete.id,
        plan_id: e.plan.id,
      };

      return { gcal_event, sb_event };
    });

    // map create events for both google and supabase
    await Promise.all(
      events_payload.map(async (e) => {
        const gcal_event = await createEvent(gcal_id, e.gcal_event);
        await insertEvent(supabase, { ...e.sb_event, payload: gcal_event });
        setEventCount(eventCount + 1);
      })
    ).catch((err) => {
      alert("Error creating events");
      setLoading(false);
    });

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
            {/* Single Event */}
            {events.map((e, i) => (
              <React.Fragment key={i}>
                <Box sx={{ mb: 1, display: "flex", alignItems: "center" }}>
                  <Typography variant="subtitle">Event {i + 1}</Typography>
                  {i > 0 && (
                    <IconButton
                      onClick={() =>
                        setEvents(events.filter((_, j) => j !== i))
                      }
                      size="small"
                      sx={{ ml: 2 }}
                    >
                      <Delete />
                    </IconButton>
                  )}
                </Box>
                <Box mb={1}>
                  <MobileDatePicker
                    label="Event Date"
                    sx={{
                      width: "100%",
                    }}
                    value={e.date}
                    onChange={(date) => {
                      setEvents(
                        events.map((ev, idx) => {
                          if (idx === i) {
                            return {
                              ...ev,
                              date,
                            };
                          }
                          return ev;
                        })
                      );
                    }}
                  />
                </Box>

                <Box mb={3}>
                  <Autocomplete
                    options={plans}
                    sx={{
                      width: "100%",
                    }}
                    renderInput={(params) => (
                      <TextField {...params} label="Select Program" />
                    )}
                    onChange={(e, v) => {
                      setEvents(
                        events.map((ev, idx) => {
                          if (idx === i) {
                            return {
                              ...ev,
                              plan: v,
                            };
                          }
                          return ev;
                        })
                      );
                    }}
                    getOptionLabel={(option) => option.name}
                    getOptionKey={(option) => option.id}
                  />
                </Box>
              </React.Fragment>
            ))}
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
            - Once the calendar is created, you should be able to create events
            for them.
            <br />
          </DialogContentText>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => setEvents([...events, defaultEvent])}
          sx={{ mr: "auto" }}
          color="info"
        >
          Add Event
        </Button>
        <Button onClick={handleClose}>Close</Button>
        <Button onClick={handleSubmit} disabled={loading} color="success">
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};
