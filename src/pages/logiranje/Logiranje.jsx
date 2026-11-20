import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Card } from "react-bootstrap";
import Heading from "../../components/UI/Heading";
import { useState, useRef } from "react";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants";
// VAŽNO: ShemaLogin je IMENOVANI izvoz. Default izvoz ove datoteke je
// ShemaKorisnik (registracija, traži i "uloga"), pa se ovdje ne smije
// koristiti default import.
import { ShemaLogin } from "../../schemas/SchemaKorisnik";
// Demo podaci se čitaju iz istog izvora iz kojeg se pune localStorage, pa se
// kartice "Klikni za Admina/Korisnika" ne mogu razići s lozinkom u podacima.
import { korisnici as demoKorisnici, DEMO_LOZINKA } from "../../services/korisnici/KorisniciData";

const demoAdmin = demoKorisnici.find((korisnik) => korisnik.uloga === "admin");
const demoKorisnik = demoKorisnici.find((korisnik) => korisnik.uloga === "korisnik");

// Zod greške pretvaramo u { nazivPolja: prvaPoruka } kako bi svako polje
// prikazalo svoju poruku (email, lozinka), umjesto jedne zajedničke.
function greskePoPoljima(error) {
  const polja = {};
  for (const issue of error.issues) {
    const polje = String(issue.path?.[0] ?? "opcenito");
    if (!polja[polje]) polja[polje] = issue.message;
  }
  return polja;
}

export default function Login() {
  const [errors, setErrors] = useState({});
  const { login } = useAuth();
  const formaRef = useRef(null);
  const navigate = useNavigate();

  const imaGresku = Object.keys(errors).length > 0;
  const prvaGreska = Object.values(errors)[0];

  async function handleSubmit(e) {
    e.preventDefault();

    const podatci = new FormData(e.target);
    setErrors({});

    const rezultat = ShemaLogin.safeParse({
      email: podatci.get("email"),
      lozinka: podatci.get("lozinka"),
    });

    // error postoji SAMO kad validacija padne - zato se čita isključivo
    // unutar ovog if-a (inače je rezultat.error undefined i kod puca).
    if (!rezultat.success) {
      setErrors(greskePoPoljima(rezultat.error));
      return;
    }

    try {
      // rezultat.data.email je već triman zahvaljujući .trim() u shemi
      const odgovor = await login(rezultat.data.email, rezultat.data.lozinka);

      // Prijava je prošla validaciju, ali račun ne postoji / lozinka je kriva.
      if (!odgovor.success) {
        console.warn(
          "Prijava nije uspjela za email:",
          rezultat.data.email,
          "- provjeri unos i localStorage 'administratori'"
        );
        setErrors({ opcenito: odgovor.message });
        return;
      }

      // Login više ne preusmjerava sam (vidi AuthContext) - to radimo ovdje,
      // i to na rutu koja stvarno postoji.
      navigate(RouteNames.HOME);
    } catch (error) {
      console.error("Greška pri prijavi:", error);
      setErrors({ opcenito: "Prijava nije uspjela. Pokušajte ponovno." });
    }
  }

  const popuniPodatke = (email, lozinka) => {
    const forma = formaRef.current;
    forma.elements.email.value = email;
    forma.elements.lozinka.value = lozinka;
    setErrors({});
  };

  const ocistiGresku = (nazivPolja) => {
    setErrors((prethodne) => {
      if (!prethodne[nazivPolja]) return prethodne;
      const noveGreske = { ...prethodne };
      delete noveGreske[nazivPolja];
      return noveGreske;
    });
  };

  return (
    <>
      <Row className="mb-3">
        <Heading as="h2">Logiranje</Heading>
        <Col md={6}>
          <Card
            className="p-2 mb-2 bg-light border-dashed cursor-pointer text-center"
            style={{ cursor: "pointer", borderStyle: "dashed" }}
            onClick={() => popuniPodatke(demoAdmin?.email, DEMO_LOZINKA)}
          >
            <small className="text-muted">Klikni za Admina</small>
            <div className="fw-bold">{demoAdmin?.email}</div>
          </Card>
        </Col>
        <Col md={6}>
          <Card
            className="p-2 mb-2 bg-light border-dashed cursor-pointer text-center"
            style={{ cursor: "pointer", borderStyle: "dashed" }}
            onClick={() => popuniPodatke(demoKorisnik?.email, DEMO_LOZINKA)}
          >
            <small className="text-muted">Klikni za Korisnika</small>
            <div className="fw-bold">{demoKorisnik?.email}</div>
          </Card>
        </Col>
      </Row>

      {/* noValidate: validaciju radi isključivo Zod (hrvatske poruke).
          Bez toga browser sam blokira submit i prikaže svoju, englesku poruku. */}
      <Form onSubmit={handleSubmit} ref={formaRef} noValidate>
        <div className="login-form">
            <h3 className="mb-4">Podaci za prijavu</h3>

            {imaGresku && (
              <div className="alert alert-danger" role="alert">
                {prvaGreska}
              </div>
            )}

            <Row>
              <Col xs={12} sm={6}>
                <Form.Group controlId="email" className="mb-3">
                  <Form.Label className="fw-bold">Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="vas@email.hr"
                    isInvalid={!!errors.email}
                    onFocus={() => ocistiGresku("email")}
                    autoComplete="email"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
       
              <Col xs={12} sm={6}>
                <Form.Group controlId="lozinka" className="mb-3">
                  <Form.Label className="fw-bold">Lozinka</Form.Label>
                  <Form.Control
                    type="password"
                    name="lozinka"
                    placeholder="Unesite lozinku"
                    isInvalid={!!errors.lozinka}
                    onFocus={() => ocistiGresku("lozinka")}
                    autoComplete="current-password"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.lozinka}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <hr />

            <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-4">
              <Button type="submit" variant="outline-success" size="sm" className="px-4">
                Logiraj se
              </Button>
            </div>
        </div>
      </Form>
    </>
  );
}
