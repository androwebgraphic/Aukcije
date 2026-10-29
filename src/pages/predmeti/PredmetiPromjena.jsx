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
import { useEffect, useState, useRef } from "react";
import PredmetiServices from "../../services/predmeti/PredmetiServices";
import KategorijeServices from "../../services/kategorije/KategorijeServices";
import OznakeServices from "../../services/oznake/OznakeServices";
import Heading from "../../components/UI/Heading";

export default function PredmetiPromijena() {
  const navigate = useNavigate();
  const params = useParams();
  
  const [predmet, setPredmet] = useState(null);
  const [kategorije, setKategorije] = useState([]);
  const [oznake, setOznake] = useState([]);
  const [odabranaKategorija, setOdabranaKategorija] = useState("");

  const [pretragaOznaka, setPretragaOznaka] = useState("");
  const [odabraneOznake, setOdabraneOznake] = useState([]);
  const [prikaziAutoComplete, setPrikaziAutoComplete] = useState(false);
  const [odabraniid, setOdabraniid] = useState(-1);

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
      const [resKategorije, resOznake, resPredmet] = await Promise.all([
        KategorijeServices.get(),
        OznakeServices.get(),
        PredmetiServices.getByID(params.id)
      ]);

      const katLista = resKategorije.data || resKategorije || [];
      setKategorije(katLista);

      const oznakeLista = resOznake.data || resOznake || [];
      setOznake(oznakeLista);

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

      if (s.oznake) {
        const inicijalneOznake = s.oznake.map(o => {
          if (typeof o === 'object' && o !== null) return o;
          return oznakeLista.find(item => item.id === o || item.sifra === o);
        }).filter(Boolean);
        setOdabraneOznake(inicijalneOznake);
      }

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

  function filtrirajOznake() {
    if (!pretragaOznaka) return [];
    return oznake.filter(o =>
      !odabraneOznake.find(op => op.id === o.id) &&
      o.naziv.toLowerCase().includes(pretragaOznaka.toLowerCase())
    );
  }

  function dodajOznaku(oznaka) {
    if (odabraneOznake.some(o => o.id === oznaka.id)) return;

    setOdabraneOznake([...odabraneOznake, oznaka]);
    setPretragaOznaka("");
    setPrikaziAutoComplete(false);
    setOdabraniid(-1);
  }

  async function dodajIliKreirajOznaku(nazivZaDodavanje) {
    const nazivTrimani = nazivZaDodavanje.trim();
    if (!nazivTrimani) return;

    let postojecaOznaka = oznake.find(o => o.naziv.toLowerCase() === nazivTrimani.toLowerCase());

    if (postojecaOznaka) {
      dodajOznaku(postojecaOznaka);
    } else {
      try {
        const odgovor = await OznakeServices.dodaj({ naziv: nazivTrimani });
        let novaOznaka = odgovor && odgovor.data !== undefined ? odgovor.data : odgovor;

        // Ako servis vrati undefined, osvježimo popis oznaka iz baze kako bismo pronašli novu
        if (!novaOznaka) {
          const resOsvjezeno = await OznakeServices.get();
          const svjezeOznake = resOsvjezeno.data || resOsvjezeno || [];
          setOznake(svjezeOznake);
          
          novaOznaka = svjezeOznake.find(o => o.naziv.toLowerCase() === nazivTrimani.toLowerCase());
        }

        if (novaOznaka) {
          setOznake(prev => {
            if (prev.some(o => o.id === novaOznaka.id)) return prev;
            return [...prev, novaOznaka];
          });
          dodajOznaku(novaOznaka);
        } else {
          console.error("Nije moguće pronaći novu oznaku nakon kreiranja.");
        }
      } catch (error) {
        console.error("Greška prilikom kreiranja nove oznake:", error);
      }
    }
  }

  function ukloniOznaku(sifra) {
    setOdabraneOznake(odabraneOznake.filter(o => o.sifra !== sifra && o.id !== sifra));
  }

  async function handleKeyDown(e) {
    const filtriraneOznake = filtrirajOznake();
    const trebaPrikazatiNovu = pretragaOznaka.trim() !== "" && !oznake.some(o => o.naziv.toLowerCase() === pretragaOznaka.trim().toLowerCase());
    const ukupnoOpcija = filtriraneOznake.length + (trebaPrikazatiNovu ? 1 : 0);

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setOdabraniid(prev => (prev < ukupnoOpcija - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setOdabraniid(prev => (prev > 0 ? prev - 1 : ukupnoOpcija - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (odabraniid >= 0 && odabraniid < filtriraneOznake.length) {
        dodajOznaku(filtriraneOznake[odabraniid]);
      } else if (odabraniid === filtriraneOznake.length && trebaPrikazatiNovu) {
        await dodajIliKreirajOznaku(pretragaOznaka);
      } else if (pretragaOznaka.trim() !== "") {
        await dodajIliKreirajOznaku(pretragaOznaka);
      }
    } else if (e.key === 'Escape') {
      setPrikaziAutoComplete(false);
      setOdabraniid(-1);
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
      oznake: odabraneOznake.map(o => o.id)
    });
  }

  if (!predmet) {
    return (
      <Container className="my-4">
        <Heading as="h4" color="azure">Učitavanje podataka predmeta...</Heading>
      </Container>
    );
  }

  const filtriraneOznake = filtrirajOznake();
  const trebaPrikazatiNovu = pretragaOznaka.trim() !== "" && !oznake.some(o => o.naziv.toLowerCase() === pretragaOznaka.trim().toLowerCase());

  return (
    <>
      <Heading as="h2" color="azure">
        Promjena predmeta: {predmet.naziv}
      </Heading>

      <Form onSubmit={handleSubmit}>
        <Row className="g-3">
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

          {/* Oznake sekcija */}
          <Col sm={6} md={6} ref={autoCompleteRef} style={{ position: 'relative' }}>
            <Form.Group controlId="oznakePretraga">
              <Form.Label>Oznake (Pretraži, dodaj ili upiši novu)</Form.Label>
              <Form.Control
                type="text"
                placeholder="Upišite naziv oznake i pritisnite Enter..."
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

            {prikaziAutoComplete && (filtriraneOznake.length > 0 || trebaPrikazatiNovu) && (
              <ul className="list-group position-absolute w-100 shadow" style={{ zIndex: 1000, maxHeight: '200px', overflowY: 'auto' }}>
                {filtriraneOznake.map((oznaka, id) => (
                  <li
                    key={oznaka.id}
                    className={`list-group-item list-group-item-action ${id === odabraniid ? 'active' : ''}`}
                    style={{ cursor: 'pointer' }}
                    onClick={() => dodajOznaku(oznaka)}
                  >
                    {oznaka.naziv}
                  </li>
                ))}
                {trebaPrikazatiNovu && (
                  <li
                    className={`list-group-item list-group-item-action text-success fw-bold ${odabraniid === filtriraneOznake.length ? 'active' : ''}`}
                    style={{ cursor: 'pointer' }}
                    onClick={() => dodajIliKreirajOznaku(pretragaOznaka)}
                  >
                    + Dodaj novu oznaku: "{pretragaOznaka}"
                  </li>
                )}
              </ul>
            )}

            <div className="mt-2">
              {odabraneOznake.map((oznaka) => (
                <span key={oznaka.id} className="badge bg-secondary me-1 p-2">
                  {oznaka.naziv}{" "}
                  <span 
                    style={{ cursor: 'pointer', marginLeft: '5px', fontWeight: 'bold' }} 
                    onClick={() => ukloniOznaku(oznaka.sifra || oznaka.id)}
                  >
                    &times;
                  </span>
                </span>
              ))}
            </div>
          </Col>

          <Col sm={12} md={6}>
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

          <Col xs={12} md={6}>
            <Form.Group controlId="godinaNastanka">
              <FormLabel>Godina nastanka</FormLabel>
              <FormControl
                type="number"
                name="godinaNastanka"
                defaultValue={predmet.godinaNastanka || ""}
              />
            </Form.Group>
          </Col>

          <Col xs={6} md={3}>
            <Form.Group controlId="stanje">
              <FormLabel>Stanje</FormLabel>
              <FormControl
                type="text"
                name="stanje"
                defaultValue={predmet.stanje || ""}
              />
            </Form.Group>
          </Col>

          <Col xs={12} md={3}>
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

          <Col xs={6} md={3}>
            <Form.Group controlId="dodano">
              <FormLabel>Dodano</FormLabel>
              <FormControl
                type="datetime-local"
                step="1"
                name="dodano"
                defaultValue={predmet.dodano || ""}
              />
            </Form.Group>
          </Col>

          <Col xs={12} md={3}>
            <Form.Group controlId="zavrsava">
              <FormLabel>Završava</FormLabel>
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
    </>
  );
}