import { Button, Col, Form, FormSelect, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants";
import PredmetiServices from "../../services/predmeti/PredmetiServices";
import KategorijeServices from "../../services/kategorije/KategorijeServices";
import OznakeServices from "../../services/oznake/OznakeServices";
import Heading from "../../components/UI/Heading";
import { useEffect, useState, useRef } from "react";

export default function PredmetNovi() {
  const [kategorije, setKategorije] = useState([]);
  const [oznake, setOznake] = useState([]);
  const [predmeti, setPredmeti] = useState([]);
  
  const [pretragaOznaka, setPretragaOznaka] = useState("");
  const [odabraneOznake, setOdabraneOznake] = useState([]);
  const [prikaziAutoComplete, setPrikaziAutoComplete] = useState(false);
  const [odabraniid, setOdabraniid] = useState(-1);
  
  const autoCompleteRef = useRef(null);
  const navigate = useNavigate(); 

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

  const trenutakDodavanja = new Date();
  const dodanoStr = formatirajZaInput(trenutakDodavanja);
  const trenutakZavrsetka = new Date(trenutakDodavanja.getTime() + 7 * 24 * 60 * 60 * 1000);
  const zavrsavaStr = formatirajZaInput(trenutakZavrsetka);

  useEffect(() => {
    ucitajKategorije();
    ucitajOznake();
    ucitajPredmete();

    function handleClickOutside(event) {
      if (autoCompleteRef.current && !autoCompleteRef.current.contains(event.target)) {
        setPrikaziAutoComplete(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
      setOznake(odgovor.data);
    } catch (error) {
      console.error("Greška kod učitavanja oznaka:", error);
    }
  }

  async function ucitajPredmete() {
    try {
      const odgovor = await PredmetiServices.get();
      setPredmeti(odgovor.data);
    } catch (error) {
      console.error("Greška kod učitavanja predmeta:", error);
    }
  }

  function filtrirajOznake() {
    if (!pretragaOznaka) return [];
    return oznake.filter(o =>
      !odabraneOznake.find(op => op.id === o.id) &&
      o.naziv.toLowerCase().includes(pretragaOznaka.toLowerCase())
    );
  }


  function dodajOznaku(oznaka) {
    setOdabraneOznake([...odabraneOznake, oznaka]);
    setPretragaOznaka("");
    setPrikaziAutoComplete(false);
    setOdabraniid(-1);
  }

  function ukloniOznaku(sifra) {
    setOdabraneOznake(odabraneOznake.filter(o => o.sifra !== sifra));
  }

  function handleKeyDown(e) {
    const filtriraneOznake = filtrirajOznake()
    //if (!prikaziAutoComplete || filtriraneOznake.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setOdabraniid(prev => (prev < filtriraneOznake.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setOdabraniid(prev => (prev > 0 ? prev - 1 : filtriraneOznake.length - 1));
    } else if (e.key === 'Enter' && odabraniid >= 0 && filtriraneOznake.length > 0) {
      e.preventDefault();
      dodajOznaku(filtrirajOznake()[odabraniid]);
    } else if (e.key === 'Escape') {
      setPrikaziAutoComplete(false);
      setOdabraniid(-1);
    }
  }

  async function dodajPredmet(predmet) {
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

    dodajPredmet({
      naziv: podatci.get("naziv") || "",
      kategorija: parseInt(podatci.get("kategorije")) || 0,
      godinaNastanka: parseInt(podatci.get("godinaNastanka")) || 0,
      opis: podatci.get("opis") || "",
      stanje: podatci.get("stanje") || "",
      pocetnaCijena: parseFloat(podatci.get("cijena")) || 0,
      dodano: trenutakDodavanja.toISOString(),
      zavrsava: trenutakZavrsetka.toISOString(),
      oznake: odabraneOznake.map(o => o.id) 
    });
  }

  return (
    <>
      <Heading as="h2" color="azure">
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

                <Col sm={6} md={6} ref={autoCompleteRef} style={{ position: 'relative' }}>
            <Form.Group controlId="oznakePretraga">
              <Form.Label>Oznake (Pretraži i dodaj)</Form.Label>
              <Form.Control
                type="text"
                placeholder="Upišite naziv oznake..."
                value={pretragaOznaka}
                onChange={(e) => {
                  setPretragaOznaka(e.target.value);
                  setPrikaziAutoComplete(true);
                  setOdabraniid(-1);
                }}
                onKeyDown={handleKeyDown}
                onFocus={() => setPrikaziAutoComplete(true)}
              />
            </Form.Group>

            {prikaziAutoComplete && filtrirajOznake().length > 0 && (
              <ul className="list-group position-absolute w-100 shadow" style={{ zid: 1000, maxHeight: '200px', overflowY: 'auto' }}>
                {filtrirajOznake().map((oznaka, id) => (
                  <li
                    key={oznaka.id}
                    className={`list-group-item list-group-item-action ${id === odabraniid ? 'active' : ''}`}
                    style={{ cursor: 'pointer' }}
                    onClick={() => dodajOznaku(oznaka)}
                  >
                    {oznaka.naziv}
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-2">
              {odabraneOznake.map((oznaka) => (
                <span key={oznaka.id} className="badge bg-secondary me-1 p-2">
                  {oznaka.naziv}{" "}
                  <span 
                    style={{ cursor: 'pointer', marginLeft: '5px', fontWeight: 'bold' }} 
                    onClick={() => ukloniOznaku(oznaka.sifra)}
                  >
                    &times;
                  </span>
                </span>
              ))}
            </div>
          </Col>
          
        
          <Col sm={6} md={6}>
            <Form.Group controlId="opis">
              <Form.Label>Opis</Form.Label>
              <Form.Control
                as="textarea"
                name="opis"
                rows={3}
              />
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
              <Form.Label>Dodano</Form.Label>
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
              <Form.Label>Završava (+7 dana)</Form.Label>
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

        <Row className="mt-4">
          <Col sm={6} md={6}>
            <Button type="submit" variant="success" size="sm" className="w-50">
              Dodaj
            </Button>
          </Col>
          <Col sm={6} md={6}>
             <Button variant="danger" size="sm" className="w-50">
              <Link to={RouteNames.PREDMETI} style={{ color: 'white', textDecoration: 'none' }}>Odustani</Link>
            </Button>
          </Col>
        </Row>
      </Form>
    </>
  );
}