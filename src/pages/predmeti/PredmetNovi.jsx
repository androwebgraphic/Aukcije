import { Button, Col, Container, Form, FormSelect, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants";
import PredmetiServices from "../../services/predmeti/PredmetiServices";
import KategorijeServices from "../../services/kategorije/KategorijeServices";
import OznakeServices from "../../services/oznake/OznakeServices";
import Heading from "../../components/UI/Heading";
import { useEffect, useState } from "react";


export default function PredmetNovi() {
  const [kategorije, setKategorije] = useState([]);
  const [oznaka, setOznaka] = useState([]); // Stanje za oznake
  const [odabraniPredmeti, setOdabraniPredmeti] = useState([])
  const [odabranaOznaka, setOdabranaOznaka] = useState('')
  const [pretragaOznaka, setPretragaOznaka] = useState('')
  const [prikazAutoComplete, setAutocomplete] = useState(false)
  const [odabraniIndex,setOdabraniIndex] = useState(-1)
  const navigate = useNavigate(); 

  // Pomoćna funkcija za formatiranje datuma u YYYY-MM-DDTHH:mm:ss (uključujući sekunde)
  const formatirajZaInput = (d) => {
    const pad = (n) => (n < 10 ? "0" + n : n);
    return (
      d.getFullYear() +
      "-" +
      pad(d.getMonth() + 1) +
      "-" +
      pad(d.getDate()) +
      "T" +
      pad(d.getHours()) +
      ":" +
      pad(d.getMinutes()) +
      ":" +
      pad(d.getSeconds())
    );
  };

  // Trenutni trenutak u sekundu kada se forma učitala
  const trenutakDodavanja = new Date();
  const dodanoStr = formatirajZaInput(trenutakDodavanja);

  // Izračun točno 7 dana poslije u sekundu
  const trenutakZavrsetka = new Date(trenutakDodavanja.getTime() + 7 * 24 * 60 * 60 * 1000);
  const zavrsavaStr = formatirajZaInput(trenutakZavrsetka);

  useEffect(() => {
    ucitajKategorije()

    ucitajOznake()

  }, []);

  async function ucitajKategorije() {
    try {
      const odgovor = await KategorijeServices.get();
      setKategorije(odgovor.data);
    } catch (error) {
      console.error("Greška kod učitavanja kategorija:", error);
    }
  }

  async function ucitajOznake() {
    try {
      const odgovor = await OznakeServices.get();
      setOznaka(odgovor.data);
    } catch (error) {
      console.error("Greška kod učitavanja oznaka:", error);
    }
  }



  async function dodaj(predmet) {
    try {
      await PredmetiServices.dodaj(predmet);
      navigate(RouteNames.PREDMETI); 
    } catch (error) {
      console.error("Greška prilikom dodavanja predmeta:", error);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    const podatci = new FormData(e.target);

    dodaj({
      naziv: podatci.get("naziv") || "",
      kategorija: parseInt(podatci.get('kategorije')) || 0,
      godinaNastanka: parseInt(podatci.get("godinaNastanka")) || 0,
      opis: podatci.get('opis') || "",
      stanje: podatci.get('stanje'),
      pocetnaCijena: parseFloat(podatci.get("cijena")) || 0,
      dodano: trenutakDodavanja.toISOString(),
      zavrsava: trenutakZavrsetka.toISOString(),
      oznaka:podatci.get("oznaka")

    
    });
  }

  return (
    <>
      <Heading as="h2" color="azure" >
        Dodaj predmet
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

          <Col sm={6} md={6}>
            <Form.Group controlId="kategorije">
              <Form.Label>Kategorija</Form.Label>
              <FormSelect name="kategorije" required>
                <option value="">Odaberi kategoriju...</option>
                {kategorije && kategorije.map((k) => (
                  <option key={k.id} value={k.id}>
                    {k.naziv}
                  </option>
                ))}
              </FormSelect>
            </Form.Group>
          </Col>


        
          <Col sm={6} md={6}>
            <Form.Group controlId="opis">
              <Form.Label>Opis</Form.Label>
              <Form.Control
                as="textarea"
                name="opis"
              />
            </Form.Group>
          </Col>
                    <Col sm={6} md={6}>
            <Form.Group controlId="oznake">
              <Form.Label>Oznake</Form.Label>
              <FormSelect name="oznake" required>
                <option value="">Odaberi oznaku...</option>
                {oznaka && oznaka.map((o) => (
                  <option key={c.id} value={c.id}>
                    {c.naziv}
                  </option>
                ))}
              </FormSelect>
            </Form.Group>
          </Col>

          <Col xs={6} md={3}>
            <Form.Group controlId="godinaNastanka">
              <Form.Label>Godina nastanka</Form.Label>
              <Form.Control
                type="number"
                name="godinaNastanka"
              />
            </Form.Group>
          </Col>

          <Col xs={6} md={3}>
            <Form.Group controlId="stanje">
              <Form.Label>Stanje</Form.Label>
              <Form.Control
                type="text"
                name="stanje"
                defaultValue=""
              />
            </Form.Group>
          </Col>
          {/* <Col xs={6} md={3}>
            <Form.Group controlId="oznake">
              <Form.Label>Oznake</Form.Label>
              <Form.Control
                type="text"
                name="oznake"
                defaultValue=""
              />
            </Form.Group>
          </Col> */}

          <Col xs={6} md={3}>
            <Form.Group controlId="cijena">
              <Form.Label>Početna cijena</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                name="cijena"
              />
            </Form.Group>
          </Col>

          <Col sm={6} md={3}>
            <Form.Group controlId="dodano">
              <Form.Label>dodano</Form.Label>
              <Form.Control
                type="datetime-local"
                step="1"
                name="dodano"
                defaultValue={dodanoStr}
                readOnly
                style={{ backgroundColor: "#e9ecef" }}
              />
            </Form.Group>
          </Col>
              
          <Col sm={6} md={3}>
            <Form.Group controlId="zavrsava">
              <Form.Label>završava(+7 dana)</Form.Label>
              <Form.Control
                type="datetime-local"
                step="1"
                name="zavrsava"
                defaultValue={zavrsavaStr}
                readOnly
                style={{ backgroundColor: "#e9ecef" }}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mt-4 ">
          <Col sm={6} md={6}>
            <Button type="submit" variant="success" size="sm" className="w-50">
              Dodaj
            </Button>
          </Col>
          <Col sm={6} md={6} >
             <Button variant="danger" size="sm" className="w-50 " >
              <Link to={RouteNames.PREDMETI} style={{ color: 'white', textDecoration: 'none' }}>Odustani</Link>
            </Button>
          </Col>
        </Row>
      </Form>
    </>
  );
}