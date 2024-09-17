import { PageContainer } from "../../components/PageContainer/PageContainer";
import { CalendarComponent as Cal } from "../../components/Calendar/Calendar";
import { useAuth, useSupabase } from "../../providers/AuthContextProvider";
import { getCalendarsByCoachId, toggleCalendar } from "../../services/query";
import { useEffect, useState } from "react";
import { CreateEventModal } from "../../components/CreateEventModal/CreateEventModal";

export const CalendarComponent = () => {
  const [toggling, setToggling] = useState(false);
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [calendars, setCalendars] = useState([]);
  const supabase = useSupabase();
  const { user } = useAuth();

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
      <Cal
        title="Calendar"
        defaultView="month"
        height="calc(100vh - 245px)"
        toggles
        calendars={calendars}
        onNewEventClick={() => {
          setEventModalOpen(true);
        }}
        onEventDelete={() => {
          reloadCalendars();
        }}
        onCalendarToggle={async (calendarId) => {
          if (toggling) {
            return;
          }
          setToggling(true);
          const cal = calendars.find((c) => c.id === calendarId);
          await toggleCalendar(supabase, calendarId, !cal.enabled);
          await reloadCalendars();
          setToggling(false);
        }}
      />
    </PageContainer>
  );
};
