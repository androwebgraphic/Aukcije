import { useState } from "react";
import { Alert, Button, Card, Col, Form, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  ADMIN_EMAIL,
  ADMIN_LOZINKA,
  KORISNIK_EMAIL,
  KORISNIK_LOZINKA,
  RouteNames,
} from "../../constants";
import { SchemaLogin } from "../../schemas/SchemaLogin";
import useAuth from "../../hooks/useAuth";
import Heading from "../../components/UI/Heading";

// Demo računi se u localStorage-u stvaraju akcijom "Generiraj korisnike"
// na stranici Generiranje podataka.
const DEMO_RACUNI = [
  { naziv: "admina", email: ADMIN_EMAIL, lozinka: ADMIN_LOZINKA },
  { naziv: "korisnika", email: KORISNIK_EMAIL, lozinka: KORISNIK_LOZINKA },
];

export default function Logiranje() {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [lozinka, setLozinka] = useState("");
  const [greske, setGreske] = useState({});
  const [saljeSe, setSaljeSe] = useState(false);

  function popuniPodatke(racun) {
    setEmail(racun.email);
    setLozinka(racun.lozinka);
    setGreske({});
  }

  function ocistiGresku(polje) {
    setGreske((prethodne) => {
      if (!prethodne[polje]) return prethodne;
      const nove = { ...prethodne };
      delete nove[polje];
      return nove;
    });
  }

  async function odradiSubmit(e) {
    e.preventDefault();

    const rezultat = SchemaLogin.safeParse({ email, lozinka });

    if (!rezultat.success) {
      const noveGreske = {};
      for (const problem of rezultat.error.issues) {
        const polje = problem.path[0];
        if (!noveGreske[polje]) noveGreske[polje] = problem.message;
      }
      setGreske(noveGreske);
      return;
    }

    setGreske({});
    setSaljeSe(true);

    try {
      const odgovor = await login(rezultat.data.email, rezultat.data.lozinka);
      if (!odgovor.success) {
        setGreske({ opcenito: odgovor.message });
      }
      // Kod uspješne prijave AuthProvider sam preusmjeri korisnika.
    } catch (error) {
      console.error("Greška prilikom prijave:", error);
      setGreske({ opcenito: "Došlo je do greške prilikom prijave. Pokušajte ponovno." });
    } finally {
      setSaljeSe(false);
    }
  }

  return (
    <>
      <Heading as="h2" color="azure">
        Prijava
      </Heading>

      <Row className="g-2 mb-2">
        {DEMO_RACUNI.map((racun) => (
          <Col xs={12} md={6} key={racun.email}>
            <Card
              className="p-2 bg-light text-center h-100"
              style={{ cursor: "pointer", borderStyle: "dashed" }}
              onClick={() => popuniPodatke(racun)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") popuniPodatke(racun);
              }}
            >
              <small className="text-muted">Klikni za {racun.naziv}</small>
              <div className="fw-bold">{racun.email}</div>
            </Card>
          </Col>
        ))}
      </Row>

      <p className="text-white-50 small text-center">
        Demo računi nastaju na stranici{" "}
        <Link className="link-light" to={RouteNames.GENERIRANJE_PODATAKA}>
          Generiranje podataka
        </Link>{" "}
        klikom na „Generiraj korisnike”.
      </p>

      <Form onSubmit={odradiSubmit} noValidate>
        {greske.opcenito && (
          <Alert variant="danger" role="alert">
            {greske.opcenito}
          </Alert>
        )}

        <Row>
          <Col xs={12} md={6}>
            <Form.Group controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="vas@email.hr"
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  ocistiGresku("email");
                }}
                isInvalid={!!greske.email}
              />
              <Form.Control.Feedback type="invalid">
                {greske.email}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          <Col xs={12} md={6}>
            <Form.Group controlId="lozinka">
              <Form.Label>Lozinka</Form.Label>
              <Form.Control
                type="password"
                name="lozinka"
                placeholder="Unesite lozinku"
                autoComplete="current-password"
                value={lozinka}
                onChange={(e) => {
                  setLozinka(e.target.value);
                  ocistiGresku("lozinka");
                }}
                isInvalid={!!greske.lozinka}
              />
              <Form.Control.Feedback type="invalid">
                {greske.lozinka}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <hr />

        <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-4 forma-akcije">
          <Button type="submit" variant="success" disabled={saljeSe}>
            {saljeSe ? "Prijava u tijeku…" : "Prijavi se"}
          </Button>
          <Button variant="outline-danger" as={Link} to={RouteNames.HOME}>
            Odustani
          </Button>
        </div>

        <p className="mt-3 mb-0 text-center">
          Nemaš račun?{" "}
          <Link to={RouteNames.REGISTRACIJA}>Registriraj se</Link>
        </p>
      </Form>
    </>
  );
}
