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

import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import enUS from "date-fns/locale/en-US";
import { Progress } from "../Progress/Progress";
import { AlarmAdd, CalendarMonth } from "@mui/icons-material";
import { startOfMonth } from "date-fns";
import { useState } from "react";

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

export const CalendarComponent = ({
  defaultView,
  height,
  title,
  toggles,
  views,
  events,
  calendars,
  onNewEventClick,
  onEventSelect,
  onReloadRequest,
  onEventDelete,
  onCalendarToggle,
}) => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  console.log({ events });
  return (
    <>
      {!!selectedEvent && (
        <EventModal
          event={selectedEvent}
          open={!!selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onDelete={(calId, evId) => {
            if (window.confirm("Are you sure you want to delete this event?")) {
              setSelectedEvent(null);
              onEventDelete(calId, evId);
            }
          }}
        />
      )}
      <Paper variant="outlined" mb={3}>
        <Box p={2} pb={0} display="flex" alignItems="center">
          <CalendarMonth style={{ marginRight: 12 }} />
          <Typography variant="subtitle" fontWeight="900">
            {title}
          </Typography>
          <Button
            startIcon={<AlarmAdd />}
            size="small"
            sx={{ marginLeft: "auto" }}
            onClick={onNewEventClick}
          >
            New Event
          </Button>
        </Box>
        {toggles && (
          <Box px={2} pt={2}>
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
                  onCalendarToggle(cal.calendarId);
                }}
              />
            ))}
          </Box>
        )}
        <Box sx={{ px: 1, py: 2, fontSize: 11 }}>
          {calendars.length > 0 ? (
            <Calendar
              localizer={localizer}
              events={events || []}
              startAccessor="start"
              endAccessor="end"
              defaultView={defaultView}
              style={{ height: height || 340 }}
              popup
              defaultDate={startOfMonth(new Date())}
              onSelectEvent={(event) => setSelectedEvent(event)}
              eventPropGetter={(event) => ({
                style: {
                  backgroundColor: event.backgroundColor,
                  color: event.foregroundColor,
                  cursor: "pointer",
                  fontWeight: 500,
                },
              })}
              formats={{
                agendaHeaderFormat: (date) =>
                  date.start.toLocaleString("default", {
                    month: "short",
                    day: "numeric",
                  }) +
                  "  -  " +
                  date.end.toLocaleString("default", {
                    month: "short",
                    day: "numeric",
                  }),
              }}
              allDayAccessor={(event) => event.allDay}
              views={views || ["month", "week", "day", "agenda"]}
            />
          ) : (
            <Progress />
          )}
        </Box>
      </Paper>
    </>
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
