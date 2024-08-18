import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { PageContainer } from "../../components/PageContainer/PageContainer";
import { AthletesTable } from "../../components/AthletesTable/AthletesTable";
import { Activity } from "../../components/Activity/Activity";

export const DashboardComponent = () => {
  return (
    <PageContainer>
      <h1>Dashboard</h1>
      <Grid2 container spacing={2}>
        <Grid2 xs={12} md={12}>
          <AthletesTable />
        </Grid2>
        <Grid2 xs={12} md={12}>
          <Activity />
        </Grid2>
      </Grid2>
    </PageContainer>
  );
};
