import { Box, Button, CircularProgress, Paper } from "@mui/material";
import { PageContainer } from "../../components/PageContainer/PageContainer";
import { useCalendar } from "../../providers/CalendarProvider";
import { useEffect, useState } from "react";

export const CalendarComponent = () => {
  const { createEvent, deleteEvent, getEvents, events } = useCalendar();
  const [showCal, setShowCal] = useState(true);

  const reloadCalendar = () => {
    setShowCal(false);
    setTimeout(() => {
      setShowCal(true);
      getEvents();
    }, 3000);
  };

  useEffect(() => {
    reloadCalendar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PageContainer>
      <Button
        onClick={() => {
          createEvent("primary", {
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

      {console.log({ events }) ||
        events.map(
          (event) =>
            event && (
              <Paper key={event.id} sx={{ padding: 1, marginBottom: 1 }}>
                <Box>{event.summary}</Box>
                <Box>{event.description}</Box>
                <Box>{event.start.dateTime}</Box>
                <Box>{event.end.dateTime}</Box>
                <Button
                  onClick={async () => {
                    await deleteEvent("primary", event.id);
                    reloadCalendar();
                  }}
                >
                  Delete
                </Button>
              </Paper>
            )
        )}
      <br />
      <br />
      <Paper elevation={2} sx={{ px: 1, pt: 0.75, pb: 0.3, marginBottom: 4 }}>
        {showCal ? (
          <iframe
            title="calendar"
            src="https://calendar.google.com/calendar/embed?src=coachplusweb%40gmail.com&ctz=Europe%2FIstanbul"
            style={{ width: "100%", height: 600 }}
            width="100%"
            frameBorder="0"
            scrolling="no"
          ></iframe>
        ) : (
          <Box>
            <CircularProgress />
          </Box>
        )}
      </Paper>
    </PageContainer>
  );
};
