import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants"
import ViniliServices from "../../services/vinili/ViniliServices"
import Heading from "../../components/UI/Heading";

export default function VinillNovi() {
    const navigate = useNavigate();

   async function dodaj(vinil) {
        try {
            await ViniliServices.dodaj(vinil);
          navigate(RouteNames.VINILI); // Preusmjeravanje uvijek nakon uspješnog slanja
          console.log(Spremljeno)
        } catch (error) {
            console.error("Greška prilikom dodavanja vinilaa:", error);
        }
    }

    function handleSubmit(e) {
        e.preventDefault();
        const podatci = new FormData(e.target);

        // 1. Trenutni datum i vrijeme (kada se oglas dodaje)
        const datumObjave = new Date();
        const dateAdded = datumObjave.toISOString();

        // 2. Automatski izračun: datum objave + 7 dana
        const datumZavrsetka = new Date(datumObjave);
        datumZavrsetka.setDate(datumZavrsetka.getDate() + 7);
        const dateEnds = datumZavrsetka.toISOString();

        dodaj({
            naziv: podatci.get('naziv') || '',
            opis: podatci.get('opis') || '',
            godinaProizvodnje: parseInt(podatci.get('godinaProizvodnje')) || 0,
            stanje: podatci.get('stanje') || 'očuvan',
            pocetnaCijena: parseFloat(podatci.get('cijena')) || 0,
            dodano: dateAdded,    // Trenutni datum
            zavrsava: dateEnds,   // Datum automatski pomaknut za 7 dana unaprijed
        });
    }

    return (
      <>
        <Container>
           <Heading as='h2' color='azure' className="display-2">Dodaj vinil</Heading>
     
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
                          <Form.Control as="textarea" rows={3} name="opis" placeholder="Unesite kratki opis vinila..." />
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

                  <Row>
                    <Col sm={3}>
                      <Form.Group controlId="cijena" className="mt-2">
                          <Form.Label>Početna cijena (€)</Form.Label>
                          <Form.Control type="number" name="cijena" step={0.01} required />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row className="mt-4">
                    <Col sm={6} md={6}>
                        <Button type="submit" variant="success" className="w-100">
                            Dodaj
                        </Button>
                    </Col>
                    <Col sm={6} md={6}>
                        <Link to={RouteNames.VINILI} className="btn btn-danger w-100">
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