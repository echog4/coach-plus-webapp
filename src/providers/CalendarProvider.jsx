import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContextProvider";

const CalendarContext = createContext(undefined);

const gapi = window.gapi;

export const CalendarProvider = ({ children }) => {
  const [gapiInited, setGapiInited] = useState(false);
  const [events, setEvents] = useState([]);
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
      await window.gapi.client.setToken({
        access_token: localSession.provider_token,
        refresh_token: localSession.provider_refresh_token,
      });
      setGapiInited(true);
      console.log({ localSession });
    };
    window.gapi.load("client", initializeGapiClient);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localSession, window.gapi]);

  const calendarContextValue = {
    gapi,
    events,
    calendars,
    gapiInited,

    getCalendars: async () => {
      const response = await gapi.client.calendar.calendarList.list();
      console.log({ response });
      setCalendars(response.result.items);
    },
    getEvents: async () => {
      const request = {
        calendarId: "primary",
        timeMin: "2024-07-30T11:39:30.328Z",
        showDeleted: false,
        singleEvents: true,
        maxResults: 10,
        orderBy: "startTime",
      };
      const response = await gapi.client.calendar.events.list(request);
      console.log({ response });
      setEvents(response.result.items);
    },
  };

  return (
    <CalendarContext.Provider value={calendarContextValue}>
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
