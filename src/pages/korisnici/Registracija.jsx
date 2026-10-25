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
            navigate(RouteNames.KORISNICI); // Preusmjeravanje uvijek nakon uspješnog slanja
        } catch (error) {
            console.error("Greška prilikom dodavanja auta:", error);
        }
    }

    function handleSubmit(e) {
        e.preventDefault();
        const podatci = new FormData(e.target);

        // 1. Trenutni datum i vrijeme (kada se oglas dodaje)
        const datumObjave = new Date();
        const dateAdded = datumObjave.toISOString();

       
        dodaj({
            ime: podatci.get('ime') || '',
            email: podatci.get('email') || '',
            dodano: dateAdded,    // Trenutni datum

        });
    }

    return (
      <>
        <Container>
           <Heading as='h2' color='azure' >Registracija</Heading>
     
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
                      <Form.Group controlId="email" >
                    <Form.Label>email</Form.Label>
                      <Form.Control type="text" name="email" required placeholder="Upiši adresu e-pošte"/>
                        
                      </Form.Group>
                    </Col>
              
                    <Col sm={12} md={6}>
                    
                    </Col>
                    <Col sm={12} md={6}>
                      <Form.Group controlId="stanje" className="mt-2">
                          <Form.Label>lozinka</Form.Label>
                          <Form.Control type="text" name="lozinka" placeholder="upisi lozinku" />
                      </Form.Group>
                    </Col>
                  </Row>

             

                  <Row className="mt-4">
                    <Col sm={6}  md={6}>
                        <Button type="submit" variant="success" size="sm" className="w-50">
                            Registriraj se
                        </Button>
                    </Col>
                    <Col sm={6}  md={6}>
                        <Button variant="danger" size="sm" className="w-50">
                          <Link to={RouteNames.KORISNICI}>Odustani </Link>
                        </Button>
                    </Col>
                  </Row>
              </Form>
          </Row>
          </Container>
        </>
    );
}