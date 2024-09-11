import { PageContainer } from "../../components/PageContainer/PageContainer";
import { CalendarComponent as Cal } from "../../components/Calendar/Calendar";

export const CalendarComponent = () => {
  return (
    <PageContainer>
      <Cal
        title="This week"
        defaultView="month"
        height="calc(100vh - 210px)"
        toggles
      />
    </PageContainer>
  );
};
