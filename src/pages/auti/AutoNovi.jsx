import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants"
import AutiServices from "../../services/auti/AutiServices"
import Heading from "../../components/UI/Heading";

export default function AtutoNovi() {
    const navigate = useNavigate();

    async function dodaj(auto) {
        const response = await AutiServices.dodaj(auto);
        if (response) {
            navigate(RouteNames.AUTI); // Preusmjeravanje na listu auta
        }
    }

    function handleSubmit(e) {
    e.preventDefault();
    const podatci = new FormData(e.target);

    // Sigurno dohvaćanje ili zadani datum
    const datumOd = podatci.get('datumObjavljeno');
    const datumDo = podatci.get('datumZavrsetak');

    const dateAdded = datumOd ? new Date(datumOd).toISOString() : new Date().toISOString();
    const dateEnds = datumDo ? new Date(datumDo).toISOString() : new Date().toISOString();

    dodaj({
        naziv: podatci.get('naziv') || '',
       opis: podatci.get('opis') || '',
        godinaProizvodnje: parseInt(podatci.get('godinaProizvodnje')) || 0,
        stanje: podatci.get('stanje') || 'očuvan',
       pocetnaCijena: parseFloat(podatci.get('cijena')) || 0,
       dodano: dateAdded,
        zavrsava: dateEnds,
    });
}

    return (
      <>
        <Container>
           <Heading as='h2' color='azure' className="display-2" >Lista auta</Heading>
     

            <Row>
              <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col sm={12} md={6}>
                      <Form.Group controlId="naziv">
                          <Form.Label>Naziv</Form.Label>
                          <Form.Control type="text" name="naziv" required />
                      </Form.Group>
                    </Col>
                    <Col sm={12} md={6}>
                      <Form.Group controlId="opis" className="mt-2">
                          <Form.Label>Opis</Form.Label>
                          <Form.Control as="textarea" rows={3} name="opis" placeholder="Unesite kratki opis vozila..." />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col sm={12} md={6}>
                      <Form.Group controlId="godinaProizvodnje" className="mt-2">
                          <Form.Label>Godina proizvodnje</Form.Label>
                          <Form.Control type="number" name="godinaProizvodnje" step={1} required />
                      </Form.Group>
                    </Col>
                    <Col sm={12} md={6}>
                      <Form.Group controlId="stanje" className="mt-2">
                          <Form.Label>Stanje</Form.Label>
                          <Form.Control type="text" name="stanje" placeholder="npr. očuvan, treba restauraciju..." />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Col sm={12} md={6}>
                    <Form.Group controlId="cijena" className="mt-2">
                        <Form.Label>Početna cijena (€)</Form.Label>
                        <Form.Control type="number" name="cijena" step={0.01} required />
                    </Form.Group>
            </Col>
              <Row>
                <Col sm={12} md={6}>
                    <Form.Group controlId="datumObjavljeno" className="mt-2">
                
                          <Form.Label>Datum objave</Form.Label>
                          <Form.Control type="date" name="datumObjavljeno" required />
                                            </Form.Group>
                        </Col>
                    <Col sm={12} md={6}>
                      <Form.Group controlId="datumZavrsetak" className="mt-2">
                          <Form.Label>Datum završetka aukcije</Form.Label>
                          <Form.Control type="date" name="datumZavrsetak" required />
                      </Form.Group>
                    </Col>
              </Row>
              <Row>
                    <Col sm={6} md={6}>
                            <Button type="submit" variant="success" className="w-100">
                                Dodaj
                            </Button>
                        </Col>
                        <Col sm={6} md={6}>
                            <Link to={RouteNames.AUTI} className="btn btn-danger w-100">
                                Odustani
                            </Link>
                        </Col>
                    
                      </Row>
              
              </Form>
          </Row>
          </Container>
        </>
    );
}