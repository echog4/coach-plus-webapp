import { PageContainer } from "../../components/PageContainer/PageContainer";
import { AthletesTable } from "../../components/AthletesTable/AthletesTable";
import { CoachProfileCard } from "../../components/CoachProfileCard/CoachProfileCard";
import { CalendarComponent } from "../../components/Calendar/Calendar";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { useEffect, useState } from "react";
// import { useSupabase } from "../../providers/AuthContextProvider";
// import { useCalendar } from "../../providers/CalendarProvider";
import { CreateEventModal } from "../../components/CreateEventModal/CreateEventModal";
import { getCalendarsByCoachId } from "../../services/query";
import { useSupabase } from "../../providers/AuthContextProvider";

export const DashboardComponent = ({ user }) => {
  const [athletes, setAthletes] = useState([]);
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [calendars, setCalendars] = useState([]);
  const supabase = useSupabase();

  const reloadCalendars = () =>
    getCalendarsByCoachId(supabase, user.id).then((calendars) => {
      setCalendars(calendars.data);
    });

  useEffect(() => {
    // TODO: handle calendar data
    if (!user) {
      return;
    }
    reloadCalendars();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  if (!user) {
    return null;
  }

  return (
    <PageContainer>
      {eventModalOpen && (
        <CreateEventModal
          open={eventModalOpen}
          handleClose={() => setEventModalOpen(false)}
          onSuccess={() => {
            reloadCalendars();
          }}
        />
      )}
      <Grid2 container spacing={2}>
        <Grid2 xs={12} lg={12}>
          <CoachProfileCard user={user} athletes={athletes} />
        </Grid2>
        <Grid2 xs={12} sm={6} md={6}>
          <CalendarComponent
            title="This week"
            defaultView="agenda"
            views={["agenda"]}
            calendars={calendars}
            onNewEventClick={() => {
              setEventModalOpen(true);
            }}
            onEventDelete={() => {
              reloadCalendars();
            }}
          />
        </Grid2>
        <Grid2 xs={12} sm={6} md={6}>
          <AthletesTable
            onAthletesLoad={(athletes) =>
              setAthletes(athletes.map((a) => a.athletes))
            }
          />
        </Grid2>
      </Grid2>
    </PageContainer>
  );
};
