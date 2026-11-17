import { Navigate, useLocation } from "react-router-dom";
import { RouteNames } from "../constants";
import useAuth from "../hooks/useAuth";

// Ruta dostupna samo prijavljenim korisnicima.
// Uz `samoAdmin` dostupna je isključivo administratorima.
export default function ProtectedRoute({ children, samoAdmin = false }) {
  const { isLoggedIn, isAdmin } = useAuth();
  const location = useLocation();

  if (!isLoggedIn) {
    return (
      <Navigate
        to={RouteNames.LOGIRANJE}
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  if (samoAdmin && !isAdmin) {
    return <Navigate to={RouteNames.HOME} replace />;
  }

  return children;
}
