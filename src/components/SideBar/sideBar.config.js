import {
  Article,
  CalendarMonth,
  Checklist,
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
    path: "/athlete/14",
    icon: <Pool />,
  },
  {
    name: "Training Plans",
    path: "/training-plan",
    icon: <Checklist />,
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
