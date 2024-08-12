import { useSupabase } from "../../providers/AuthContextProvider";
import { DashboardComponent } from "./Dashboard.component";

export const DashboardRoute = () => {
  const sb = useSupabase();
  sb.auth.getSession().then(({ data }) => {
    console.log("session", data);
  });
  return <DashboardComponent />;
};
