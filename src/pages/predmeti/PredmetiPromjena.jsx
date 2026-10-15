import {
  Button,
  Col,
  Container,
  Form,
  FormControl,
  FormLabel,
  Row,
} from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { RouteNames } from "../../constants";
import { useEffect, useState } from "react";
import PredmetiServices from "../../services/predmeti/PredmetiServices";
import Heading from "../../components/UI/Heading";

export default function PredmetiPromijena() {
  const navigate = useNavigate();
  const params = useParams();
  const [predmet, setPredmet] = useState(null);

  useEffect(() => {
    ucitajPredmet();
  }, []);

  async function ucitajPredmet() {
    try {
      // Ako tvoj servis koristi samo .get(params.id) umjesto getByID, promijeni dolje u PredmetiServices.get(params.id)
      const odgovor = await PredmetiServices.getByID(params.id);
      console.log("Dohvaćeni predmet za promjenu:", odgovor);

      const s = odgovor.data || odgovor || {};

      // Pomoćna funkcija za formatiranje datuma u YYYY-MM-DDTHH:mm:ss
      const formatirajZaInput = (datumStr) => {
        if (!datumStr) return "";
        return datumStr.substring(0, 19);
      };

      if (s.dodano) s.dodano = formatirajZaInput(s.dodano);
      if (s.zavrsava) s.zavrsava = formatirajZaInput(s.zavrsava);

      setPredmet(s);
    } catch (error) {
      console.error("Greška kod učitavanja predmeta za promjenu:", error);
    }
  }

  async function promijeni(predmetPodaci) {
    try {
      await PredmetiServices.promijeni(params.id, predmetPodaci);
      navigate(RouteNames.PREDMETI);
    } catch (error) {
      console.error("Greška prilikom izmjene predmeta:", error);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    const dataNew = new FormData(e.currentTarget);

    const formatDatum = (d) => (d ? new Date(d).toISOString() : null);

    promijeni({
      naziv: dataNew.get("naziv"),
      opis: dataNew.get("opis"),
      godinaNastanka: Number(dataNew.get("godinaNastanka")),
      stanje: dataNew.get("stanje"),
      pocetnaCijena: Number(dataNew.get("pocetnaCijena")),
      dodano: formatDatum(dataNew.get("dodano")),
      zavrsava: formatDatum(dataNew.get("zavrsava")),
    });
  }

  if (!predmet) {
    return (
      <Container className="my-4">
        <Heading as="h4" color="azure">Učitavanje podataka predmeta...</Heading>
      </Container>
    );
  }

  return (
    <Container className="my-4">
      <Heading as="h2" color="azure" className="display-2 mb-4">
        Promjena predmeta: {predmet.naziv}
      </Heading>

      <Form onSubmit={handleSubmit}>
        <Row className="g-3">
          <Col sm={12} md={6}>
            <Form.Group controlId="naziv">
              <FormLabel>Naziv</FormLabel>
              <FormControl
                type="text"
                name="naziv"
                required
                defaultValue={predmet.naziv || ""}
              />
            </Form.Group>
          </Col>

          <Col sm={12} md={12}>
            <Form.Group controlId="opis">
              <FormLabel>Opis</FormLabel>
              <FormControl
                as="textarea"
                name="opis"
                rows={3}
                defaultValue={predmet.opis || ""}
              />
            </Form.Group>
          </Col>

          <Col sm={12} md={6}>
            <Form.Group controlId="godinaNastanka">
              <FormLabel>Godina nastanka</FormLabel>
              <FormControl
                type="number"
                name="godinaNastanka"
                defaultValue={predmet.godinaNastanka || ""}
              />
            </Form.Group>
          </Col>

          <Col sm={12} md={6}>
            <Form.Group controlId="stanje">
              <FormLabel>Stanje</FormLabel>
              <FormControl
                type="text"
                name="stanje"
                defaultValue={predmet.stanje || ""}
              />
            </Form.Group>
          </Col>

          <Col sm={12} md={6}>
            <Form.Group controlId="pocetnaCijena">
              <FormLabel>Početna cijena</FormLabel>
              <FormControl
                type="number"
                step="0.01"
                name="pocetnaCijena"
                defaultValue={predmet.pocetnaCijena || ""}
              />
            </Form.Group>
          </Col>

          <Col sm={12} md={6}>
            <Form.Group controlId="dodano">
              <FormLabel>Datum i sat dodavanja</FormLabel>
              <FormControl
                type="datetime-local"
                step="1"
                name="dodano"
                defaultValue={predmet.dodano || ""}
              />
            </Form.Group>
          </Col>

          <Col sm={12} md={6}>
            <Form.Group controlId="zavrsava">
              <FormLabel>Datum i sat završetka</FormLabel>
              <FormControl
                type="datetime-local"
                step="1"
                name="zavrsava"
                defaultValue={predmet.zavrsava || ""}
              />
            </Form.Group>
          </Col>
        </Row>

        <hr className="my-4" />
        <Row>
          <Col sm={6} md={6}>
            <Button type="submit" variant="warning" className="w-100">
              Promijeni
            </Button>
          </Col>
          <Col sm={6} md={6}>
            <Button
              type="button"
              variant="danger"
              className="w-100"
              onClick={() => navigate(RouteNames.PREDMETI)}
            >
              Odustani
            </Button>
          </Col>
        </Row>
      </Form>
    </Container>
  );
}