import { Button, Col, Container, Form, FormSelect, FormControl, FormLabel, Row, Alert } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { RouteNames } from "../../constants";
import { useEffect, useState, useRef } from "react";
import PredmetiServices from "../../services/predmeti/PredmetiServices";
import KategorijeServices from "../../services/kategorije/KategorijeServices";
import OznakeServices from "../../services/oznake/OznakeServices";
import Heading from "../../components/UI/Heading";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB

// Pomoćna funkcija za kompresiju slike pomoću Canvasa
const komprimirajSliku = (file, maxSirina = 1200, maxVisina = 1200, kvaliteta = 0.75) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      
      img.onload = () => {
        let sirina = img.width;
        let visina = img.height;

        if (sirina > maxSirina || visina > maxVisina) {
          if (sirina > visina) {
            visina = Math.round((visina * maxSirina) / sirina);
            sirina = maxSirina;
          } else {
            sirina = Math.round((sirina * maxVisina) / sirina);
            visina = maxVisina;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = sirina;
        canvas.height = visina;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, sirina, visina);

        const komprimiraniBase64 = canvas.toDataURL('image/jpeg', kvaliteta);
        resolve(komprimiraniBase64);
      };
      
      img.onerror = (error) => reject(error);
    };
    
    reader.onerror = (error) => reject(error);
  });
};

