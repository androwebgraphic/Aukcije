import { Button, Col, Container, Form, FormSelect, FormControl, FormLabel, Row, Alert, Card } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { RouteNames } from "../../constants";
import { useEffect, useState, useRef } from "react";
import PredmetiServices from "../../services/predmeti/PredmetiServices";
import KategorijeServices from "../../services/kategorije/KategorijeServices";
import OznakeServices from "../../services/oznake/OznakeServices";
import Heading from "../../components/UI/Heading";

export default function PredmetiPromjena() {
  const navigate = useNavigate();
  const params = useParams();
  
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
  }, [params.id]);

  async function ucitajPodatke() {
    try {
      // 1. Dohvat kategorija
      try {
        const resKategorije = await KategorijeServices.get();
        setKategorije(resKategorije?.data || resKategorije || []);
      } catch (err) {
        console.error("Greška pri dohvaćanju kategorija:", err);
      }

      // 2. Dohvat oznaka
      try {
        const resOznake = await OznakeServices.get();
        setOznake(resOznake?.data || resOznake || []);
      } catch (err) {
        console.error("Greška pri dohvaćanju oznaka:", err);
      }

      // 3. Dohvat predmeta po ID-ju
      if (params.id) {
        const odgovorPredmet = await PredmetiServices.getByID(params.id);
        const s = odgovorPredmet?.data !== undefined ? odgovorPredmet.data : odgovorPredmet;

        if (s && Object.keys(s).length > 0) {
          if (s.dodano && typeof s.dodano === 'string') s.dodano = s.dodano.substring(0, 16);
          if (s.zavrsava && typeof s.zavrsava === 'string') s.zavrsava = s.zavrsava.substring(0, 16);

          setPredmet(s); 
          setSlike(s.slike || []);
          
          if (s.kategorija) {
            const katId = typeof s.kategorija === 'object' ? (s.kategorija.id || s.kategorija.sifra) : s.kategorija;
            setOdabranaKategorija(String(katId));
          }
        }
      }
    } catch (error) { 
      console.error("Greška u ucitajPodatke:", error); 
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setPredmet(prev => ({ ...prev, [name]: value }));
  }

  function oznakaVecPostoji(naziv) {
    return oznake.some(o => o.naziv && o.naziv.toLowerCase() === naziv.trim().toLowerCase());
  }

  function filtrirajOznake() {
    return oznake.filter(o => 
      !odabraneOznake.some(op => String(op.id || op.sifra) === String(o.id || o.sifra)) && 
      o.naziv && o.naziv.toLowerCase().includes(pretragaOznaka.toLowerCase())
    );
  }

  function dodajOznaku(oznaka) {
    if (odabraneOznake.some(o => String(o.id || o.sifra) === String(oznaka.id || oznaka.sifra))) return;
    setOdabraneOznake([...odabraneOznake, oznaka]); 
    setPretragaOznaka(""); 
    setPrikaziAutoComplete(false);
  }

  async function kreirajI_DodajOznaku() {
    if (!pretragaOznaka.trim()) return;
    try {
      const odgovor = await OznakeServices.dodaj({ naziv: pretragaOznaka.trim() });
      const novaOznaka = odgovor?.data !== undefined ? odgovor.data : odgovor;

      if (novaOznaka && (novaOznaka.id || novaOznaka.sifra)) {
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
      await PredmetiServices.promijeni(params.id, {
        naziv: predmet.naziv,
        opis: predmet.opis,
        godinaNastanka: predmet.godinaNastanka ? Number(predmet.godinaNastanka) : null,
        stanje: predmet.stanje,
        pocetnaCijena: predmet.pocetnaCijena ? Number(predmet.pocetnaCijena) : null,
        dodano: predmet.dodano ? new Date(predmet.dodano).toISOString() : null,
        zavrsava: predmet.zavrsava ? new Date(predmet.zavrsava).toISOString() : null,
        kategorija: odabranaKategorija ? Number(odabranaKategorija) : null,
        oznake: odabraneOznake.map(o => o.id || o.sifra),
        slike: slike
      });
      navigate(RouteNames.PREDMETI);
    } catch (error) {
      console.error("Greška prilikom spremanja predmeta:", error);
    }
  }

  return (
    <Container className="mt-4">
      <Heading as="h2" color="azure" className="mb-4">Promjena predmeta: {predmet?.naziv || ""}</Heading>
      
      <Form onSubmit={handleSubmit}>
        <Row className="g-3">
          <Col xs={6} md={6}>
            <Form.Group controlId="naziv">
              <FormLabel>Naziv</FormLabel>
              <FormControl type="text" name="naziv" required value={predmet?.naziv || ""} onChange={handleChange} />
            </Form.Group>
          </Col>

          <Col xs={6} md={6}>
            <Form.Group controlId="kategorija">
              <FormLabel>Kategorija</FormLabel>
              <FormSelect value={odabranaKategorija} onChange={(e) => setOdabranaKategorija(e.target.value)} required>
                <option value="">Odaberi kategoriju</option>
                {kategorije.map(k => <option key={k.id || k.sifra} value={String(k.id || k.sifra)}>{k.naziv}</option>)}
              </FormSelect>
            </Form.Group>
          </Col>

          {/* Oznake s mogućnošću kreiranja u hodu */}
          <Col sm={6} ref={autoCompleteRef} style={{ position: 'relative' }}>
            <Card className="p-3 bg-light border">
              <Form.Group controlId="oznakePretraga">
                <FormLabel>Oznake (Pretraži ili dodaj novu)</FormLabel>
                <FormControl 
                  type="text" 
                  value={pretragaOznaka} 
                  placeholder="Upišite naziv oznake..." 
                  onChange={(e) => { setPretragaOznaka(e.target.value); setPrikaziAutoComplete(true); }} 
                  onFocus={() => setPrikaziAutoComplete(true)}
                />
              </Form.Group>

              {prikaziAutoComplete && (
                <ul className="list-group position-absolute w-100 shadow" style={{ zIndex: 1000, maxHeight: '200px', overflowY: 'auto', left: 0, top: '90px' }}>
                  {filtrirajOznake().map((o) => (
                    <li key={o.id || o.sifra} className="list-group-item list-group-item-action" style={{cursor:'pointer'}} onClick={() => dodajOznaku(o)}>
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
                  <span key={o.id || o.sifra} className="badge bg-secondary p-2 d-flex align-items-center gap-1">
                    {o.naziv} 
                    <span style={{cursor:'pointer', fontWeight: 'bold', marginLeft: '5px'}} onClick={() => setOdabraneOznake(odabraneOznake.filter(x => String(x.id || x.sifra) !== String(o.id || o.sifra)))}>&times;</span>
                  </span>
                ))}
              </div>
            </Card>
          </Col>

          <Col xs={12} sm={12}>
            <Form.Group controlId="opis">
              <FormLabel>Opis</FormLabel>
              <FormControl as="textarea" name="opis" rows={3} value={predmet?.opis || ""} onChange={handleChange} />
            </Form.Group>
          </Col>

          <Col xs={4} md={4}>
            <Form.Group controlId="godinaNastanka">
              <FormLabel>Godina</FormLabel>
              <FormControl type="number" name="godinaNastanka" value={predmet?.godinaNastanka || ""} onChange={handleChange} />
            </Form.Group>
          </Col>

          <Col xs={4} md={4}>
            <Form.Group controlId="stanje">
              <FormLabel>Stanje</FormLabel>
              <FormControl type="text" name="stanje" value={predmet?.stanje || ""} onChange={handleChange} />
            </Form.Group>
          </Col>

          <Col xs={4} md={4}>
            <Form.Group controlId="pocetnaCijena">
              <FormLabel>Cijena (€)</FormLabel>
              <FormControl type="number" step="0.01" name="pocetnaCijena" value={predmet?.pocetnaCijena || ""} onChange={handleChange} />
            </Form.Group>
          </Col>

          <Col xs={6} md={6}>
            <Form.Group controlId="dodano">
              <FormLabel>Dodano</FormLabel>
              <FormControl type="datetime-local" name="dodano" value={predmet?.dodano || ""} onChange={handleChange} />
            </Form.Group>
          </Col>

          <Col xs={6} md={6}>
            <Form.Group controlId="zavrsava">
              <FormLabel>Završava</FormLabel>
              <FormControl type="datetime-local" name="zavrsava" value={predmet?.zavrsava || ""} onChange={handleChange} />
            </Form.Group>
          </Col>

          {/* Slike */}
          <Col sm={8}>
            <Card className="p-3 bg-light border">
              <Form.Group className="mb-3">
                <Form.Label>Slike predmeta (maksimalno 5)</Form.Label>
                <FormControl type="file" multiple accept="image/*" onChange={handleImageChange} />
                {slikeError && <Alert variant="danger" className="mt-2">{slikeError}</Alert>}
              </Form.Group>

              {slike.length > 0 && (
                <div>
                  <div className="text-muted small mb-2">Trenutne / odabrane slike:</div>
                  <div className="d-flex flex-wrap gap-2">
                    {slike.map((s, i) => (
                      <div key={i} className="position-relative">
                        <img src={s} alt={`Slika ${i}`} style={{ width: '100px', height: '100px', objectFit: 'cover' }} className="rounded border shadow-sm" />
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
          <Col xs={4} ><Button type="submit" variant="warning" className="w-100" size="sm">Promijeni</Button></Col>
          <Col xs={4} ><Button variant="danger" className="w-100" size="sm" onClick={() => navigate(RouteNames.PREDMETI)}>Odustani</Button></Col>
        </Row>
      </Form>
    </Container>
  );
}