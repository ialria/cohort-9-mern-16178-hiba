import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loading from "./Loading";
import ErrorPage from "../pages/ErrorPage";

function ProtectedRoute() {
  const { user, loading, authError , getCurrentUser} = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loading />;
  }
    if (authError) {
    return <ErrorPage message={authError} onRetry={getCurrentUser}/>;
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  return <Outlet />;
}

export default ProtectedRoute;