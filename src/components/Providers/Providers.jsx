import { CssBaseline, ThemeProvider } from "@mui/material";
import { theme } from "../../utils/styles/theme";
import { BrowserRouter } from "react-router-dom";
import { AuthContextProvider } from "../../providers/AuthContextProvider";
import { createClient } from "@supabase/supabase-js";
import { useState } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { CalendarProvider } from "../../providers/CalendarProvider";

export const Providers = ({ children }) => {
  const [supabase] = useState(() =>
    createClient(
      process.env.REACT_APP_SUPABASE_URL,
      process.env.REACT_APP_SUPABASE_ANON_KEY
    )
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <AuthContextProvider supabase={supabase}>
        <CalendarProvider>
          <BrowserRouter future={{ v7_startTransition: true }}>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              {children}
            </ThemeProvider>
          </BrowserRouter>
        </CalendarProvider>
      </AuthContextProvider>
    </LocalizationProvider>
  );
};
