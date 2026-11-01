import { Button, Col, Form, FormSelect, Row, Alert } from "react-bootstrap";
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
  
  const [slike, setSlike] = useState([]);
  const [slikeError, setSlikeError] = useState("");
  
  const autoCompleteRef = useRef(null);
  const navigate = useNavigate(); 

  const formatirajZaInput = (d) => {
    const pad = (n) => (n < 10 ? "0" + n : n);
    return (
      d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()) +
      "T" + pad(d.getHours()) + ":" + pad(d.getMinutes()) + ":" + pad(d.getSeconds())
    );
  };

  const trenutakDodavanja = new Date();
  const dodanoStr = formatirajZaInput(trenutakDodavanja);
  const trenutakZavrsetka = new Date(trenutakDodavanja.getTime() + 7 * 24 * 60 * 60 * 1000);
  const zavrsavaStr = formatirajZaInput(trenutakZavrsetka);

  useEffect(() => {
    ucitajKategorije(); ucitajOznake(); ucitajPredmete();
    function handleClickOutside(event) {
      if (autoCompleteRef.current && !autoCompleteRef.current.contains(event.target)) {
        setPrikaziAutoComplete(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function ucitajKategorije() { try { const o = await KategorijeServices.get(); setKategorije(o.data || o); } catch (e) { console.error(e); } }
  async function ucitajOznake() { try { const o = await OznakeServices.get(); setOznake(o.data || o); } catch (e) { console.error(e); } }
  async function ucitajPredmete() { try { const o = await PredmetiServices.get(); setPredmeti(o.data || o); } catch (e) { console.error(e); } }

  function filtrirajOznake() {
    if (!pretragaOznaka) return oznake.filter(o => !odabraneOznake.find(op => op.id === o.id));
    return oznake.filter(o => !odabraneOznake.find(op => op.id === o.id) && o.naziv.toLowerCase().includes(pretragaOznaka.toLowerCase()));
  }

  function dodajOznaku(oznaka) {
    if (odabraneOznake.some(o => o.id === oznaka.id) )
      return;
    setOdabraneOznake([...odabraneOznake, oznaka]);
    setPretragaOznaka("");
    setPrikaziAutoComplete(false);
    setOdabraniid(-1);
  }

  async function dodajIliKreirajOznaku(nazivZaDodavanje) {
    const nazivTrimani = nazivZaDodavanje.trim();
    if (!nazivTrimani) return;
    let postojeca = oznake.find(o => o.naziv.toLowerCase() === nazivTrimani.toLowerCase());

    if (postojeca) {
      dodajOznaku(postojeca);
    } else {
      try {
        const odgovor = await OznakeServices.dodaj({ naziv: nazivTrimani });
        let nova = odgovor && odgovor.data !== undefined ? odgovor.data : odgovor;
        if (!nova) {
          const osvjezeno = await OznakeServices.get();
          setOznake(osvjezeno.data || osvjezeno || []);
          nova = (osvjezeno.data || osvjezeno).find(o => o.naziv.toLowerCase() === nazivTrimani.toLowerCase());
        }
        if (nova) {
          setOznake(prev => prev.some(o =>o.id === nova.id) ? prev : [...prev, nova]);
          dodajOznaku(nova);
        }
      } catch (e) { console.error(e); }
    }
  }

  function ukloniOznaku(id) {
    setOdabraneOznake(odabraneOznake.filter(o => o.id!== id));
  }

  async function handleKeyDown(e) {
    const filtrirane = filtrirajOznake();
    const prikaziNovu = pretragaOznaka.trim() !== "" && !oznake.some(o => o.naziv.toLowerCase() === pretragaOznaka.trim().toLowerCase());
    const ukupno = filtrirane.length + (prikaziNovu ? 1 : 0);

    if (e.key === 'ArrowDown') { e.preventDefault(); setOdabraniid(prev => (prev < ukupno - 1 ? prev + 1 : 0)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setOdabraniid(prev => (prev > 0 ? prev - 1 : ukupno - 1)); }
    else if (e.key === 'Enter') {
      e.preventDefault();
      if (odabraniid >= 0 && odabraniid < filtrirane.length) dodajOznaku(filtrirane[odabraniid]);
      else if (odabraniid === filtrirane.length && prikaziNovu) await dodajIliKreirajOznaku(pretragaOznaka);
      else if (pretragaOznaka.trim() !== "") await dodajIliKreirajOznaku(pretragaOznaka);
    }
  }

  function handleImageChange(e) {
    const odabrane = Array.from(e.target.files);
    if (odabrane.length > 5) { setSlikeError("Najviše 5 slika."); setSlike([]); }
    else { setSlikeError(""); setSlike(odabrane); }
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (slikeError) return;
    const podatci = new FormData(e.target);

    Promise.all(slike.map(f => new Promise((resolve, reject) => {
      const r = new FileReader(); r.readAsDataURL(f); r.onload = () => resolve(r.result); r.onerror = reject;
    }))).then(async base64Slike => {
      await PredmetiServices.dodaj({
        naziv: podatci.get("naziv") || "",
        kategorija: parseInt(podatci.get("kategorije")) || 0,
        godinaNastanka: parseInt(podatci.get("godinaNastanka")) || 0,
        opis: podatci.get("opis") || "",
        stanje: podatci.get("stanje") || "",
        pocetnaCijena: parseFloat(podatci.get("cijena")) || 0,
        dodano: trenutakDodavanja.toISOString(),
        zavrsava: trenutakZavrsetka.toISOString(),
        oznake: odabraneOznake.map(o => o.id),
        slike: base64Slike,
      });
      navigate(RouteNames.PREDMETI);
    });
  }

  const filtriraneOznake = filtrirajOznake();
  const trebaPrikazatiNovu = pretragaOznaka.trim() !== "" && !oznake.some(o => o.naziv.toLowerCase() === pretragaOznaka.trim().toLowerCase());

  return (
    <>
      <Heading as="h2" color="azure">Dodaj predmet</Heading>
      <Form onSubmit={handleSubmit}>
        <Row className="g-3">
          <Col sm={12} md={6}><Form.Group controlId="naziv"><Form.Label>Naziv</Form.Label><Form.Control type="text" name="naziv" required /></Form.Group></Col>
          <Col sm={6} md={6}><Form.Group controlId="kategorije"><Form.Label>Kategorija</Form.Label>
            <FormSelect name="kategorije" required><option value="">Odaberi...</option>{kategorije.map(k => <option key={k.id} value={k.id}>{k.naziv}</option>)}</FormSelect>
          </Form.Group></Col>
          
          <Col sm={6} md={6} ref={autoCompleteRef} style={{ position: 'relative' }}>
            <Form.Group controlId="oznakePretraga"><Form.Label>Oznake</Form.Label>
              <Form.Control type="text" value={pretragaOznaka} onChange={(e) => { setPretragaOznaka(e.target.value); setPrikaziAutoComplete(true); }} onKeyDown={handleKeyDown} onFocus={() => setPrikaziAutoComplete(true)} />
            </Form.Group>
            
            {prikaziAutoComplete && (filtriraneOznake.length > 0 || trebaPrikazatiNovu) && (
              <ul className="list-group position-absolute w-100 shadow" style={{ zIndex: 1000, maxHeight: '200px', overflowY: 'auto' }}>
                {filtriraneOznake.map((o, id) => (
                  <li key={`oznaka-${o.id || id}`} className={`list-group-item list-group-item-action ${id === odabraniid ? 'active' : ''}`} style={{ cursor: 'pointer' }} onMouseDown={() => dodajOznaku(o)}>{o.naziv}</li>
                ))}
                {trebaPrikazatiNovu && (
                  <li key="nova-oznaka" className={`list-group-item list-group-item-action text-success fw-bold ${odabraniid === filtriraneOznake.length ? 'active' : ''}`} style={{ cursor: 'pointer' }} onMouseDown={() => dodajIliKreirajOznaku(pretragaOznaka)}>
                    + Dodaj novu: "{pretragaOznaka}"
                  </li>
                )}
              </ul>
            )}

            <div className="mt-2">
              {odabraneOznake.map((o, i) => (
                <span key={`odabrana-${o.id || i}`} className="badge bg-secondary me-1 p-2">{o.naziv}{" "}<span style={{ cursor: 'pointer' }} onClick={() => ukloniOznaku(o.id)}>&times;</span></span>
              ))}
            </div>
          </Col>

          <Col sm={6} md={6}><Form.Group controlId="opis"><Form.Label>Opis</Form.Label><Form.Control as="textarea" name="opis" rows={3} /></Form.Group></Col>
          <Col xs={6} md={3}><Form.Group controlId="godinaNastanka"><Form.Label>Godina</Form.Label><Form.Control type="number" name="godinaNastanka" /></Form.Group></Col>
          <Col xs={6} md={3}><Form.Group controlId="stanje"><Form.Label>Stanje</Form.Label><Form.Control type="text" name="stanje" /></Form.Group></Col>
          <Col xs={6} md={3}><Form.Group controlId="cijena"><Form.Label>Cijena</Form.Label><Form.Control type="number" step="0.01" name="cijena" /></Form.Group></Col>
          
          <Col sm={6} md={3}>
            <Form.Group controlId="slike">
              <Form.Label>Učitaj slike (max 5)</Form.Label>
              <Form.Control type="file" multiple accept="image/*" onChange={handleImageChange} />
              {slikeError && <Alert variant="danger" className="mt-2">{slikeError}</Alert>}
            </Form.Group>
          </Col>
        </Row>
        <Row className="mt-4">
          <Col sm={6}><Button type="submit" variant="success" className="w-50">Dodaj</Button></Col>
          <Col sm={6}><Button variant="danger" className="w-50"><Link to={RouteNames.PREDMETI} style={{ color: 'white' }}>Odustani</Link></Button></Col>
        </Row>
      </Form>
    </>
  );
}