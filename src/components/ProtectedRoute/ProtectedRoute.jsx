import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../providers/AuthContextProvider";
import { PATH_COACH_ONBOARDING, PATH_OTP } from "../../utils/constant";

export const ProtectedRoute = ({ children }) => {
  const { session, user, loading } = useAuth();
  const { pathname } = useLocation();
  if (loading) {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  if (user && !user.onboarded_at && pathname !== PATH_COACH_ONBOARDING) {
    return <Navigate to={PATH_COACH_ONBOARDING} replace />;
  }

  if (
    user &&
    user.onboarded_at &&
    user.status !== "VERIFIED" &&
    pathname !== PATH_OTP
  ) {
    return <Navigate to={PATH_OTP} replace />;
  }

  return children;
};
