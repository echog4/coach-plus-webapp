import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContextProvider";

const CalendarContext = createContext(undefined);

const gapi = window.gapi;

export const CalendarProvider = ({ children }) => {
  const [gapiInited, setGapiInited] = useState(false);
  const [gisInited, setGisInited] = useState(false);
  const [tokenClient, setTokenClient] = useState(null);
  const [events, setEvents] = useState([]);

  const { localSession, user, signOut } = useAuth();

  useEffect(() => {
    const initializeGapiClient = async () => {
      if (!localSession) {
        return;
      }
      await gapi.client.init({
        apiKey: process.env.REACT_APP_GOOGLE_API_KEY,
        discoveryDocs: [
          "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
        ],
      });
      await gapi.client.setToken({
        access_token: localSession.provider_token,
        refresh_token: localSession.provider_refresh_token,
      });
      setGapiInited(true);
      console.log({ localSession });
    };
    gapi.load("client", initializeGapiClient);
  }, [localSession]);

  const calendarContextValue = {
    gapi,
    events,
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
