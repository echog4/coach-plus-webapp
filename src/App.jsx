import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import React from "react";

import { AppHeader } from "./components/AppHeader/AppHeader";
import { SideBar } from "./components/SideBar/SideBar";
import { Route, Routes } from "react-router-dom";
import { AthleteRoute } from "./routes/AthleteDetail/Athlete.route";
import { DashboardRoute } from "./routes/Dashboard/Dashboard.route";
import { LoginRoute } from "./routes/Login/Login.route";
import { ProtectedRoute } from "./components/ProtectedRoute/ProtectedRoute";
import { CalendarRoute } from "./routes/Calendar/Calendar.route";

function App() {
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [isClosing, setIsClosing] = React.useState(false);

  const handleDrawerClose = () => {
    setIsClosing(true);
    setDrawerOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setDrawerOpen(!drawerOpen);
    }
  };

  return (
    <main style={{ background: "rgba(246, 247, 248, 0.5)" }}>
      <AppHeader handleDrawerToggle={handleDrawerToggle} />
      <div style={{ display: "flex", minHeight: "100vh" }}>
        <SideBar
          drawerOpen={drawerOpen}
          handleDrawerClose={handleDrawerClose}
          handleDrawerTransitionEnd={handleDrawerTransitionEnd}
        />
        <div
          style={{
            flexGrow: 1,
            minHeight: "100%",
          }}
        >
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <DashboardRoute />
                </ProtectedRoute>
              }
            />
            <Route
              path="/athletes"
              element={
                <ProtectedRoute>
                  <AthleteRoute />
                </ProtectedRoute>
              }
            />
            <Route
              path="/calendar"
              element={
                <ProtectedRoute>
                  <CalendarRoute />
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<LoginRoute />} />
            <Route
              path="*"
              element={<ProtectedRoute>Not Found</ProtectedRoute>}
            />
          </Routes>
        </div>
      </div>
    </main>
  );
}

export default App;
