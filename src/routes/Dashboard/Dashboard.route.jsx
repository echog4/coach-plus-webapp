import { useAuth } from "../../providers/AuthContextProvider";
import { DashboardComponent } from "./Dashboard.component";

export const DashboardRoute = () => {
  const { user } = useAuth();
  return <DashboardComponent user={user} />;
};
