import { createContext, useContext, useEffect, useState } from "react";
import { useAuth, useSupabase } from "./AuthContextProvider";
import { endOfDay, startOfDay, startOfMonth } from "date-fns";
import { useLocalStorage } from "@uidotdev/usehooks";

const CalendarContext = createContext(undefined);

const gapi = window.gapi;

export const CalendarProvider = ({ children }) => {
  const [gapiInited, setGapiInited] = useState(false);
  const [calendars, setCalendars] = useState([]);
  const supabase = useSupabase();

  const { localSession } = useAuth();
  const [gapiTime, setGapiTime] = useLocalStorage("gapiTime", Date.now());

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

    refreshGoogleToken: async () => {
      if (Date.now() - gapiTime < 2700000) {
        console.log("token still valid");
        return;
      }
      console.log("refreshing token");
      setGapiInited(false);
      setGapiTime(Date.now());
      const { access_token } = (
        await supabase.functions.invoke("refresh-token")
      ).data;
      await window.gapi.client.setToken({
        access_token,
      });
      setGapiInited(true);
    },

    getCalendar: async (calendarId, events = false) => {
      await window.calendarContextValue.refreshGoogleToken();
      const clResponse = await gapi.client.calendar.calendarList.get({
        calendarId: calendarId,
      });
      const cResponse = await gapi.client.calendar.calendars.get({
        calendarId: calendarId,
      });
      const calendar = cResponse.result;
      const calendarList = clResponse.result;

      return {
        calendarId: calendarList.id,
        color: calendarList.backgroundColor,
        textColor: calendarList.foregroundColor,
        title: calendarList.summary,
        description: calendarList.description,
        timeZone: calendar.timeZone,
        events: events
          ? (await window.calendarContextValue.getEvents(calendarList.id)).map(
              (event) => ({
                ...event,
                calendarId: calendarList.id,
                backgroundColor: calendarList.backgroundColor,
                foregroundColor: calendarList.foregroundColor,
              })
            )
          : [],
      };
    },
    getCalendars: async (filter) => {
      await window.calendarContextValue.refreshGoogleToken();
      const response = await gapi.client.calendar.calendarList.list();
      const cals = await Promise.all(
        response.result.items
          //.filter((calendar) => (!filter ? true : filter.includes(calendar.id)))
          .map(async (calendar) => {
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
      await window.calendarContextValue.refreshGoogleToken();
      const request = {
        resource: calendar,
      };
      const response = await gapi.client.calendar.calendars.insert(request);
      return response.result;
    },
    getEvents: async (calId, startTime) => {
      await window.calendarContextValue.refreshGoogleToken();
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
      return response.result.items.map((item) => {
        const isAllDay = item.start.date ? true : false;
        return {
          resource: item,
          allDay: isAllDay,
          start: isAllDay
            ? startOfDay(item.start.date)
            : new Date(item.start.dateTime),
          end: isAllDay
            ? endOfDay(item.start.date)
            : new Date(item.end.dateTime),
          title: item.summary,
        };
      });
    },
    createEvent: async (calendarId, event) => {
      await window.calendarContextValue.refreshGoogleToken();
      const request = {
        calendarId: calendarId,
        resource: event,
      };
      return (await gapi.client.calendar.events.insert(request)).result;
    },
    deleteEvent: async (calendarId, eventId) => {
      await window.calendarContextValue.refreshGoogleToken();
      const request = {
        calendarId: calendarId,
        eventId: eventId,
      };
      const response = await gapi.client.calendar.events.delete(request);
      return response.result;
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
