import { PageContainer } from "../../components/PageContainer/PageContainer";
import { AthletesTable } from "../../components/AthletesTable/AthletesTable";
import { CoachProfileCard } from "../../components/CoachProfileCard/CoachProfileCard";
import { CalendarComponent } from "../../components/Calendar/Calendar";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";

export const DashboardComponent = ({ user }) => {
  if (!user) {
    return null;
  }
  return (
    <PageContainer>
      <Grid2 container spacing={2}>
        <Grid2 xs={12} lg={12}>
          <CoachProfileCard user={user} />
        </Grid2>
        <Grid2 xs={12} sm={6} md={6}>
          <CalendarComponent
            title="This week"
            defaultView="agenda"
            views={["agenda"]}
          />
        </Grid2>
        <Grid2 xs={12} sm={6} md={6}>
          <AthletesTable />
        </Grid2>
      </Grid2>
    </PageContainer>
  );
};
