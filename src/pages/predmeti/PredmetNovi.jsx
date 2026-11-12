import { Button, Col, Container, Form, FormSelect, FormControl, FormLabel, Row, Alert, Card, Image as BsImage } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants";
import { useEffect, useState, useRef } from "react";
import PredmetiServices from "../../services/predmeti/PredmetiServices";
import KategorijeServices from "../../services/kategorije/KategorijeServices";
import OznakeServices from "../../services/oznake/OznakeServices";
import Heading from "../../components/UI/Heading";
import { Cropper } from "react-cropper";
import 'cropperjs/dist/cropper.css';
import { ShemaPredmet } from "../../schemas/SchemaPredmet";

// ---------------------------------------------------------------------------
// Pomoćne funkcije za normalizaciju oznaka.
// Cilj: oznaka je UVIJEK objekt { id, naziv } pa se ime nikad ne mora
// rekonstruirati iz ID-ja (i nikad se ne prikazuje sam ID).
// ---------------------------------------------------------------------------
const KLJUCEVI_NAZIVA = ["naziv", "Naziv", "name", "Name", "oznaka", "Oznaka", "tekst", "Tekst", "title", "Title", "label", "Label"];
const KLJUCEVI_ID = ["id", "ID", "Id", "oznakaId", "OznakaId"];

function izvuciNaziv(oznaka) {
  for (const kljuc of KLJUCEVI_NAZIVA) {
    const vrijednost = oznaka[kljuc];
    if (vrijednost !== null && vrijednost !== undefined && String(vrijednost).trim() !== "") {
      return String(vrijednost).trim();
    }
  }
  // Rezervna varijanta: ako objekt ima svega par polja (tipično ID + naziv pod
  // neočekivanim imenom), uzmi prvo tekstualno polje koje nije ID.
  const polja = Object.entries(oznaka);
  if (polja.length > 3) return null;
  for (const [kljuc, vrijednost] of polja) {
    if (KLJUCEVI_ID.includes(kljuc)) continue;
    if (vrijednost !== null && vrijednost !== undefined && typeof vrijednost !== "object" && String(vrijednost).trim() !== "") {
      return String(vrijednost).trim();
    }
  }
  return null;
}

function normalizirajOznaku(oznaka) {
  if (oznaka === null || oznaka === undefined) return null;

  if (typeof oznaka === "object") {
    const id = Number(oznaka.id ?? oznaka.ID ?? oznaka.Id ?? oznaka.oznakaId ?? oznaka.OznakaId);
    if (!Number.isFinite(id) || id <= 0) return null;
    return { id, naziv: izvuciNaziv(oznaka) || `Oznaka ${id}` };
  }

  const id = Number(oznaka);
  if (!Number.isFinite(id) || id <= 0) return null;
  return { id, naziv: `Oznaka ${id}` };
}

function izvuciIdIzOdgovora(podaci) {
  if (podaci === null || podaci === undefined || podaci === "") return null;
  const kandidat = typeof podaci === "object"
    ? (podaci.id ?? podaci.ID ?? podaci.Id ?? podaci.oznakaId ?? podaci.OznakaId)
    : podaci;
  if (kandidat === null || kandidat === undefined || kandidat === "") return null;
  const id = Number(kandidat);
  return Number.isFinite(id) && id > 0 ? id : null;
}

