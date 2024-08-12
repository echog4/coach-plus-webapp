import { Button } from "@mui/material";
import { GoogleButtonIcon } from "../../components/icons/GoogleButton";
import { PageContainer } from "../../components/PageContainer/PageContainer";
import { useAuth } from "../../providers/AuthContextProvider";

export const LoginRoute = () => {
  const { signIn } = useAuth();

  return (
    <PageContainer>
      <h1>Login</h1>
      <Button onClick={signIn}>
        <GoogleButtonIcon />
      </Button>
    </PageContainer>
  );
};
