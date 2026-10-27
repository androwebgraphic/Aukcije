import { useEffect, useState } from "react";
import { Container, Row, Col, Button, Form, Alert } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { RouteNames } from "../../constants";
import Heading from "../../components/UI/Heading";
import OznakeServices from "../../services/oznake/OznakeServices";
import { oznake } from "../../services/oznake/OznakeData";

export default function OznakePromijena() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [naziv, setNaziv] = useState("");
  const [sveOznake, setSveOznake] = useState([]);
  const [odabranaOznaka, setOdabranaOznaka] = useState("");
  const [greska, setGreska] = useState("");

  useEffect(() => {
    ucitajPodatke();
  }, [id]);

  async function ucitajPodatke() {
    try {
      // Istovremeno dohvaćamo sve oznake i pojedinačnu oznaku prema ID-ju
      const [resSve, resPojedinacna] = await Promise.all([
        OznakeServices.get(),
        OznakeServices.getByID(id),
      ]);

      const lista = resSve?.data || resSve || [];
      if (Array.isArray(lista)) {
        // Filtriramo da trenutna oznaka ne bude ponuđena sama sebi u padajućem izborniku
        setSveOznake(lista.filter((c) => Number(c.id) !== Number(id)));
      }

      const oznakaPodaci = resPojedinacna?.data !== undefined ? resPojedinacna.data : resPojedinacna;
      if (oznakaPodaci) {
        setNaziv(oznakaPodaci.naziv || "");
        if (oznakaPodaci.oznaka !== undefined && oznakaPodaci.oznaka !== null) {
          setOdabranaOznaka(String(oznakaPodaci.oznaka));
        }
      }
    } catch (error) {
      console.error("Greška pri učitavanju podataka:", error);
      setGreska("Greška prilikom dohvaćanja podataka s poslužitelja.");
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const podaci = {
        naziv: naziv,
        oznaka: odabranaOznaka ? Number(odabranaOznaka) : null,
      };

      // Pozivamo izmjenu prosljeđujući točan ID iz URL-a
      await OznakeServices.promijeni(id, podaci);
      navigate(RouteNames.OZNAKE);
    } catch (error) {
      console.error("Greška pri spremanju:", error);
      setGreska("Greška prilikom spremanja promjena.");
    }
  }

  return (
    <Container className="my-4">
      <Heading as="h2" color="azure" className="mb-3">
        Promjena oznake: {naziv}
      </Heading>

      {greska && <Alert variant="danger">{greska}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Row className="g-3">
          <Col sm={12} md={6}>
            <Form.Group controlId="naziv">
              <Form.Label>Naziv</Form.Label>
              <Form.Control
                type="text"
                value={naziv}
                onChange={(e) => setNaziv(e.target.value)}
                required
              />
            </Form.Group>
          </Col>

          {/* <Col sm={6} md={6}>
            <Form.Group controlId="oznaka">
              <Form.Label>Oznaka</Form.Label>
              <Form.Select
                value={odabranaOznaka}
                onChange={(e) => setOdabranaOznaka(e.target.value)}
              >
                <option value="">Odaberi oznaku...</option>
                {sveOznake.map((c) => (
                  <option key={c.id} value={String(c.id)}>
                    {c.naziv}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col> */}
        </Row>

        <hr className="my-4" />

        <Row>
          <Col xs={6} md={6}>
            <Button type="submit" variant="warning" size="sm" className="w-50">
              Promijeni
            </Button>
          </Col>
          <Col xs={6} md={6}>
            <Button
              variant="danger"
              size="sm"
              className="w-50"
              onClick={() => navigate(RouteNames.OZNAKE)}
            >
              Odustani
            </Button>
          </Col>
        </Row>
      </Form>
    </Container>
  );
}