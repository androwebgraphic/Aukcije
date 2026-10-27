import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants";
import OznakeServices from "../../services/oznake/OznakeServices";
import Heading from "../../components/UI/Heading";

export default function OznakaNova() {
  const navigate = useNavigate();

  async function dodaj(oznaka) {
    try {
      await OznakeServices.dodaj(oznaka);
      navigate(RouteNames.OZNAKE); // Pretpostavka da postoji ruta OZNAKE
    } catch (error) {
      console.error("Greška prilikom dodavanja oznake:", error);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    const podatci = new FormData(e.target);

    dodaj({
      naziv: podatci.get("naziv") || ""
    });
  }

  return (
<>
      <Heading as="h2" color="azure">
        Dodaj oznaku
      </Heading>

      <Form onSubmit={handleSubmit}>
        <Row className="g-3">
          <Col sm={12} md={6}>
            <Form.Group controlId="naziv">
              <Form.Label>Naziv</Form.Label>
              <Form.Control
                type="text"
                name="naziv"
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mt-4">
          <Col sm={6} md={3}>
            <Button type="submit" variant="success" size="sm" className="w-100">
              Dodaj
            </Button>
          </Col>
          <Col sm={6} md={3}>
        
              <Link to={RouteNames.OZNAKE} style={{ color: 'white', textDecoration: 'none' }}>
                <Button size="sm" variant="danger">Odustani</Button>
              </Link>
          
          </Col>
        </Row>
      </Form>
      </>
   
  );
}