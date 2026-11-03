import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants"
import KorisniciServices from "../../services/korisnici/KorisniciServices"
import Heading from "../../components/UI/Heading";

export default function KorisnikoNovi() {
    const navigate = useNavigate();

    async function dodaj(korisnik) {
        try {
            await KorisniciServices.dodaj(korisnik);
            navigate(RouteNames.KORISNICI); // Preusmjeravanje nakon uspješnog slanja
        } catch (error) {
            console.error("Greška prilikom registracije korisnika:", error);
        }
    }

    function handleSubmit(e) {
        e.preventDefault();
        const podatci = new FormData(e.target);

        // Trenutni datum i vrijeme u ISO formatu
        const dateAdded = new Date().toISOString();

        // Slanje podataka s uključenim automatskim datumom
        dodaj({
            ime: podatci.get('ime') || '',
            email: podatci.get('email') || '',
            lozinka: podatci.get('lozinka') || '',
            dodano: dateAdded, // Ovdje šaljemo automatski generirani datum (prilagodi naziv 'dodano' ako backend traži npr. 'datum')
        });
    }

    return (
      <>
           <Heading as='h2' color='azure'>Registracija</Heading>
     
            <Row>
              <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col sm={12} md={6}>
                      <Form.Group controlId="ime">
                          <Form.Label>Ime</Form.Label>
                          <Form.Control type="text" name="ime" required placeholder="Upiši ime ili korisničko ime"/>
                      </Form.Group>
                    </Col>
                    <Col sm={12} md={6}>
                      <Form.Group controlId="email">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" name="email" required placeholder="Upiši adresu e-pošte"/>
                      </Form.Group>
                    </Col>
              
                    <Col sm={12} md={6}>
                    </Col>
                    <Col sm={12} md={6}>
                      <Form.Group controlId="lozinka" className="mt-2">
                          <Form.Label>Lozinka</Form.Label>
                          <Form.Control type="password" name="lozinka" placeholder="Upiši lozinku" />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row className="mt-4">
                    <Col sm={6} md={6}>
                        <Button type="submit" variant="success" size="sm">
                            Registriraj se
                        </Button>
                    </Col>
                    <Col sm={6} md={6}>
                        <Button variant="danger" size="sm" as={Link} to={RouteNames.KORISNICI}>
                            Odustani
                        </Button>
                    </Col>
                  </Row>
              </Form>
          </Row>
        </>
    );
}