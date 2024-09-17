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
import { AlarmAdd, CalendarMonth } from "@mui/icons-material";
import { endOfDay, startOfDay, startOfMonth } from "date-fns";
import { useEffect, useState } from "react";
import { getReadableTextColor } from "../../utils/styles/theme";
import { deleteSBEvent } from "../../services/query";
import { supabase } from "../../services/supabase";
import { useCalendar } from "../../providers/CalendarProvider";

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
  calendars,
  onNewEventClick,
  onEventSelect,
  onReloadRequest,
  onEventDelete = () => null,
  onCalendarToggle,
}) => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const { deleteEvent } = useCalendar();

  const deleteCEvent = async (calId, evId, gc_id) => {
    await deleteEvent(calId, gc_id);
    await deleteSBEvent(supabase, evId);

    onEventDelete(calId, evId);
  };

  useEffect(() => {
    if (!calendars || calendars.length === 0) {
      return;
    }

    const allEvents = calendars
      .filter((cal) => cal.enabled)
      .map((cal) =>
        cal.events.map((e) => ({
          allDay: true,
          resource: e.payload,
          start: startOfDay(e.date),
          end: endOfDay(e.date),
          id: e.id,
          calendarId: cal.payload.calendarId,
          title: e.payload.summary,
          backgroundColor: cal.payload.color,
          foregroundColor: getReadableTextColor(cal.payload.color),
        }))
      )
      .flat();

    setEvents(allEvents);
  }, [calendars]);

  return (
    <>
      {!!selectedEvent && (
        <EventModal
          event={selectedEvent}
          open={!!selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onDelete={(calId, gcalEvId, evId) => {
            if (window.confirm("Are you sure you want to delete this event?")) {
              deleteCEvent(calId, evId, gcalEvId);
              setSelectedEvent(null);
              onEventDelete(calId, evId, gcalEvId);
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
                label={cal?.payload.title?.replace("@gmail.com", "")}
                variant={!cal.enabled ? "outlined" : "filled"}
                sx={{
                  fontWeight: 600,
                  backgroundColor: !cal.enabled
                    ? "transparent"
                    : cal.payload.color,
                  color: !cal.enabled
                    ? cal.payload.color
                    : getReadableTextColor(cal.payload.color),
                  margin: 0.5,
                  "&:hover": {
                    backgroundColor: cal.payload.color,
                    color: cal.enabled
                      ? getReadableTextColor(cal.payload.color)
                      : cal.payload.color,
                  },
                }}
                onClick={() => {
                  onCalendarToggle(cal.id);
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
            <span>No Calendar</span>
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
          onClick={() =>
            onDelete(event.calendarId, event.resource.id, event.id)
          }
          color="error"
        >
          Delete Event
        </Button>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};
