import { PageContainer } from "../../components/PageContainer/PageContainer";
import { AthletesTable } from "../../components/AthletesTable/AthletesTable";
import { Activity } from "../../components/Activity/Activity";

export const DashboardComponent = () => {
  return (
    <PageContainer>
      <h1>Dashboard</h1>

      <AthletesTable />
      <Activity />
    </PageContainer>
  );
};
