import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../providers/AuthContextProvider";
import { PATH_COACH_ONBOARDING } from "../../utils/constant";

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

  return children;
};
