import { Button, Col, Container, Form, FormSelect, FormControl, FormLabel, Row, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants";
import { useEffect, useState, useRef } from "react";
import PredmetiServices from "../../services/predmeti/PredmetiServices";
import KategorijeServices from "../../services/kategorije/KategorijeServices";
import OznakeServices from "../../services/oznake/OznakeServices";
import Heading from "../../components/UI/Heading";

export default function PredmetiNovi() {
  const navigate = useNavigate();
  
  const [predmet, setPredmet] = useState({
    naziv: "",
    opis: "",
    godinaNastanka: "",
    stanje: "",
    pocetnaCijena: "",
    dodano: "",
    zavrsava: ""
  });
  
  const [kategorije, setKategorije] = useState([]);
  const [oznake, setOznake] = useState([]);
  const [odabranaKategorija, setOdabranaKategorija] = useState("");

  const [pretragaOznaka, setPretragaOznaka] = useState("");
  const [odabraneOznake, setOdabraneOznake] = useState([]);
  const [prikaziAutoComplete, setPrikaziAutoComplete] = useState(false);

  const [slike, setSlike] = useState([]);
  const [slikeError, setSlikeError] = useState("");

  const autoCompleteRef = useRef(null);

  useEffect(() => {
    ucitajPodatke();
    function handleClickOutside(event) {
      if (autoCompleteRef.current && !autoCompleteRef.current.contains(event.target)) {
        setPrikaziAutoComplete(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function ucitajPodatke() {
    try {
      const resKategorije = await KategorijeServices.get();
      setKategorije(resKategorije.data || resKategorije || []);

      const resOznake = await OznakeServices.get();
      setOznake(resOznake.data || resOznake || []);
    } catch (error) { 
      console.error("Greška pri učitavanju podataka:", error); 
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setPredmet(prev => ({ ...prev, [name]: value }));
  }

  function filtrirajOznake() {
    return oznake.filter(o => 
      !odabraneOznake.some(op => String(op.id) === String(o.id)) && 
      o.naziv.toLowerCase().includes(pretragaOznaka.toLowerCase())
    );
  }

  function dodajOznaku(oznaka) {
    if (odabraneOznake.some(o => String(o.id) === String(oznaka.id))) return;
    setOdabraneOznake([...odabraneOznake, oznaka]); 
    setPretragaOznaka(""); 
    setPrikaziAutoComplete(false);
  }

  function handleImageChange(e) {
    const odabrane = Array.from(e.target.files);
    if (slike.length + odabrane.length > 5) {
      setSlikeError("Ukupno najviše 5 slika.");
      return;
    }
    setSlikeError("");

    Promise.all(odabrane.map(f => new Promise((resolve, reject) => {
      const r = new FileReader(); 
      r.readAsDataURL(f); 
      r.onload = () => resolve(r.result); 
      r.onerror = reject;
    }))).then(base64Slike => {
      setSlike(prev => [...prev, ...base64Slike]);
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (slikeError) return;

    try {
      await PredmetiServices.dodaj({
        naziv: predmet.naziv,
        opis: predmet.opis,
        godinaNastanka: predmet.godinaNastanka ? Number(predmet.godinaNastanka) : null,
        stanje: predmet.stanje,
        pocetnaCijena: predmet.pocetnaCijena ? Number(predmet.pocetnaCijena) : null,
        dodano: predmet.dodano ? new Date(predmet.dodano).toISOString() : null,
        zavrsava: predmet.zavrsava ? new Date(predmet.zavrsava).toISOString() : null,
        kategorija: odabranaKategorija ? Number(odabranaKategorija) : null,
        oznake: odabraneOznake.map(o => o.id),
        slike: slike
      });
      navigate(RouteNames.PREDMETI);
    } catch (error) {
      console.error("Greška prilikom dodavanja predmeta:", error);
    }
  }

  return (
    <Container className="mt-4">
      <Heading as="h2" color="azure" className="mb-4">Dodavanje novog predmeta</Heading>
      <Form onSubmit={handleSubmit}>
        <Row className="g-3">
          {/* Naziv */}
          <Col sm={12} md={6}>
            <Form.Group controlId="naziv">
              <FormLabel>Naziv</FormLabel>
              <FormControl type="text" name="naziv" required value={predmet.naziv} onChange={handleChange} placeholder="Unesite naziv predmeta" />
            </Form.Group>
          </Col>

          {/* Kategorija */}
          <Col sm={6} md={6}>
            <Form.Group controlId="kategorija">
              <FormLabel>Kategorija</FormLabel>
              <FormSelect value={odabranaKategorija} onChange={(e) => setOdabranaKategorija(e.target.value)} required>
                <option value="">Odaberi kategoriju</option>
                {kategorije.map(k => <option key={k.id} value={String(k.id)}>{k.naziv}</option>)}
              </FormSelect>
            </Form.Group>
          </Col>

          {/* OZNAKE (Autocomplete) */}
          <Col sm={12} md={6} ref={autoCompleteRef} style={{ position: 'relative' }}>
            <Form.Group controlId="oznakePretraga">
              <FormLabel>Oznake</FormLabel>
              <FormControl 
                type="text" 
                value={pretragaOznaka} 
                placeholder="Pretraži i dodaj oznake..." 
                onChange={(e) => { setPretragaOznaka(e.target.value); setPrikaziAutoComplete(true); }} 
                onFocus={() => setPrikaziAutoComplete(true)}
              />
            </Form.Group>
            {prikaziAutoComplete && filtrirajOznake().length > 0 && (
              <ul className="list-group position-absolute w-100 shadow" style={{ zIndex: 1000, maxHeight: '200px', overflowY: 'auto' }}>
                {filtrirajOznake().map((o) => (
                  <li key={o.id} className="list-group-item list-group-item-action" style={{cursor:'pointer'}} onClick={() => dodajOznaku(o)}>
                    {o.naziv}
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-2 d-flex flex-wrap gap-1">
              {odabraneOznake.map(o => (
                <span key={o.id} className="badge bg-secondary p-2 d-flex align-items-center gap-1">
                  {o.naziv} 
                  <span style={{cursor:'pointer', fontWeight: 'bold'}} onClick={() => setOdabraneOznake(odabraneOznake.filter(x => x.id !== o.id))}>&times;</span>
                </span>
              ))}
            </div>
          </Col>

          {/* Opis */}
          <Col sm={12} md={6}>
            <Form.Group controlId="opis">
              <FormLabel>Opis</FormLabel>
              <FormControl as="textarea" name="opis" rows={3} value={predmet.opis} onChange={handleChange} placeholder="Unesite opis predmeta" />
            </Form.Group>
          </Col>

          {/* Godina nastanka */}
          <Col xs={6} md={3}>
            <Form.Group controlId="godinaNastanka">
              <FormLabel>Godina nastanka</FormLabel>
              <FormControl type="number" name="godinaNastanka" value={predmet.godinaNastanka} onChange={handleChange} />
            </Form.Group>
          </Col>

          {/* Stanje */}
          <Col xs={6} md={3}>
            <Form.Group controlId="stanje">
              <FormLabel>Stanje</FormLabel>
              <FormControl type="text" name="stanje" value={predmet.stanje} onChange={handleChange} placeholder="npr. Odlično" />
            </Form.Group>
          </Col>

          {/* Početna cijena */}
          <Col xs={6} md={3}>
            <Form.Group controlId="pocetnaCijena">
              <FormLabel>Početna cijena (€)</FormLabel>
              <FormControl type="number" step="0.01" name="pocetnaCijena" value={predmet.pocetnaCijena} onChange={handleChange} />
            </Form.Group>
          </Col>

          {/* Dodano */}
          <Col xs={6} md={3}>
            <Form.Group controlId="dodano">
              <FormLabel>Dodano</FormLabel>
              <FormControl type="datetime-local" name="dodano" value={predmet.dodano} onChange={handleChange} />
            </Form.Group>
          </Col>

          {/* Završava */}
          <Col xs={6} md={3}>
            <Form.Group controlId="zavrsava">
              <FormLabel>Završava</FormLabel>
              <FormControl type="datetime-local" name="zavrsava" value={predmet.zavrsava} onChange={handleChange} />
            </Form.Group>
          </Col>

          {/* SLIKE (Upload i Pregled) */}
          <Col sm={12}>
            <Form.Group className="mb-3">
              <Form.Label>Slike predmeta (maksimalno 5)</Form.Label>
              <FormControl type="file" multiple accept="image/*" onChange={handleImageChange} />
              {slikeError && <Alert variant="danger" className="mt-2">{slikeError}</Alert>}
            </Form.Group>

            {slike.length > 0 && (
              <div className="mb-3">
                <Form.Label className="text-muted small">Pregled odabranih slika:</Form.Label>
                <div className="d-flex flex-wrap gap-2">
                  {slike.map((s, i) => (
                    <div key={i} className="position-relative">
                      <img src={s} alt={`Upload ${i}`} style={{ width: '100px', height: '100px', objectFit: 'cover' }} className="rounded border shadow-sm" />
                      <Button variant="danger" size="sm" className="position-absolute top-0 end-0 p-0 px-1 rounded-circle" onClick={() => setSlike(slike.filter((_, idx) => idx !== i))}>&times;</Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Col>
        </Row>

        {/* Gumbi */}
        <Row className="mt-4 mb-4">
          <Col xs={6}><Button type="submit" variant="success" className="w-50">Dodaj</Button></Col>
          <Col xs={6}><Button variant="danger" className="w-50" onClick={() => navigate(RouteNames.PREDMETI)}>Odustani</Button></Col>
        </Row>
      </Form>
    </Container>
  );
}