import { PageContainer } from "../../components/PageContainer/PageContainer";
import { AthletesTable } from "../../components/AthletesTable/AthletesTable";
import { CoachProfileCard } from "../../components/CoachProfileCard/CoachProfileCard";
import { CalendarComponent } from "../../components/Calendar/Calendar";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { useEffect, useState } from "react";
import { useSupabase } from "../../providers/AuthContextProvider";
import { useCalendar } from "../../providers/CalendarProvider";
import { CreateEventModal } from "../../components/CreateEventModal/CreateEventModal";

export const DashboardComponent = ({ user }) => {
  const [athletes, setAthletes] = useState([]);
  const [eventModalOpen, setEventModalOpen] = useState(true);
  const supabase = useSupabase();
  const { getCalendars } = useCalendar();

  useEffect(() => {
    // const sb_calendars = supabase.from("calendars").select().eq("coach_id", user.id);
    // const getCalendar
    // // eslint-disable-next-line react-hooks/exhaustive-deps
    console.log({ athletes });
  }, [user, athletes]);

  if (!user) {
    return null;
  }

  return (
    <PageContainer>
      {eventModalOpen && (
        <CreateEventModal
          open={eventModalOpen}
          handleClose={() => setEventModalOpen(false)}
          athletes={athletes.filter((a) => a.calendars.length > 0)}
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
            calendars={[]}
            onNewEventClick={() => {}}
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
