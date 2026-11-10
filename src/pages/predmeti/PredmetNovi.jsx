import { Button, Col, Container, Form, FormSelect, FormControl, FormLabel, Row, Alert, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants";
import { useEffect, useState, useRef } from "react";
import PredmetiServices from "../../services/predmeti/PredmetiServices";
import KategorijeServices from "../../services/kategorije/KategorijeServices";
import OznakeServices from "../../services/oznake/OznakeServices";
import Heading from "../../components/UI/Heading";
import { Cropper } from "react-cropper";
import 'cropperjs/dist/cropper.css';

export default function PredmetNovi() {
  const navigate = useNavigate();
  
  const formatZaDateTimeLocal = (date) => {
    const d = new Date(date);
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  const [kategorije, setKategorije] = useState([]);
  const [oznake, setOznake] = useState([]);
  const [odabranaKategorija, setOdabranaKategorija] = useState("");

  const [pretragaOznaka, setPretragaOznaka] = useState("");
  const [odabraneOznake, setOdabraneOznake] = useState([]);
  const [prikaziAutoComplete, setPrikaziAutoComplete] = useState(false);

  const [predmet, setPredmet] = useState({
    naziv: "",
    opis: "",
    godinaNastanka: "",
    stanje: "",
    pocetnaCijena: "",
    dodano: formatZaDateTimeLocal(new Date()),
    zavrsava: formatZaDateTimeLocal(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000))
  });

  const [slikaZaCrop, setSlikaZaCrop] = useState(null);
  const cropperRef = useRef(null);
  const autoCompleteRef = useRef(null);

  useEffect(() => {
    ucitajPodatke();
    function handleClickOutside(event) {
      if (autoCompleteRef.current && !autoCompleteRef.current.contains(event.target)) {
        setPrikaziAutoComplete(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
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
    const nazivOznake = pretragaOznaka.trim();
    if (!nazivOznake) return;

    try {
      const odgovor = await OznakeServices.dodaj({ naziv: nazivOznake });
      let stvorenaOznaka = odgovor?.data !== undefined ? odgovor.data : odgovor;

      if (typeof stvorenaOznaka === "number" || typeof stvorenaOznaka === "string") {
        stvorenaOznaka = { id: stvorenaOznaka, naziv: nazivOznake };
      }

      if (stvorenaOznaka && stvorenaOznaka.id) {
        setOznake(prev => [...prev, stvorenaOznaka]);
        setOdabraneOznake(prev => [...prev, stvorenaOznaka]);
      } else {
        const privremenaOznaka = { id: Date.now(), naziv: nazivOznake };
        setOznake(prev => [...prev, privremenaOznaka]);
        setOdabraneOznake(prev => [...prev, privremenaOznaka]);
      }

      setPretragaOznaka("");
      setPrikaziAutoComplete(false);
    } catch (error) {
      console.error("Greška pri kreiranju nove oznake:", error);
    }
  }

  function onChangeImage(e) {
    e.preventDefault();
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const reader = new FileReader();
    reader.onload = () => {
      setSlikaZaCrop(reader.result);
    };
    reader.readAsDataURL(files[0]);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    let dataUrl = null;
    if (cropperRef.current && cropperRef.current.cropper) {
      try {
        const cropper = cropperRef.current.cropper;
        const canvas = cropper.getCroppedCanvas({
          width: 400,
          height: 400,
          imageSmoothingEnable: true,
          imageSmoothingQuality: 'high'
        });
        if (canvas) {
          dataUrl = canvas.toDataURL('image/png');
        }
      } catch (err) {
        console.warn("Greška pri obrezivanju slike:", err);
      }
    }

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
        slike: dataUrl
      });
      navigate(RouteNames.PREDMETI);
    } catch (error) {
      console.error("Greška prilikom dodavanja predmeta:", error);
    }
  }

  return (
    <Container className="mt-4 mb-5">
      <Heading as="h2" color="azure" className="mb-4">Dodavanje novog predmeta</Heading>
      
      <Form onSubmit={handleSubmit}>
        <Row className="g-3">
          <Col sm={6}>
            <Form.Group controlId="naziv">
              <FormLabel><strong>Naziv</strong></FormLabel>
              <FormControl type="text" name="naziv" required value={predmet.naziv} onChange={handleChange} placeholder="Unesite naziv predmeta" />
            </Form.Group>
          </Col>

          <Col sm={6}>
            <Form.Group controlId="kategorija">
              <FormLabel><strong>Kategorija</strong></FormLabel>
              <FormSelect value={odabranaKategorija} onChange={(e) => setOdabranaKategorija(e.target.value)} required>
                <option value="">Odaberi kategoriju</option>
                {kategorije.map(k => <option key={k.id} value={String(k.id)}>{k.naziv}</option>)}
              </FormSelect>
            </Form.Group>
          </Col>

          {/* SEKCIJA ZA OZNAKE S AUTOCOMPLETE-OM */}
          <Col sm={6}>
            <Card className="p-1 bg-light border" ref={autoCompleteRef}>
              <Form.Group controlId="oznakePretraga" className="position-relative">
                <FormLabel><strong style={{color:"#ccc", fontSize:".6rem"}}>Oznake (Pretraži ili dodaj novu)</strong></FormLabel>
                <FormControl 
                  type="text" 
                  value={pretragaOznaka} 
                  placeholder="Upišite naziv oznake..." 
                  onChange={(e) => { setPretragaOznaka(e.target.value); setPrikaziAutoComplete(true); }} 
                  onFocus={() => setPrikaziAutoComplete(true)}
                />

                {prikaziAutoComplete && (
                  <ul className="list-group position-absolute w-100 shadow bg-white" style={{ zIndex: 1050, maxHeight: '200px', overflowY: 'auto', left: 0, top: '100%' }}>
                    {filtrirajOznake().map((o) => (
                      <li key={o.id} className="list-group-item list-group-item-action" style={{cursor:'pointer'}} onMouseDown={(e) => { e.preventDefault(); dodajOznaku(o); }}>
                        {o.naziv}
                      </li>
                    ))}
                    {pretragaOznaka.trim() !== "" && !oznakaVecPostoji(pretragaOznaka) && (
                      <li className="list-group-item list-group-item-success fw-bold" style={{ cursor: 'pointer' }} onMouseDown={(e) => { e.preventDefault(); kreirajI_DodajOznaku(); }}>
                        ➕ Dodaj novu oznaku: "{pretragaOznaka}"
                      </li>
                    )}
                  </ul>
                )}
              </Form.Group>

              <div className="mt-3 d-flex flex-wrap gap-1">
                {odabraneOznake.length === 0 && <small className="text-muted" style={{fontSize:".6rem"}}>Nema odabranih oznaka.</small>}
                {odabraneOznake.map(o => (
                  <span key={o.id} className="badge bg-secondary p-2 d-flex align-items-center gap-1">
                    {o.naziv} 
                    <span style={{cursor:'pointer', fontWeight: 'bold', marginLeft: '5px'}} onClick={() => setOdabraneOznake(odabraneOznake.filter(x => String(x.id) !== String(o.id)))}>&times;</span>
                  </span>
                ))}
              </div>
            </Card>
          </Col>

          <Col sm={6}>
            <Form.Group controlId="opis">
              <FormLabel><strong>Opis</strong></FormLabel>
              <FormControl as="textarea" name="opis" rows={3} value={predmet.opis} onChange={handleChange} placeholder="Unesite opis predmeta" />
            </Form.Group>
          </Col>

          <Col sm={3} lg={2}>
            <Form.Group controlId="godinaNastanka">
              <FormLabel>Godina nastanka</FormLabel>
              <FormControl type="number" name="godinaNastanka" value={predmet.godinaNastanka} onChange={handleChange} />
            </Form.Group>
          </Col>

          <Col sm={3} lg={2}>
            <Form.Group controlId="stanje">
              <FormLabel>Stanje</FormLabel>
              <FormControl type="text" name="stanje" maxLength="30" value={predmet.stanje} onChange={handleChange} placeholder="npr. Odlično" />
            </Form.Group>
          </Col>

          <Col sm={3} lg={2}>
            <Form.Group controlId="pocetnaCijena">
              <FormLabel>Početna cijena (€)</FormLabel>
              <FormControl type="number" step="0.01" name="pocetnaCijena" value={predmet.pocetnaCijena} onChange={handleChange} />
            </Form.Group>
          </Col>

          <Col sm={6}>
            <Form.Group controlId="dodano">
              <FormLabel>Dodano</FormLabel>
              <FormControl type="datetime-local" name="dodano" value={predmet.dodano} onChange={handleChange} />
            </Form.Group>
          </Col>

          <Col sm={6}>
            <Form.Group controlId="zavrsava">
              <FormLabel>Završava</FormLabel>
              <FormControl type="datetime-local" name="zavrsava" value={predmet.zavrsava} onChange={handleChange} />
            </Form.Group>
          </Col>

          {/* SEKCIJA ZA SLIKU I CROPPER */}
          <Col lg={6}>
            <Form.Group controlId="slikaPredmeta">
              <FormLabel><strong>Slika predmeta</strong></FormLabel>
              <FormControl className="mb-3" type="file" onChange={onChangeImage} accept="image/*" />
            </Form.Group>
            
            {slikaZaCrop ? (
              <Cropper
                src={slikaZaCrop}
                style={{ height: 350, width: '100%' }}
                initialAspectRatio={1}
                guides={true}
                autoCropArea={1}
                viewMode={1}
                minCropBoxWidth={200}
                minCropBoxHeight={200}
                cropBoxResizable={true}
                background={false}
                responsive={true}
                checkOrientation={false}
                ref={cropperRef}
              />
            ) : (
              <div className="p-4 border text-center text-muted bg-light rounded">
                Odaberite sliku predmeta iznad za obrezivanje.
              </div>
            )}
          </Col>
        </Row>

        <Row className="mt-4 mb-4">
          <Col xs={6} md={3}><Button type="submit" variant="outline-success" className="w-100" size="sm">Dodaj</Button></Col>
          <Col xs={6} md={3}><Button variant="outline-danger" className="w-100" size="sm" onClick={() => navigate(RouteNames.PREDMETI)}>Odustani</Button></Col>
        </Row>
      </Form>
    </Container>
  );
}