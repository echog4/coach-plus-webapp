import {
  Article,
  CalendarMonth,
  Checklist,
  Dashboard,
  ManageAccounts,
} from "@mui/icons-material";

export const sideBarConfig = [
  {
    name: "Dashboard",
    path: "/",
    icon: <Dashboard />,
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
