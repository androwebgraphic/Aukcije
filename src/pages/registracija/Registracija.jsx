import { useState } from "react";
import { Alert, Button, Col, Form, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants";
import KorisniciService from "../../services/korisnici/KorisniciService";
import Heading from "../../components/UI/Heading";
import Upute from "../../components/Upute";
import { SchemaRegistracija } from "../../schemas/SchemaRegistracija";

export default function KorisnikNovi() {
  const navigate = useNavigate();

  const [greske, setGreske] = useState({});
  const [opcaGreska, setOpcaGreska] = useState(null);
  const [saljeSe, setSaljeSe] = useState(false);

  function ocistiGresku(polje) {
    setGreske((prethodne) => {
      if (!prethodne[polje]) return prethodne;
      const nove = { ...prethodne };
      delete nove[polje];
      return nove;
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setGreske({});
    setOpcaGreska(null);

    const podatci = new FormData(e.target);
    const forma = {
      ime: String(podatci.get("ime") || ""),
      email: String(podatci.get("email") || ""),
      lozinka: String(podatci.get("lozinka") || ""),
      potvrdaLozinke: String(podatci.get("potvrdaLozinke") || ""),
    };

    const rezultat = SchemaRegistracija.safeParse(forma);

    if (!rezultat.success) {
      const noveGreske = {};
      for (const problem of rezultat.error.issues) {
        const polje = problem.path[0];
        if (polje && !noveGreske[polje]) noveGreske[polje] = problem.message;
      }
      setGreske(noveGreske);
      return;
    }

    setSaljeSe(true);

    try {
      const odgovor = await KorisniciService.dodaj({
        ime: rezultat.data.ime,
        email: rezultat.data.email,
        lozinka: rezultat.data.lozinka,
        uloga: "korisnik", // uloga se NIKAD ne čita iz forme
        dodano: new Date().toISOString(),
      });

      // Servis vraća { success: false, message } ako email već postoji.
      if (!odgovor?.success) {
        setOpcaGreska(odgovor?.message || "Registracija nije uspjela.");
        return;
      }

      navigate(RouteNames.LOGIRANJE, { state: { registriran: true } });
    } catch (error) {
      console.error("Greška prilikom registracije korisnika:", error);
      setOpcaGreska("Došlo je do greške prilikom registracije. Pokušaj ponovno.");
    } finally {
      setSaljeSe(false);
    }
  }

  return (
    <>
      <Heading as="h2" color="azure">
        Registracija
      </Heading>
      <Upute>upute</Upute>

      <Form onSubmit={handleSubmit} noValidate>
        {opcaGreska && (
          <Alert variant="danger" role="alert">
            {opcaGreska}
          </Alert>
        )}

        <Row>
          <Col sm={12} md={6}>
            <Form.Group controlId="ime" className="mb-3">
              <Form.Label>Ime</Form.Label>
              <Form.Control
                type="text"
                name="ime"
                placeholder="Upiši ime ili korisničko ime"
                isInvalid={!!greske.ime}
                onChange={() => ocistiGresku("ime")}
              />
              <Form.Control.Feedback type="invalid">{greske.ime}</Form.Control.Feedback>
            </Form.Group>
          </Col>

          <Col sm={12} md={6}>
            <Form.Group controlId="email" className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="Upiši adresu e-pošte"
                autoComplete="email"
                isInvalid={!!greske.email}
                onChange={() => ocistiGresku("email")}
              />
              <Form.Control.Feedback type="invalid">{greske.email}</Form.Control.Feedback>
            </Form.Group>
          </Col>

          <Col sm={12} md={6}>
            <Form.Group controlId="lozinka" className="mb-3">
              <Form.Label>Lozinka</Form.Label>
              <Form.Control
                type="password"
                name="lozinka"
                placeholder="Najmanje 8 znakova, slovo i broj"
                autoComplete="new-password"
                isInvalid={!!greske.lozinka}
                onChange={() => ocistiGresku("lozinka")}
              />
              <Form.Control.Feedback type="invalid">{greske.lozinka}</Form.Control.Feedback>
            </Form.Group>
          </Col>

          <Col sm={12} md={6}>
            <Form.Group controlId="potvrdaLozinke" className="mb-3">
              <Form.Label>Ponovi lozinku</Form.Label>
              <Form.Control
                type="password"
                name="potvrdaLozinke"
                placeholder="Upiši lozinku još jednom"
                autoComplete="new-password"
                isInvalid={!!greske.potvrdaLozinke}
                onChange={() => ocistiGresku("potvrdaLozinke")}
              />
              <Form.Control.Feedback type="invalid">
                {greske.potvrdaLozinke}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <hr />

        <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-4 forma-akcije">
          <Button type="submit" variant="success" disabled={saljeSe}>
            {saljeSe ? "Registracija u tijeku…" : "Registriraj se"}
          </Button>
          <Button variant="outline-danger" as={Link} to={RouteNames.HOME}>
            Odustani
          </Button>
        </div>

        <p className="mt-3 mb-0 text-center">
          Već imaš račun?{" "}
          <Link to={RouteNames.LOGIRANJE}>Prijavi se</Link>
        </p>
      </Form>
    </>
  );
}
