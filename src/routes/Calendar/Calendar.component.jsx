import { Button, Paper } from "@mui/material";
import { PageContainer } from "../../components/PageContainer/PageContainer";
import { useCalendar } from "../../providers/CalendarProvider";

export const CalendarComponent = () => {
  const { getEvents } = useCalendar();

  return (
    <PageContainer>
      <Button onClick={getEvents}>Trigger Get Events</Button>
      <br />
      <br />
      <Paper elevation={2} sx={{ px: 1, pt: 0.75, pb: 0.3, marginBottom: 4 }}>
        <iframe
          title="calendar"
          src="https://calendar.google.com/calendar/u/0/embed?src=bmZsXy1tLTA1ZzN2XyU0ZWV3KyU0ZnJsZWFucyslNTNhaW50cyNzcG9ydHNAZ3JvdXAudi5jYWxlbmRhci5nb29nbGUuY29t"
          style={{ width: "100%", height: 600 }}
          width="100%"
          frameBorder="0"
          scrolling="no"
        ></iframe>
      </Paper>
    </PageContainer>
  );
};
