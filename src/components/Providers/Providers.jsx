import { CssBaseline, ThemeProvider } from "@mui/material";
import { theme } from "../../utils/styles/theme";
import { BrowserRouter } from "react-router-dom";
import { AuthContextProvider } from "../../providers/AuthContextProvider";
import { createClient } from "@supabase/supabase-js";
import { useState } from "react";

export const Providers = ({ children }) => {
  const [supabase] = useState(() =>
    createClient(
      process.env.REACT_APP_SUPABASE_URL,
      process.env.REACT_APP_SUPABASE_ANON_KEY
    )
  );

  return (
    <AuthContextProvider supabase={supabase}>
      <BrowserRouter future={{ v7_startTransition: true }}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </BrowserRouter>
    </AuthContextProvider>
  );
};
