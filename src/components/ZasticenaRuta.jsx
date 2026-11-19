import { Alert, Button } from "react-bootstrap";
import { Link, Navigate } from "react-router-dom";
import { RouteNames } from "../constants";
import useAuth from "../hooks/useAuth";
import { jeAdmin } from "../utils/ovlasti";

// Zaštita ruta:
//   <ZasticenaRuta>...</ZasticenaRuta>              -> mora biti prijavljen
//   <ZasticenaRuta adminOnly>...</ZasticenaRuta>    -> mora biti admin
export default function ZasticenaRuta({ children, adminOnly = false }) {
  const { isLoggedIn, authUser, spremno } = useAuth();

  // Sesija se još čita iz localStorage - ne preusmjeravaj.
  if (!spremno) return null;

  if (!isLoggedIn) {
    return <Navigate to={RouteNames.LOGIRANJE} replace />;
  }

  if (adminOnly && !jeAdmin(authUser)) {
    return (
      <Alert variant="warning" className="mt-4 text-center">
        <Alert.Heading>Nemate ovlasti</Alert.Heading>
        <p className="mb-3">
          Ova stranica je dostupna samo administratorima. Prijavljeni ste kao{" "}
          <strong>{authUser?.email ?? "korisnik"}</strong> (uloga:{" "}
          {authUser?.uloga ?? "nepoznato"}).
        </p>
        <Button as={Link} to={RouteNames.HOME} variant="outline-dark">
          Povratak na početnu
        </Button>
      </Alert>
    );
  }

  return children;
}
