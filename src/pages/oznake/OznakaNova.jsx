import { Button, Col, Form, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { RouteNames } from "../../constants";
import OznakeServices from "../../services/oznake/OznakeServices";
import Heading from "../../components/UI/Heading";
import { FaPlus } from "react-icons/fa";
import useLoading from "../../hooks/useLoading";

 
export default function OznakaNova() {
  const navigate = useNavigate();
    const { showLoading, hideLoading, postaviNaslov } = useLoading()
   useEffect(() => {
       postaviNaslov('Oznake-dodajoznaku')
    }, [])
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

        <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-4 forma-akcije">
          <Button type="submit" variant="outline-success">
            <FaPlus className="me-2" aria-hidden="true" />
            Dodaj
          </Button>
          <Button
            type="button"
            variant="outline-danger"
            onClick={() => navigate(RouteNames.OZNAKE)}>
            Odustani
          </Button>
        </div>
      </Form>
      </>
   
  );
}