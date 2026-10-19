import {
  Button,
  Col,
  Container,
  Form,
  FormSelect,
  FormControl,
  FormLabel,
  Row,
} from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { RouteNames } from "../../constants";
import { useEffect, useState } from "react";
import PredmetiServices from "../../services/predmeti/PredmetiServices";
import KategorijeServices from "../../services/kategorije/KategorijeServices";
import Heading from "../../components/UI/Heading"

export default function PredmetiPromijena() {
  const navigate = useNavigate();
  const params = useParams();
  const [predmet, setPredmet] = useState(null);
  const [kategorije, setKategorije] = useState([]);
  const [odabranaKategorija, setOdabranaKategorija] = useState("");

  useEffect(() => {
    ucitajPodatke();
  }, [params.id]);

  async function ucitajPodatke() {
    try {
      const [resKategorije, resPredmet] = await Promise.all([
        KategorijeServices.get(),
        PredmetiServices.getByID(params.id)
      ]);

      const katLista = resKategorije.data || resKategorije || [];
      setKategorije(katLista);

      const siroviPodaci = resPredmet.data !== undefined ? resPredmet.data : resPredmet;
      const s = siroviPodaci.data !== undefined ? siroviPodaci.data : siroviPodaci;

      if (!s || Object.keys(s).length === 0) {
        console.error("Predmet nije pronađen!");
        return;
      }

      const formatirajZaInput = (datumStr) => {
        if (!datumStr) return "";
        return datumStr.substring(0, 19);
      };

      if (s.dodano) s.dodano = formatirajZaInput(s.dodano);
      if (s.zavrsava) s.zavrsava = formatirajZaInput(s.zavrsava);

      setPredmet(s);

      // Pronalazimo točnu kategoriju prema ID-u ili nazivu
      const pronadjenaKat = katLista.find(
        (k) => k.id === s.kategorija || k.naziv === s.kategorija
      );

      if (pronadjenaKat) {
        setOdabranaKategorija(String(pronadjenaKat.id));
      } else if (s.kategorija !== undefined && s.kategorija !== null) {
        setOdabranaKategorija(String(s.kategorija));
      }
    } catch (error) {
      console.error("Greška kod učitavanja podataka za promjenu:", error);
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

    const katVrijednost = odabranaKategorija;
    const finalnaKategorija = !isNaN(Number(katVrijednost)) && katVrijednost !== "" 
      ? Number(katVrijednost) 
      : katVrijednost;

    promijeni({
      naziv: dataNew.get("naziv"),
      opis: dataNew.get("opis"),
      godinaNastanka: Number(dataNew.get("godinaNastanka")),
      stanje: dataNew.get("stanje"),
      pocetnaCijena: Number(dataNew.get("pocetnaCijena")),
      dodano: formatDatum(dataNew.get("dodano")),
      zavrsava: formatDatum(dataNew.get("zavrsava")),
      kategorija: finalnaKategorija,
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
      <Heading as="h2" color="azure">
        Promjena predmeta: {predmet.naziv}
      </Heading>

      <Form onSubmit={handleSubmit}>
        <Row className="g-3">
          <Col sm={6} md={6}>
            <Form.Group controlId="kategorija">
              <Form.Label>Kategorija</Form.Label>
              <FormSelect 
                name="kategorija" 
                value={odabranaKategorija} 
                onChange={(e) => setOdabranaKategorija(e.target.value)}
                required
              >
                <option value="" disabled>Odaberi kategoriju...</option>
                {kategorije && kategorije.map((k) => (
                  <option key={k.id} value={String(k.id)}>
                    {k.naziv}
                  </option>
                ))}
              </FormSelect>
            </Form.Group>
          </Col>

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
          <Col xs={6} md={6}>
            <Button type="submit" variant="warning" size="sm" className="w-50">
              Promijeni
            </Button>
          </Col>
          <Col xs={6} md={6}>
            <Button variant="danger" size="sm" className="w-50" onClick={() => navigate(RouteNames.PREDMETI)}>
              Odustani
            </Button>
          </Col>
        </Row>
      </Form>
    </Container>
  );
}