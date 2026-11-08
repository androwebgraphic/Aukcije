import { Button, Col, Container, Form, FormSelect, FormControl, FormLabel, Row, Alert, Card } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { RouteNames } from "../../constants";
import { useEffect, useState, useRef } from "react";
import PredmetiServices from "../../services/predmeti/PredmetiServices";
import KategorijeServices from "../../services/kategorije/KategorijeServices";
import OznakeServices from "../../services/oznake/OznakeServices";
import Heading from "../../components/UI/Heading";
import { FaEdit } from "react-icons/fa";
import { TbPencilCancel } from "react-icons/tb";
import { MdDelete } from "react-icons/md";

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

  useEffect(() => {
    if (odabraneOznake.length > 0 && oznake.length > 0) {
      const mapirane = odabraneOznake.map(item => {
        if (typeof item === 'object' && item !== null && item.naziv) {
          return item;
        }
        const idTrazenog = typeof item === 'object' ? (item.id || item.sifra) : item;
        const pronadjena = oznake.find(o => String(o.id || o.sifra) === String(idTrazenog));
        return pronadjena || item; 
      });
      
      const trebaAzurirati = JSON.stringify(mapirane) !== JSON.stringify(odabraneOznake);
      if (trebaAzurirati) {
        setOdabraneOznake(mapirane);
      }
    }
  }, [oznake]);

  async function ucitajPodatke() {
    try {
      let ucitaneOznake = [];

      try {
        const resOznake = await OznakeServices.get();
        ucitaneOznake = resOznake?.data || resOznake || [];
      } catch (err) {
        console.warn("API za oznake nije dostupan, čitam iz localStorage-a");
      }

      if (!ucitaneOznake || ucitaneOznake.length === 0) {
        ucitaneOznake = JSON.parse(localStorage.getItem("oznake")) || [
          { id: 1, naziv: "Satovi" },
          { id: 2, naziv: "Knjige" },
          { id: 3, naziv: "Umjetnost" },
          { id: 4, naziv: "Tehnologija" }
        ];
        localStorage.setItem("oznake", JSON.stringify(ucitaneOznake));
      }
      setOznake(ucitaneOznake);

      let ucitaneKategorije = [];
      try {
        const resKategorije = await KategorijeServices.get();
        ucitaneKategorije = resKategorije?.data || resKategorije || [];
      } catch (err) {
        console.warn("API za kategorije nije dostupan, čitam iz localStorage-a");
      }

      if (!ucitaneKategorije || ucitaneKategorije.length === 0) {
        ucitaneKategorije = JSON.parse(localStorage.getItem("kategorije")) || [
          { id: 1, naziv: "Antikviteti" },
          { id: 2, naziv: "Informatika" },
          { id: 3, naziv: "Kolekcionarstvo" }
        ];
        localStorage.setItem("kategorije", JSON.stringify(ucitaneKategorije));
      }
      setKategorije(ucitaneKategorije);

      if (params.id) {
        let s = null;
        
        const lokalniPredmeti = JSON.parse(localStorage.getItem("predmeti")) || [];
        s = lokalniPredmeti.find(p => String(p.id || p.sifra) === String(params.id));

        if (!s) {
          try {
            const odgovorPredmet = await PredmetiServices.getByID(params.id);
            s = odgovorPredmet?.data !== undefined ? odgovorPredmet.data : odgovorPredmet;
          } catch (err) {
            console.warn("Predmet nije pronađen preko servisa:", err);
          }
        }

        if (s && Object.keys(s).length > 0) {
          if (s.dodano && typeof s.dodano === 'string') s.dodano = s.dodano.substring(0, 16);
          if (s.zavrsava && typeof s.zavrsava === 'string') s.zavrsava = s.zavrsava.substring(0, 16);

          setPredmet(s); 
          setSlike(s.slike || []);
          
          if (s.oznake) {
            const mapiraneOznake = s.oznake.map(item => {
              if (typeof item === 'object' && item !== null && item.naziv) {
                return item;
              }
              const idTrazenog = typeof item === 'object' ? (item.id || item.sifra) : item;
              return ucitaneOznake.find(o => String(o.id || o.sifra) === String(idTrazenog)) || item;
            });
            setOdabraneOznake(mapiraneOznake);
          }
          
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
    return oznake.filter(o => {
      const vecOdabrana = odabraneOznake.some(op => String(op.id || op.sifra) === String(o.id || o.sifra));
      if (vecOdabrana) return false;

      if (!pretragaOznaka.trim()) return true;

      return o.naziv && o.naziv.toLowerCase().includes(pretragaOznaka.toLowerCase());
    });
  }

  function dodajOznaku(oznaka) {
    if (odabraneOznake.some(o => String(o.id || o.sifra) === String(oznaka.id || oznaka.sifra))) return;
    setOdabraneOznake([...odabraneOznake, oznaka]); 
    setPretragaOznaka(""); 
    setPrikaziAutoComplete(false);
  }

  async function kreirajI_DodajOznaku() {
    const nazivOznake = pretragaOznaka.trim();
    if (!nazivOznake) return;

    try {
      let novaOznaka = null;
      
      try {
        const odgovor = await OznakeServices.dodaj({ naziv: nazivOznake });
        novaOznaka = odgovor?.data !== undefined ? odgovor.data : odgovor;
      } catch {
        novaOznaka = null;
      }

      // Osiguravamo da je novaOznaka uvijek objekt s ID-jem/šifrom i nazivom
      if (!novaOznaka || typeof novaOznaka !== 'object' || (!novaOznaka.id && !novaOznaka.sifra)) {
        novaOznaka = { id: Date.now(), naziv: nazivOznake };
      }

      // Ako backend vrati objekt bez naziva (npr. vrati samo ID), ručno mu pridružimo upisani naziv
      if (!novaOznaka.naziv) {
        novaOznaka.naziv = nazivOznake;
      }

      const azuriraneOznake = [...oznake, novaOznaka];
      setOznake(azuriraneOznake);
      setOdabraneOznake(prev => [...prev, novaOznaka]);
      localStorage.setItem("oznake", JSON.stringify(azuriraneOznake));

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
    
    const azuriraniPredmet = {
      id: params.id,
      naziv: predmet.naziv || "",
      opis: predmet.opis || "",
      godinaNastanka: predmet.godinaNastanka ? Number(predmet.godinaNastanka) : null,
      stanje: predmet.stanje || "",
      pocetnaCijena: predmet.pocetnaCijena ? Number(predmet.pocetnaCijena) : null,
      dodano: predmet.dodano || "",
      zavrsava: predmet.zavrsava || "",
      kategorija: odabranaKategorija || null,
      oznake: odabraneOznake,
      slike: slike
    };

    try {
      const pohranjeniPredmeti = JSON.parse(localStorage.getItem("predmeti")) || [];
      const indeks = pohranjeniPredmeti.findIndex(p => String(p.id || p.sifra) === String(params.id));
      
      if (indeks !== -1) {
        pohranjeniPredmeti[indeks] = azuriraniPredmet;
      } else {
        pohranjeniPredmeti.push(azuriraniPredmet);
      }
      
      localStorage.setItem("predmeti", JSON.stringify(pohranjeniPredmeti));
      
      navigate(RouteNames.PREDMETI);
    } catch (error) {
      console.error("Greška prilikom spremanja:", error);
      alert("Greška prilikom spremanja: " + error.message);
    }
  }

  return (
    <Container className="mt-4 mb-5">
      <Heading as="h2" color="azure" className="mb-4">
        Promjena predmeta: {predmet?.naziv || ""}
      </Heading>

      <Form onSubmit={handleSubmit}>
        <Row className="g-3">
          {/* Naziv */}
          <Col xs={12} md={6}>
            <Form.Group>
              <Form.Label>Naziv</Form.Label>
              <Form.Control
                type="text"
                name="naziv"
                value={predmet.naziv || ""}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>

          {/* Kategorija */}
          <Col xs={12} md={6}>
            <Form.Group>
              <Form.Label>Kategorija</Form.Label>
              <FormSelect 
                value={odabranaKategorija} 
                onChange={(e) => setOdabranaKategorija(e.target.value)}
              >
                <option value="">Odaberi kategoriju</option>
                {kategorije.map(kat => (
                  <option key={kat.id || kat.sifra} value={kat.id || kat.sifra}>
                    {kat.naziv}
                  </option>
                ))}
              </FormSelect>
            </Form.Group>
          </Col>

          {/* Opis */}
          <Col xs={12}>
            <Form.Group>
              <Form.Label>Opis</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="opis"
                value={predmet.opis || ""}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>

          {/* Godina nastanka */}
          <Col xs={12} md={4}>
            <Form.Group>
              <Form.Label>Godina nastanka</Form.Label>
              <Form.Control 
                type="number" 
                name="godinaNastanka" 
                value={predmet.godinaNastanka || ""} 
                onChange={handleChange} 
              />
            </Form.Group>
          </Col>

          {/* Stanje */}
          <Col xs={12} md={4}>
            <Form.Group>
              <Form.Label>Stanje</Form.Label>
              <Form.Control 
                type="text" 
                name="stanje" 
                value={predmet.stanje || ""} 
                onChange={handleChange} 
              />
            </Form.Group>
          </Col>

          {/* Početna cijena */}
          <Col xs={12} md={4}>
            <Form.Group>
              <Form.Label>Početna cijena</Form.Label>
              <Form.Control 
                type="number" 
                step="0.01" 
                name="pocetnaCijena" 
                value={predmet.pocetnaCijena || ""} 
                onChange={handleChange} 
              />
            </Form.Group>
          </Col>

          {/* Dodano */}
          <Col xs={12} md={6}>
            <Form.Group>
              <Form.Label>Dodano</Form.Label>
              <Form.Control 
                type="datetime-local" 
                name="dodano" 
                value={predmet.dodano || ""} 
                onChange={handleChange} 
              />
            </Form.Group>
          </Col>

          {/* Završava */}
          <Col xs={12} md={6}>
            <Form.Group>
              <Form.Label>Završava</Form.Label>
              <Form.Control 
                type="datetime-local" 
                name="zavrsava" 
                value={predmet.zavrsava || ""} 
                onChange={handleChange} 
              />
            </Form.Group>
          </Col>

          {/* Oznake */}
          <Col xs={12} md={6}>
            <Form.Group className="position-relative" ref={autoCompleteRef}>
              <Form.Label>Oznake</Form.Label>
              <div className="d-flex flex-wrap gap-2 mb-2">
                {odabraneOznake.map((oznaka, index) => (
                  <span key={index} className="badge bg-secondary d-flex align-items-center gap-1 p-2">
                    {oznaka.naziv}
                    <button 
                      type="button" 
                      className="btn-close btn-close-white btn-sm" 
                      onClick={() => setOdabraneOznake(odabraneOznake.filter((_, i) => i !== index))}
                    ></button>
                  </span>
                ))}
              </div>

              <div className="position-relative">
                <Form.Control 
                  type="text" 
                  placeholder="Klikni za popis oznaka ili upiši za pretragu..." 
                  value={pretragaOznaka}
                  onChange={(e) => {
                    setPretragaOznaka(e.target.value);
                    setPrikaziAutoComplete(true);
                  }}
                  onFocus={() => setPrikaziAutoComplete(true)}
                />

                {prikaziAutoComplete && (
                  <div className="list-group position-absolute w-100 shadow bg-white border rounded mt-1" style={{ zIndex: 1000, maxHeight: "200px", overflowY: "auto" }}>
                    {filtrirajOznake().length > 0 ? (
                      filtrirajOznake().map(o => (
                        <button 
                          type="button" 
                          key={o.id || o.sifra} 
                          className="list-group-item list-group-item-action"
                          onClick={() => dodajOznaku(o)}
                        >
                          {o.naziv}
                        </button>
                      ))
                    ) : (
                      <div className="p-2 text-muted text-center">Nema pronađenih oznaka</div>
                    )}

                    {pretragaOznaka.trim() !== "" && !oznakaVecPostoji(pretragaOznaka) && (
                      <button 
                        type="button" 
                        className="list-group-item list-group-item-action text-primary fw-bold border-top"
                        onClick={kreirajI_DodajOznaku}
                      >
                        + Dodaj novu oznaku: "{pretragaOznaka}"
                      </button>
                    )}
                  </div>
                )}
              </div>
            </Form.Group>
          </Col>

          {/* Slike */}
          <Col xs={12} md={6}>
            <Form.Group>
              <Form.Label>Slike (maksimalno 5)</Form.Label>
              <Form.Control 
                type="file" 
                multiple 
                accept="image/*" 
                onChange={handleImageChange} 
              />
              {slikeError && <Alert variant="danger" className="mt-2">{slikeError}</Alert>}
              
              <div className="d-flex flex-wrap gap-2 mt-3">
                {slike.map((slika, index) => (
                  <div key={index} className="position-relative">
                    <img 
                      src={slika} 
                      alt="Pregled" 
                      style={{ width: "100px", height: "100px", objectFit: "cover" }} 
                      className="rounded border"
                    />
                    <button 
                      type="button" 
                      className="btn btn-danger btn-sm position-absolute top-0 end-0 p-1"
                      onClick={() => setSlike(slike.filter((_, i) => i !== index))}
                    >
                      <MdDelete size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </Form.Group>
          </Col>

          {/* Gumbi za akciju */}
          <Col xs={6} md={3} className="mt-4">
            <Button 
              variant="outline-success" 
              type="submit" 
              className="w-100 d-flex align-items-center justify-content-center gap-2 py-2"
              size="sm"

            >
         Promijeni
            </Button>
          </Col>

          <Col xs={6} md={3} className="mt-4">
            <Button 
              variant="outline-danger" 
              type="button" 
              className="w-100 d-flex align-items-center justify-content-center gap-2 py-2" 
              size="sm"
              onClick={() => navigate(RouteNames.PREDMETI)}
            >
            Odustani
            </Button>
          </Col>
        </Row>
      </Form>
    </Container>
  );
}