export default function PredmetiPromjena() {
  const navigate = useNavigate();
  const params = useParams();
  
  const [predmet, setPredmet] = useState(null);
  const [kategorije, setKategorije] = useState([]);
  const [oznake, setOznake] = useState([]);
  const [odabranaKategorija, setOdabranaKategorija] = useState("");

  const [pretragaOznaka, setPretragaOznaka] = useState("");
  const [odabraneOznake, setOdabraneOznake] = useState([]);
  const [prikaziAutoComplete, setPrikaziAutoComplete] = useState(false);

  const [slike, setSlike] = useState([]);         // Postojeće slike (URL / Base64)
  const [noveSlike, setNoveSlike] = useState([]);     // Nove komprimirane slike (Base64)
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
      let katLista = [];
      try {
        const resKategorije = await KategorijeServices.get();
        katLista = resKategorije.data || resKategorije || [];
        setKategorije(katLista);
      } catch (err) {
        console.error("Greška pri dohvaćanju kategorija:", err);
      }

      let oznakeLista = [];
      try {
        const resOznake = await OznakeServices.get();
        oznakeLista = resOznake.data || resOznake || [];
        setOznake(oznakeLista);
      } catch (err) {
        console.error("Greška pri dohvaćanju oznaka:", err);
      }

      const odgovorPredmet = await PredmetiServices.getByID(params.id);
      const s = odgovorPredmet?.data !== undefined ? odgovorPredmet.data : odgovorPredmet;

      if (!s || Object.keys(s).length === 0) {
        console.error("Predmet s ID-jem", params.id, "ne postoji ili je prazan.");
        return;
      }

      if (s.dodano) s.dodano = s.dodano.substring(0, 16);
      if (s.zavrsava) s.zavrsava = s.zavrsava.substring(0, 16);

      setPredmet(s); 
      setSlike(s.slike || []);
      
      if (s.oznake && oznakeLista.length > 0) {
        const inicijalne = s.oznake.map(o => {
          const idZaTraziti = typeof o === 'object' ? o.id : o;
          return oznakeLista.find(i => String(i.id) === String(idZaTraziti));
        }).filter(Boolean);
        setOdabraneOznake(inicijalne);
      }
      
      const katIdZaPronaci = typeof s.kategorija === 'object' ? s.kategorija?.id : s.kategorija;
      const pronadjenaKat = katLista.find(k => String(k.id) === String(katIdZaPronaci));
      if (pronadjenaKat) setOdabranaKategorija(String(pronadjenaKat.id));

    } catch (error) { 
      console.error("Kritična greška u ucitajPodatke:", error); 
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

  async function handleImageChange(e) {
    const odabrane = Array.from(e.target.files);
    
    // Provjera veličine datoteka
    const imaPrevelikih = odabrane.some(file => file.size > MAX_FILE_SIZE);
    if (imaPrevelikih) {
      setSlikeError("Jedna ili više slika prelazi maksimalnu dopuštenu veličinu od 2 MB.");
      return;
    }

    // Provjera ukupnog broja slika
    if (slike.length + noveSlike.length + odabrane.length > 5) {
      setSlikeError("Ukupno možete imati najviše 5 slika.");
      return;
    }

    try {
      setSlikeError("");
      // Kompresija slika i pretvorba u Base64 odmah pri odabiru
      const komprimirane = await Promise.all(
        odabrane.map(file => komprimirajSliku(file, 1024, 1024, 0.75))
      );

      setNoveSlike(prev => [...prev, ...komprimirane]);
    } catch (error) {
      console.error("Greška pri obradi slika:", error);
      setSlikeError("Došlo je do greške prilikom obrade slika.");
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (slikeError) return;

    try {
      await PredmetiServices.promijeni(params.id, {
        naziv: predmet.naziv,
        opis: predmet.opis,
        godinaNastanka: Number(predmet.godinaNastanka),
        stanje: predmet.stanje,
        pocetnaCijena: Number(predmet.pocetnaCijena),
        dodano: predmet.dodano ? new Date(predmet.dodano).toISOString() : null,
        zavrsava: predmet.zavrsava ? new Date(predmet.zavrsava).toISOString() : null,
        kategorija: Number(odabranaKategorija),
        oznake: odabraneOznake.map(o => o.id),
        slike: [...slike, ...noveSlike] // Spojene postojeće i nove komprimirane slike
      });
      navigate(RouteNames.PREDMETI);
    } catch (error) {
      console.error("Greška prilikom spremanja predmeta:", error);
    }
  }

  if (!predmet) {
    return (
      <Container className="mt-4">
        <Heading as="h4">Učitavanje podataka predmeta...</Heading>
      </Container>
    );
  }

  return (
    <>
      <Heading as="h2" color="azure">Promjena predmeta: {predmet.naziv}</Heading>
      <Form onSubmit={handleSubmit}>
        <Row className="g-3">
          <Col sm={12} md={6}>
            <Form.Group controlId="naziv">
              <FormLabel>Naziv</FormLabel>
              <FormControl type="text" name="naziv" required value={predmet.naziv || ""} onChange={handleChange} />
            </Form.Group>
          </Col>
          <Col sm={6} md={6}>
            <Form.Group controlId="kategorija">
              <Form.Label>Kategorija</Form.Label>
              <FormSelect value={odabranaKategorija} onChange={(e) => setOdabranaKategorija(e.target.value)} required>
                <option value="">Odaberi kategoriju</option>
                {kategorije.map(k => <option key={k.id} value={String(k.id)}>{k.naziv}</option>)}
              </FormSelect>
            </Form.Group>
          </Col>

          <Col sm={6} md={6} ref={autoCompleteRef} style={{ position: 'relative' }}>
            <Form.Group controlId="oznakePretraga">
              <Form.Label>Oznake</Form.Label>
              <FormControl 
                type="text" 
                value={pretragaOznaka} 
                placeholder="Pretraži oznake..." 
                onChange={(e) => { setPretragaOznaka(e.target.value); setPrikaziAutoComplete(true); }} 
                onFocus={() => setPrikaziAutoComplete(true)}
              />
            </Form.Group>
            {prikaziAutoComplete && filtrirajOznake().length > 0 && (
              <ul className="list-group position-absolute w-100 shadow" style={{ zIndex: 1000, maxHeight: '200px', overflowY: 'auto' }}>
                {filtrirajOznake().map((o) => (
                  <li key={o.id} className="list-group-item" style={{cursor:'pointer'}} onClick={() => dodajOznaku(o)}>
                    {o.naziv}
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-2">
              {odabraneOznake.map(o => (
                <span key={o.id} className="badge bg-secondary me-1 p-2">
                  {o.naziv} <span style={{cursor:'pointer'}} onClick={() => setOdabraneOznake(odabraneOznake.filter(x => x.id !== o.id))}>&times;</span>
                </span>
              ))}
            </div>
          </Col>

          <Col sm={6} md={6}>
            <Form.Group controlId="opis">
              <FormLabel>Opis</FormLabel>
              <FormControl as="textarea" name="opis" rows={3} value={predmet.opis || ""} onChange={handleChange} />
            </Form.Group>
          </Col>
          <Col xs={6} md={3}>
            <Form.Group controlId="godinaNastanka">
              <FormLabel>Godina</FormLabel>
              <FormControl type="number" name="godinaNastanka" value={predmet.godinaNastanka || ""} onChange={handleChange} />
            </Form.Group>
          </Col>
          <Col xs={6} md={3}>
            <Form.Group controlId="stanje">
              <FormLabel>Stanje</FormLabel>
              <FormControl type="text" name="stanje" value={predmet.stanje || ""} onChange={handleChange} />
            </Form.Group>
          </Col>
          <Col xs={6} md={3}>
            <Form.Group controlId="pocetnaCijena">
              <FormLabel>Cijena</FormLabel>
              <FormControl type="number" step="0.01" name="pocetnaCijena" value={predmet.pocetnaCijena || ""} onChange={handleChange} />
            </Form.Group>
          </Col>
          <Col xs={6} md={3}>
            <Form.Group controlId="dodano">
              <FormLabel>Dodano</FormLabel>
              <FormControl type="datetime-local" name="dodano" value={predmet.dodano || ""} onChange={handleChange} />
            </Form.Group>
          </Col>
          <Col xs={6} md={3}>
            <Form.Group controlId="zavrsava">
              <FormLabel>Završava</FormLabel>
              <FormControl type="datetime-local" name="zavrsava" value={predmet.zavrsava || ""} onChange={handleChange} />
            </Form.Group>
          </Col>

          <Col sm={12}>
            <Form.Label>Trenutne slike</Form.Label>
            <div className="d-flex flex-wrap gap-2 mb-2">
              {slike.map((s, i) => (
                <div key={i} className="position-relative">
                  <img src={s} alt="" style={{ width: '100px', height: '100px', objectFit: 'cover' }} className="rounded" />
                  <Button variant="danger" size="sm" className="position-absolute top-0 end-0 p-0 px-1" onClick={() => setSlike(slike.filter((_, idx) => idx !== i))}>X</Button>
                </div>
              ))}
            </div>

            {noveSlike.length > 0 && (
              <>
                <Form.Label>Nove slike (spremište)</Form.Label>
                <div className="d-flex flex-wrap gap-2 mb-2">
                  {noveSlike.map((s, i) => (
                    <div key={i} className="position-relative">
                      <img src={s} alt="" style={{ width: '100px', height: '100px', objectFit: 'cover' }} className="rounded border border-warning" />
                      <Button variant="danger" size="sm" className="position-absolute top-0 end-0 p-0 px-1" onClick={() => setNoveSlike(noveSlike.filter((_, idx) => idx !== i))}>X</Button>
                    </div>
                  ))}
                </div>
              </>
            )}

            <Form.Group>
              <Form.Label>Dodaj nove slike (max 2 MB)</Form.Label>
              <FormControl type="file" multiple accept="image/*" onChange={handleImageChange} />
              {slikeError && <Alert variant="danger" className="mt-2">{slikeError}</Alert>}
            </Form.Group>
          </Col>
        </Row>

        <Row className="mt-4 mb-4">
          <Col xs={6}><Button type="submit" variant="warning" className="w-50">Promijeni</Button></Col>
          <Col xs={6}><Button variant="danger" className="w-50" onClick={() => navigate(RouteNames.PREDMETI)}>Odustani</Button></Col>
        </Row>
      </Form>
    </>
  );
}