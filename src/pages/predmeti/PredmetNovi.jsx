import { Button, Col, Container, Form, FormSelect, FormControl, FormLabel, Row, Alert, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants";
import { useEffect, useState, useRef } from "react";
import PredmetiServices from "../../services/predmeti/PredmetiServices";
import KategorijeServices from "../../services/kategorije/KategorijeServices";
import OznakeServices from "../../services/oznake/OznakeServices";
import Heading from "../../components/UI/Heading";

export default function PredmetNovi() {
  const navigate = useNavigate();
  
  // Pomoćna funkcija za formatiranje datuma za datetime-local input ("YYYY-MM-DDTHH:mm")
  const formatZaDateTimeLocal = (date) => {
    const d = new Date(date);
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  const [predmet, setPredmet] = useState({
    naziv: "",
    opis: "",
    godinaNastanka: "",
    stanje: "",
    pocetnaCijena: "",
    dodano: formatZaDateTimeLocal(new Date()), // Trenutni datum i vrijeme
    zavrsava: formatZaDateTimeLocal(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)) // 7 dana od danas
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

  function oznakaVecPostoji(naziv) {
    return oznake.some(o => o.naziv.toLowerCase() === naziv.trim().toLowerCase());
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

  async function kreirajI_DodajOznaku() {
    if (!pretragaOznaka.trim()) return;
    try {
      const odgovor = await OznakeServices.dodaj({ naziv: pretragaOznaka.trim() });
      const novaOznaka = odgovor?.data !== undefined ? odgovor.data : odgovor;

      if (novaOznaka && novaOznaka.id) {
        setOznake(prev => [...prev, novaOznaka]);
        setOdabraneOznake(prev => [...prev, novaOznaka]);
      } else {
        const privremenaOznaka = { id: Date.now(), naziv: pretragaOznaka.trim() };
        setOznake(prev => [...prev, privremenaOznaka]);
        setOdabraneOznake(prev => [...prev, privremenaOznaka]);
      }

      setPretragaOznaka("");
      setPrikaziAutoComplete(false);
    } catch (error) {
      console.error("Greška pri kreiranju nove oznake:", error);
    }
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
          <Col sm={12} md={6}>
            <Form.Group controlId="naziv">
              <FormLabel><strong>Naziv</strong></FormLabel>
              <FormControl type="text" name="naziv" required value={predmet.naziv} onChange={handleChange} placeholder="Unesite naziv predmeta" />
            </Form.Group>
          </Col>

          <Col sm={6} md={6}>
            <Form.Group controlId="kategorija">
              <FormLabel><strong>Kategorija</strong></FormLabel>
              <FormSelect value={odabranaKategorija} onChange={(e) => setOdabranaKategorija(e.target.value)} required>
                <option value="">Odaberi kategoriju</option>
                {kategorije.map(k => <option key={k.id} value={String(k.id)}>{k.naziv}</option>)}
              </FormSelect>
            </Form.Group>
          </Col>

          {/* SEKCIJA ZA OZNAKE S AUTOCOMPLETE-OM */}
          <Col sm={12} ref={autoCompleteRef} style={{ position: 'relative' }}>
            <Card className="p-3 bg-light border">
              <Form.Group controlId="oznakePretraga">
                <FormLabel><strong>Oznake (Pretraži ili dodaj novu)</strong></FormLabel>
                <FormControl 
                  type="text" 
                  value={pretragaOznaka} 
                  placeholder="Upišite naziv oznake..." 
                  onChange={(e) => { setPretragaOznaka(e.target.value); setPrikaziAutoComplete(true); }} 
                  onFocus={() => setPrikaziAutoComplete(true)}
                />
              </Form.Group>

              {prikaziAutoComplete && (
                <ul className="list-group position-absolute w-100 shadow bg-white" style={{ zIndex: 1000, maxHeight: '200px', overflowY: 'auto', left: 0, top: '90px' }}>
                  {filtrirajOznake().map((o) => (
                    <li key={o.id} className="list-group-item list-group-item-action" style={{cursor:'pointer'}} onClick={() => dodajOznaku(o)}>
                      {o.naziv}
                    </li>
                  ))}
                  {pretragaOznaka.trim() !== "" && !oznakaVecPostoji(pretragaOznaka) && (
                    <li className="list-group-item list-group-item-success fw-bold" style={{ cursor: 'pointer' }} onClick={kreirajI_DodajOznaku}>
                      ➕ Dodaj novu oznaku: "{pretragaOznaka}"
                    </li>
                  )}
                </ul>
              )}

              <div className="mt-3 d-flex flex-wrap gap-1">
                {odabraneOznake.length === 0 && <small className="text-muted">Nema odabranih oznaka.</small>}
                {odabraneOznake.map(o => (
                  <span key={o.id} className="badge bg-secondary p-2 d-flex align-items-center gap-1">
                    {o.naziv} 
                    <span style={{cursor:'pointer', fontWeight: 'bold', marginLeft: '5px'}} onClick={() => setOdabraneOznake(odabraneOznake.filter(x => String(x.id) !== String(o.id)))}>&times;</span>
                  </span>
                ))}
              </div>
            </Card>
          </Col>

          <Col sm={12}>
            <Form.Group controlId="opis">
              <FormLabel><strong>Opis</strong></FormLabel>
              <FormControl as="textarea" name="opis" rows={3} value={predmet.opis} onChange={handleChange} placeholder="Unesite opis predmeta" />
            </Form.Group>
          </Col>

          <Col xs={6} md={3}>
            <Form.Group controlId="godinaNastanka">
              <FormLabel>Godina nastanka</FormLabel>
              <FormControl type="number" name="godinaNastanka" value={predmet.godinaNastanka} onChange={handleChange} />
            </Form.Group>
          </Col>

          <Col xs={6} md={3}>
            <Form.Group controlId="stanje">
              <FormLabel>Stanje</FormLabel>
              <FormControl type="text" name="stanje" value={predmet.stanje} onChange={handleChange} placeholder="npr. Odlično" />
            </Form.Group>
          </Col>

          <Col xs={6} md={3}>
            <Form.Group controlId="pocetnaCijena">
              <FormLabel>Početna cijena (€)</FormLabel>
              <FormControl type="number" step="0.01" name="pocetnaCijena" value={predmet.pocetnaCijena} onChange={handleChange} />
            </Form.Group>
          </Col>

          <Col xs={6} md={3}>
            <Form.Group controlId="dodano">
              <FormLabel>Dodano</FormLabel>
              <FormControl type="datetime-local" name="dodano" value={predmet.dodano} onChange={handleChange} />
            </Form.Group>
          </Col>

          <Col xs={6} md={3}>
            <Form.Group controlId="zavrsava">
              <FormLabel>Završava</FormLabel>
              <FormControl type="datetime-local" name="zavrsava" value={predmet.zavrsava} onChange={handleChange} />
            </Form.Group>
          </Col>

          {/* SEKCIJA ZA UPLOAD SLIKA */}
          <Col sm={12}>
            <Card className="p-3 bg-light border">
              <Form.Group className="mb-3">
                <Form.Label><strong>Slike predmeta (maksimalno 5)</strong></Form.Label>
                <FormControl type="file" multiple accept="image/*" onChange={handleImageChange} />
                {slikeError && <Alert variant="danger" className="mt-2">{slikeError}</Alert>}
              </Form.Group>

              {slike.length > 0 && (
                <div>
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
            </Card>
          </Col>
        </Row>

        <Row className="mt-4 mb-4">
          <Col xs={6}><Button type="submit" variant="success" className="w-50">Dodaj</Button></Col>
          <Col xs={6}><Button variant="danger" className="w-50" onClick={() => navigate(RouteNames.PREDMETI)}>Odustani</Button></Col>
        </Row>
      </Form>
    </Container>
  );
}