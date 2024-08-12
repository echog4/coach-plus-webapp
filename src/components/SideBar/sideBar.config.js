import {
  Article,
  CalendarMonth,
  Dashboard,
  ManageAccounts,
  Pool,
} from "@mui/icons-material";

export const sideBarConfig = [
  {
    name: "Dashboard",
    path: "/",
    icon: <Dashboard />,
  },
  {
    name: "Athletes",
    path: "/athletes",
    icon: <Pool />,
  },
  {
    name: "Onboarding Forms",
    path: "/onboarding-forms",
    icon: <Article />,
  },
  {
    name: "Calendar",
    path: "/calendar",
    icon: <CalendarMonth />,
  },
  {
    name: "Account Settings",
    path: "/settings",
    icon: <ManageAccounts />,
  },
];
