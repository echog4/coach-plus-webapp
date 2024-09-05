import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContextProvider";
import { startOfMonth } from "date-fns";

const CalendarContext = createContext(undefined);

const gapi = window.gapi;

export const CalendarProvider = ({ children }) => {
  const [gapiInited, setGapiInited] = useState(false);
  const [calendars, setCalendars] = useState([]);

  const { localSession } = useAuth();

  useEffect(() => {
    const initializeGapiClient = async () => {
      if (!localSession) {
        return;
      }
      await window.gapi.client.init({
        apiKey: process.env.REACT_APP_GOOGLE_API_KEY,
        discoveryDocs: [
          "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
        ],
      });
      // TODO: disable this line. should be handled by gis
      await window.gapi.client.setToken({
        access_token: localSession.provider_token,
        refresh_token: localSession.provider_refresh_token,
      });
      setGapiInited(true);
      // await calendarContextValue.getEvents();
    };
    window.gapi.load("client", initializeGapiClient);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localSession, window.gapi]);

  window.calendarContextValue = {
    gapi,
    calendars,
    gapiInited,
    toggleCalendar: (calendarId) => {
      setCalendars(
        calendars.map((calendar) =>
          calendar.calendarId === calendarId
            ? { ...calendar, hidden: !calendar.hidden }
            : calendar
        )
      );
    },
    getCalendars: async () => {
      const response = await gapi.client.calendar.calendarList.list();

      const cals = await Promise.all(
        response.result.items.map(async (calendar) => {
          const savedCalendar = calendars.find(
            (c) => c.calendarId === calendar.id
          );

          return {
            calendarId: calendar.id,
            color: calendar.backgroundColor,
            textColor: calendar.foregroundColor,
            title: calendar.summary,
            events:
              savedCalendar && savedCalendar.hidden
                ? []
                : (
                    await window.calendarContextValue.getEvents(calendar.id)
                  ).map((event) => ({
                    ...event,
                    calendarId: calendar.id,
                    backgroundColor: calendar.backgroundColor,
                    foregroundColor: calendar.foregroundColor,
                  })),
            hidden: savedCalendar ? savedCalendar.hidden : false,
          };
        })
      );

      setCalendars(cals);
    },
    syncCalendarsLocalStorage: (cals) => {},
    getSelectedCalendars: () => {
      return calendars.filter((calendar) => !calendar.hidden);
    },
    getSelectedEvents: () => {
      return window.calendarContextValue
        .getSelectedCalendars()
        .map((calendar) => calendar.events)
        .flat()
        .map((event) => ({
          ...event,
          start: new Date(event.start),
          end: new Date(event.end),
        }));
    },
    createCalendar: async (calendar) => {
      const request = {
        resource: calendar,
      };
      const response = await gapi.client.calendar.calendars.insert(request);
      setCalendars([...calendars, response.result]);
    },
    getEvents: async (calId, startTime) => {
      const st = startTime || startOfMonth(new Date());

      const request = {
        calendarId: calId || "primary",
        timeMin: st.toISOString(),
        showDeleted: false,
        singleEvents: true,
        maxResults: 1000,
        orderBy: "startTime",
      };
      const response = await gapi.client.calendar.events.list(request);
      return response.result.items.map((item) => ({
        resource: item,
        start: new Date(item.start.dateTime),
        end: new Date(item.end.dateTime),
        title: item.summary,
      }));
    },
    createEvent: async (calendarId, event) => {
      const request = {
        calendarId: calendarId,
        resource: event,
      };
      await gapi.client.calendar.events.insert(request);
      await window.calendarContextValue.getEvents(calendarId);
    },
    deleteEvent: async (calendarId, eventId) => {
      const request = {
        calendarId: calendarId,
        eventId: eventId,
      };
      const response = await gapi.client.calendar.events.delete(request);
      console.log({ response });
    },
  };

  return (
    <CalendarContext.Provider value={window.calendarContextValue}>
      {children}
    </CalendarContext.Provider>
  );
};

export const useCalendar = () => {
  const context = useContext(CalendarContext);

  if (context === undefined) {
    throw new Error("useCalendar must be used within a CalendarProvider");
  }

  return context;
};