export default function PredmetNovi() {
  const navigate = useNavigate();
  const [greska, setGreska] = useState(null);
  const [errors, setErrors] = useState({});

  const formatZaDateTimeLocal = (date) => {
    const d = new Date(date);
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  const [kategorije, setKategorije] = useState([]);
  const [oznake, setOznake] = useState([]);                      // [{ id, naziv }]
  const [odabranaKategorija, setOdabranaKategorija] = useState("");

  const [pretragaOznaka, setPretragaOznaka] = useState("");
  const [odabraneOznake, setOdabraneOznake] = useState([]);      // [{ id, naziv }]
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
  const [isjecenaSlikaUrl, setIsjecenaSlikaUrl] = useState(null);
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
      setKategorije(resKategorije?.data ?? resKategorije ?? []);
    } catch (error) {
      console.error("Greška pri učitavanju kategorija:", error);
    }

    try {
      await ucitajOznake();
    } catch (error) {
      console.error("Greška pri učitavanju oznaka:", error);
    }
  }

  async function ucitajOznake() {
    const resOznake = await OznakeServices.get();
    const siroveOznake = resOznake?.data ?? resOznake ?? [];
    const lista = Array.isArray(siroveOznake) ? siroveOznake : [];

    // Ukloni duplikate po ID-ju (neke baze znaju vratiti istu oznaku više puta).
    const poId = new Map();
    lista.forEach((sirova) => {
      const oznaka = normalizirajOznaku(sirova);
      if (oznaka) poId.set(oznaka.id, oznaka);
    });

    const normalizirane = [...poId.values()];
    setOznake(normalizirane);
    return normalizirane;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setPredmet(prev => ({ ...prev, [name]: value }));
  }

  function oznakaVecPostoji(naziv) {
    const unijeti = naziv.trim().toLowerCase();
    if (!unijeti) return false;
    return oznake.some(o => o.naziv.toLowerCase() === unijeti) ||
           odabraneOznake.some(o => o.naziv.toLowerCase() === unijeti);
  }

  function filtrirajOznake() {
    const upit = pretragaOznaka.trim().toLowerCase();
    return oznake.filter(o =>
      !odabraneOznake.some(odabrana => odabrana.id === o.id) &&
      (!upit || o.naziv.toLowerCase().includes(upit))
    );
  }

  function dodajOznaku(oznaka) {
    const normirana = normalizirajOznaku(oznaka);
    if (!normirana) return;

    // Oznaku držimo i u širem popisu (za slučaj da je nova) i u odabranima,
    // tako da badge uvijek ima naziv uz sebe.
    setOznake(prev => prev.some(o => o.id === normirana.id) ? prev : [...prev, normirana]);
    setOdabraneOznake(prev => prev.some(o => o.id === normirana.id) ? prev : [...prev, normirana]);
    setPretragaOznaka("");
    setPrikaziAutoComplete(false);
  }

  function ukloniOznaku(id) {
    setOdabraneOznake(prev => prev.filter(o => o.id !== id));
  }

  async function kreirajI_DodajOznaku() {
    const nazivOznake = pretragaOznaka.trim();
    if (!nazivOznake) return;

    // Ako oznaka s tim nazivom već postoji, nemoj je dvaput kreirati.
    const postojeca = oznake.find(o => o.naziv.toLowerCase() === nazivOznake.toLowerCase());
    if (postojeca) {
      dodajOznaku(postojeca);
      return;
    }

    try {
      const odgovor = await OznakeServices.dodaj({ naziv: nazivOznake, Naziv: nazivOznake });
      const podaci = odgovor?.data !== undefined ? odgovor.data : odgovor;

      let noviId = izvuciIdIzOdgovora(podaci);

      // Server nije vratio ID → osvježi popis i pronađi oznaku po nazivu.
      if (noviId === null) {
        const lista = await ucitajOznake();
        const nadena = lista.find(o => o.naziv.toLowerCase() === nazivOznake.toLowerCase());
        noviId = nadena ? nadena.id : null;
      }

      if (noviId === null) {
        setGreska(`Oznaka "${nazivOznake}" je poslana na server, ali je nisam mogao povezati s ID-jem. Osvježite stranicu i odaberite je iz popisa oznaka.`);
        setPretragaOznaka("");
        setPrikaziAutoComplete(false);
        return;
      }

      setGreska(null);
      dodajOznaku({ id: noviId, naziv: nazivOznake });
    } catch (error) {
      console.error("Greška pri kreiranju nove oznake:", error?.response?.data || error);
      setGreska(`Oznaku "${nazivOznake}" nije moguće spremiti na server.`);
    }
  }

  function onChangeImage(e) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const imageUrl = URL.createObjectURL(files[0]);
    setSlikaZaCrop(imageUrl);
    setIsjecenaSlikaUrl(null);
  }

  function potvrdiCrop(e) {
    e.preventDefault();
    if (cropperRef.current && cropperRef.current.cropper) {
      const cropper = cropperRef.current.cropper;
      const canvas = cropper.getCroppedCanvas({
        width: 400,
        height: 400,
        imageSmoothingEnable: true,
        imageSmoothingQuality: 'high'
      });
      if (canvas) {
        const dataUrl = canvas.toDataURL('image/png');
        setIsjecenaSlikaUrl(dataUrl);
        setSlikaZaCrop(null);
      }
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrors({});
    setGreska(null);

    const podaciZaValidaciju = {
      ...predmet,
      godinaNastanka: predmet.godinaNastanka ? Number(predmet.godinaNastanka) : null,
      pocetnaCijena: predmet.pocetnaCijena ? Number(predmet.pocetnaCijena) : null,
      kategorija: odabranaKategorija ? Number(odabranaKategorija) : null
    };

    const rezultat = ShemaPredmet.safeParse(podaciZaValidaciju);

    if (!rezultat.success) {
      console.warn("Zod validacija nije uspjela:", rezultat.error.issues);
      const noveGreske = {};
      rezultat.error.issues.forEach((issue) => {
        const kljuc = issue.path[0];
        if (!noveGreske[kljuc]) {
          noveGreske[kljuc] = issue.message;
        }
      });
      setErrors(noveGreske);
      setGreska("Molimo ispravite pogreške u formi prije slanja.");
      return;
    }

    try {
      const payload = {
        naziv: predmet.naziv,
        opis: predmet.opis,
        godinaNastanka: podaciZaValidaciju.godinaNastanka,
        stanje: predmet.stanje,
        pocetnaCijena: podaciZaValidaciju.pocetnaCijena,
        dodano: predmet.dodano ? new Date(predmet.dodano).toISOString() : null,
        zavrsava: predmet.zavrsava ? new Date(predmet.zavrsava).toISOString() : null,
        kategorija: podaciZaValidaciju.kategorija,
        oznake: odabraneOznake.map(o => Number(o.id)).filter(id => Number.isFinite(id)),
        slike: isjecenaSlikaUrl
      };

      console.log("Šaljem payload na server:", payload);

      await PredmetiServices.dodaj(payload);
      navigate(RouteNames.PREDMETI);
    } catch (error) {
      console.error("Greška prilikom dodavanja predmeta:", error?.response?.data || error);
      setGreska("Došlo je do greške prilikom spremanja predmeta na server.");
    }
  }

  const ocistiGresku = (nazivPolja) => {
    if (errors[nazivPolja]) {
      const noveGreske = { ...errors };
      delete noveGreske[nazivPolja];
      setErrors(noveGreske);
    }
  };

  function handleOznakaKeyDown(e) {
    if (e.key !== "Enter") return;
    // Enter u polju za oznake ne smije poslati cijelu formu.
    e.preventDefault();
    const prvaPonuda = filtrirajOznake()[0];
    if (prvaPonuda && pretragaOznaka.trim() !== "") {
      dodajOznaku(prvaPonuda);
    } else if (pretragaOznaka.trim() !== "" && !oznakaVecPostoji(pretragaOznaka)) {
      kreirajI_DodajOznaku();
    }
  }

  return (
    <Container className="mt-4 mb-5">
      <Heading as="h2" color="azure" className="mb-4">Dodavanje novog predmeta</Heading>

      {greska && <Alert variant="danger">{greska}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Row className="g-3">
          <Col sm={6}>
            <Form.Group controlId="naziv">
              <FormLabel><strong>Naziv</strong></FormLabel>
              <FormControl
                type="text"
                name="naziv"
                value={predmet.naziv}
                onChange={handleChange}
                placeholder="Unesite naziv predmeta"
                isInvalid={!!errors.naziv}
                onFocus={() => ocistiGresku('naziv')}
              />
              <Form.Control.Feedback type="invalid">
                {errors.naziv}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          <Col sm={6}>
            <Form.Group controlId="kategorija">
              <FormLabel><strong>Kategorija</strong></FormLabel>
              <FormSelect
                value={odabranaKategorija}
                onChange={(e) => {
                  setOdabranaKategorija(e.target.value);
                  ocistiGresku('kategorija');
                }}
                isInvalid={!!errors.kategorija}
              >
                <option value="">Odaberi kategoriju</option>
                {kategorije.map(k => <option key={k.id || k.ID || k.Id} value={k.id || k.ID || k.Id}>{k.naziv || k.Naziv || k.name}</option>)}
              </FormSelect>
              <Form.Control.Feedback type="invalid">
                {errors.kategorija}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          {/* SEKCIJA ZA OZNAKE S AUTOCOMPLETE-OM */}
          <Col sm={6}>
            <Card className="p-1 bg-light border" ref={autoCompleteRef}>
              <Form.Group controlId="oznakePretraga" className="position-relative">
                <FormLabel><strong style={{ color: "#ccc", fontSize: ".6rem" }}>Oznake (Pretraži ili dodaj novu)</strong></FormLabel>
                <FormControl
                  type="text"
                  value={pretragaOznaka}
                  placeholder="Upišite naziv oznake..."
                  autoComplete="off"
                  onChange={(e) => { setPretragaOznaka(e.target.value); setPrikaziAutoComplete(true); }}
                  onFocus={() => setPrikaziAutoComplete(true)}
                  onKeyDown={handleOznakaKeyDown}
                />

                {prikaziAutoComplete && (
                  <ul className="list-group position-absolute w-100 shadow bg-white" style={{ zIndex: 1050, maxHeight: '200px', overflowY: 'auto', left: 0, top: '100%' }}>
                    {filtrirajOznake().map((o) => (
                      <li key={o.id} className="list-group-item list-group-item-action" style={{ cursor: 'pointer' }} onClick={() => dodajOznaku(o)}>
                        {o.naziv}
                      </li>
                    ))}
                    {pretragaOznaka.trim() !== "" && !oznakaVecPostoji(pretragaOznaka) && (
                      <li className="list-group-item list-group-item-success fw-bold" style={{ cursor: 'pointer' }} onClick={() => kreirajI_DodajOznaku()}>
                        ➕ Dodaj novu oznaku: "{pretragaOznaka}"
                      </li>
                    )}
                  </ul>
                )}
              </Form.Group>

              <div className="mt-3 d-flex flex-wrap gap-1">
                {odabraneOznake.length === 0 && <small className="text-muted" style={{ fontSize: ".6rem" }}>Nema odabranih oznaka.</small>}
                {odabraneOznake.map((o) => (
                  <span key={o.id} className="badge bg-secondary p-2 d-flex align-items-center gap-1">
                    {o.naziv}
                    <span
                      role="button"
                      aria-label={`Ukloni oznaku ${o.naziv}`}
                      style={{ cursor: 'pointer', fontWeight: 'bold', marginLeft: '5px' }}
                      onClick={() => ukloniOznaku(o.id)}
                    >
                      &times;
                    </span>
                  </span>
                ))}
              </div>
            </Card>
          </Col>

          <Col sm={6}>
            <Form.Group controlId="opis">
              <FormLabel><strong>Opis</strong></FormLabel>
              <FormControl as="textarea" name="opis" rows={3} value={predmet.opis} onChange={handleChange} placeholder="Unesite opis predmeta" isInvalid={!!errors.opis} />
              <Form.Control.Feedback type="invalid">
                {errors.opis}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          <Col sm={3} lg={2}>
            <Form.Group controlId="godinaNastanka">
              <FormLabel>Godina nastanka</FormLabel>
              <FormControl type="number" name="godinaNastanka" value={predmet.godinaNastanka} onChange={handleChange} isInvalid={!!errors.godinaNastanka} />
              <Form.Control.Feedback type="invalid">{errors.godinaNastanka}</Form.Control.Feedback>
            </Form.Group>
          </Col>

          <Col sm={3} lg={2}>
            <Form.Group controlId="stanje">
              <FormLabel>Stanje</FormLabel>
              <FormControl type="text" name="stanje" maxLength="30" value={predmet.stanje} onChange={handleChange} placeholder="npr. Odlično" isInvalid={!!errors.stanje} />
              <Form.Control.Feedback type="invalid">{errors.stanje}</Form.Control.Feedback>
            </Form.Group>
          </Col>

          <Col sm={3} lg={2}>
            <Form.Group controlId="pocetnaCijena">
              <FormLabel>Početna cijena (€)</FormLabel>
              <FormControl type="number" step="0.01" name="pocetnaCijena" value={predmet.pocetnaCijena} onChange={handleChange} isInvalid={!!errors.pocetnaCijena} />
              <Form.Control.Feedback type="invalid">{errors.pocetnaCijena}</Form.Control.Feedback>
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

            {slikaZaCrop && (
              <div className="mb-3">
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
                <Button variant="outline-primary" size="sm" className="mt-2" onClick={potvrdiCrop}>
                  Potvrdi izrezivanje slike
                </Button>
              </div>
            )}

            {isjecenaSlikaUrl && !slikaZaCrop && (
              <div className="text-center p-2 border rounded bg-light">
                <p className="mb-1 text-success fw-bold">Slika uspješno izrezana!</p>
                <BsImage src={isjecenaSlikaUrl} alt="Izrezana slika" style={{ maxHeight: '150px' }} thumbnail />
                <div>
                  <Button variant="link" size="sm" onClick={() => setSlikaZaCrop(isjecenaSlikaUrl)}>
                    Promijeni crop
                  </Button>
                </div>
              </div>
            )}

            {!slikaZaCrop && !isjecenaSlikaUrl && (
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