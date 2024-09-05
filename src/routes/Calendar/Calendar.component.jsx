import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Typography,
} from "@mui/material";
import { PageContainer } from "../../components/PageContainer/PageContainer";
import { useCalendar } from "../../providers/CalendarProvider";
import { useEffect, useState } from "react";
import { useAuth } from "../../providers/AuthContextProvider";

import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import enUS from "date-fns/locale/en-US";
import { Progress } from "../../components/Progress/Progress";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export const CalendarComponent = () => {
  const {
    createEvent,
    getCalendars,
    toggleCalendar,
    getSelectedEvents,
    deleteEvent,
    calendars,
  } = useCalendar();
  const { refreshGoogleToken } = useAuth();
  const [selectedEvent, setSelectedEvent] = useState(null);

  const reloadCalendar = (soft) => {
    getCalendars();
  };

  useEffect(() => {
    setTimeout(() => {
      reloadCalendar();
    }, 1000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PageContainer>
      {!!selectedEvent && (
        <EventModal
          event={selectedEvent}
          open={!!selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onDelete={async (calId, evId) => {
            if (window.confirm("Are you sure you want to delete this event?")) {
              setSelectedEvent(null);
              await deleteEvent(calId, evId);
              getCalendars();
            }
          }}
        />
      )}
      <Paper elevation={2} sx={{ px: 1, py: 1, fontSize: 11 }}>
        <Box pb={2}>
          {calendars.map((cal) => (
            <Chip
              key={cal.calendarId}
              size="small"
              label={cal.title.replace("@gmail.com", "")}
              variant={cal.hidden ? "outlined" : "filled"}
              sx={{
                backgroundColor: cal.hidden ? "transparent" : cal.color,
                color: cal.hidden ? cal.color : cal.textColor,
                margin: 0.5,
              }}
              onClick={() => {
                toggleCalendar(cal.calendarId);
              }}
            />
          ))}
        </Box>
        {calendars.length > 0 ? (
          <Calendar
            localizer={localizer}
            events={getSelectedEvents() || []}
            startAccessor="start"
            endAccessor="end"
            style={{ height: "calc(100vh - 200px)" }}
            popup
            onSelectEvent={(event) => setSelectedEvent(event)}
            eventPropGetter={(event) => ({
              style: {
                backgroundColor: event.backgroundColor,
                color: event.foregroundColor,
              },
            })}
          />
        ) : (
          <Progress />
        )}
      </Paper>
      <Button onClick={refreshGoogleToken}>Refresh</Button>
      <Button
        onClick={async () => {
          await createEvent("primary", {
            summary: "Coach+ Training",
            description: `<ul>
<li>3 set of 10 pushups</li><li>3 set of 30 jumping jacks</li>
</ul>`,
            start: {
              dateTime: "2024-09-02T12:00:00+03:00",
              timeZone: "America/Los_Angeles",
            },
            end: {
              dateTime: "2024-09-02T14:00:00+03:00",
              timeZone: "America/Los_Angeles",
            },
            reminders: {
              useDefault: false,
              overrides: [
                { method: "email", minutes: 24 * 60 },
                { method: "popup", minutes: 10 },
              ],
            },
          });
          reloadCalendar();
        }}
      >
        Create Event
      </Button>
    </PageContainer>
  );
};

const EventModal = ({ event, onClose, open, onDelete }) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>{event.title}</DialogTitle>
      <DialogContent>
        <Typography variant="subtitle2">Training Program: </Typography>

        <div dangerouslySetInnerHTML={{ __html: event.resource.description }} />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => onDelete(event.calendarId, event.resource.id)}
          color="error"
        >
          Delete Event
        </Button>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};
