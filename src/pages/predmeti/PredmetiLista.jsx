import { useEffect, useState } from "react";
import PredmetiServices from "../../services/predmeti/PredmetiServices";
import KategorijeServices from "../../services/kategorije/KategorijeServices";
import OznakeServices from "../../services/oznake/OznakeServices";
import { Row, Col, Card, Button, Badge, Form, Carousel, Pagination } from "react-bootstrap";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { RouteNames } from "../../constants";
import { FaArrowTurnUp, FaFire } from "react-icons/fa6";
import Heading from "../../components/UI/Heading";
import { motion } from "framer-motion";
import IkonaKategorije from "../../components/UI/IkonaKategorije";
import { LordIcon } from "@lordicon/react";

function ExpandableText({ text, maxLength = 100 }) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!text) return null;

  if (text.length <= maxLength) {
    return <span>{text}</span>;
  }

  const displayedText = isExpanded ? text : `${text.substring(0, maxLength)}`;

  return (
    <span>
      {displayedText}
      <span
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          color: "green",
          cursor: "pointer",
          marginLeft: ".2rem",
          fontWeight: "bold",
        }}>
        {isExpanded ? <FaArrowTurnUp /> : "..."}
      </span>
    </span>
  );
}

// Pomoćna komponenta za dinamičko odbrojavanje i vraćanje stanja
function AukcijaOdbrojavanje({ zavrsavaDatum, onStatusChange }) {
  const [preostaloVrijeme, setPreostaloVrijeme] = useState("");
  const [statusBoja, setStatusBoja] = useState("text-muted");
  const [jeZavrseno, setJeZavrseno] = useState(false);
  const [jeVruce, setJeVruce] = useState(false); // Manje od 5 minuta

  function izracunajVrijeme(postDate) {
    if (!postDate) return { tekst: "Nema datuma", boja: "text-muted", zavrseno: false, vruce: false };
    
    const endDate = new Date(postDate);
    if (isNaN(endDate.getTime())) return { tekst: "Nevažeći datum", boja: "text-muted", zavrseno: false, vruce: false };
    
    const targetDate = postDate instanceof Date ? new Date(postDate.getTime() + 7 * 24 * 60 * 60 * 1000) : endDate;
    const now = new Date();
    const diff = targetDate - now;

    if (diff <= 0) {
      return { tekst: "Aukcija je završila", boja: "text-danger fw-bold", zavrseno: true, vruce: false };
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const totalMinutes = Math.floor(diff / (1000 * 60));

    let boja = "text-secondary";
    let vruce = false;

    // Manje od 5 minuta do isteka
    if (totalMinutes <= 5) {
      boja = "text-danger fw-bold";
      vruce = true;
    } 
    // Manje od 1 dana (24 sata = 1440 minuta)
    else if (totalMinutes <= 1440) {
      boja = "text-warning fw-bold";
    }

    let tekst = `${days}d ${hours}h ${minutes}m`;
    if (days === 0) {
      tekst = `${hours}h ${minutes}m`;
    }

    return { tekst, boja, zavrseno: false, vruce };
  }

  useEffect(() => {
    function azuriraj() {
      const rezultat = izracunajVrijeme(zavrsavaDatum);
      setPreostaloVrijeme(rezultat.tekst);
      setStatusBoja(rezultat.boja);
      setJeZavrseno(rezultat.zavrseno);
      setJeVruce(rezultat.vruce);
      
      if (onStatusChange) {
        onStatusChange(rezultat.zavrseno);
      }
    }

    azuriraj();
    const interval = setInterval(azuriraj, 1000);

    return () => clearInterval(interval);
  }, [zavrsavaDatum]);

  return (
    <div className={`mt-1 ${statusBoja} d-flex align-items-center gap-1`}>
      <span><strong>Preostalo:</strong> {preostaloVrijeme}</span>
      {jeVruce && <FaFire className="text-danger animate-bounce" title="Aukcija uskoro završava!" />}
    </div>
  );
}

function formatirajDatum(datumVrijednost) {
  if (!datumVrijednost) return "-";
  const datum = new Date(datumVrijednost);
  if (isNaN(datum.getTime())) return "-";

  return datum.toLocaleString("hr-HR", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

function dohvatiIzvorSlike(slikaItem) {
  if (!slikaItem) return "";
  const slika = typeof slikaItem === 'object' ? (slikaItem.url || slikaItem.putanja || slikaItem.slika) : slikaItem;
  
  if (typeof slika !== 'string') return "";
  if (slika.startsWith("data:") || slika.startsWith("http")) return slika;
  
  return `data:image/jpeg;base64,${slika}`;
}

export default function PredmetiList() {
  const [predmeti, setPredmeti] = useState([]);
  const [kategorije, setKategorije] = useState([]);
  const [oznake, setOznake] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); 
  const [sortiranje, setSortiranje] = useState("naziv-asc"); // State za sortiranje
  const [zavrseneAukcije, setZavrseneAukcije] = useState({}); 
  
  const [stranica, setStranica] = useState(1);
  const [velicinaStranice, setVelicinaStranice] = useState(6);

  const navigate = useNavigate();
  const params = useParams();
  const [searchParams] = useSearchParams();
  const kategorijaFilter = searchParams.get("kategorija");

  useEffect(() => {
    setStranica(1);
  }, [params.id, kategorijaFilter]);

  useEffect(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        window.scrollTo(0, 0);
      });
    });
  }, [stranica]);

  useEffect(() => {
    async function ucitajSve() {
      try {
        await Promise.all([
          ucitajKategorije(),
          ucitajOznake()
        ]);
        await ucitajPredmete();
      } catch (error) {
        console.error("Greška pri inicijalnom učitavanju:", error);
      }
    }
    ucitajSve();
  }, []);

  async function ucitajPredmete() {
    try {
      const odgovor = await PredmetiServices.dohvatiStranicu(1, 1000); 
      setPredmeti(odgovor.data || odgovor || []);
    } catch (error) {
      console.error("Greška pri dohvaćanju predmeta:", error);
    }
  }

  async function ucitajKategorije() {
    try {
      const odgovor = await KategorijeServices.get();
      setKategorije(odgovor.data || odgovor);
    } catch (error) {
      console.error("Greška pri dohvaćanju kategorija:", error);
    }
  }

  async function ucitajOznake() {
    try {
      const odgovor = await OznakeServices.get();
      setOznake(odgovor.data || odgovor);
    } catch (error) {
      console.error("Greška pri dohvaćanju oznaka:", error);
    }
  }

  async function obrisi(id) {
    if (!confirm("Želite obrisati?")) {
      return;
    }
    await PredmetiServices.obrisi(id);
    ucitajPredmete();
  }

  function prikaziNazivKategorije(kategorijaVal) {
    if (!kategorijaVal) return "Nepoznato";
    if (typeof kategorijaVal === 'object' && kategorijaVal.naziv) {
      return kategorijaVal.naziv;
    }
    const kategorija = kategorije.find((s) => s.id === parseInt(kategorijaVal));
    return kategorija ? kategorija.naziv : "Nepoznato";
  }

  function dohvatiIdKategorije(kategorijaVal) {
    if (kategorijaVal === null || kategorijaVal === undefined) return null;
    if (typeof kategorijaVal === 'object') {
      return Number(
        kategorijaVal.id ?? 
        kategorijaVal.sifra ?? 
        kategorijaVal.kategorijaId ?? 
        kategorijaVal.kategorija_id ?? 
        null
      );
    }
    const parsed = Number(kategorijaVal);
    return isNaN(parsed) ? null : parsed;
  }

  function prikaziNazivOznake(oznakaItem) {
    if (!oznakaItem) return "Nepoznato";
    if (typeof oznakaItem === 'object') {
      return oznakaItem.naziv || oznakaItem.name || JSON.stringify(oznakaItem);
    }
    const o = oznake.find((item) => 
      String(item.id) === String(oznakaItem) || 
      String(item.sifra) === String(oznakaItem)
    );
    return o ? o.naziv : `Oznaka ID: ${oznakaItem}`;
  }

  const aktivnaKategorijaNaziv = params.id 
    ? prikaziNazivKategorije(parseInt(params.id)) 
    : kategorijaFilter;

  // Filtriranje i sortiranje predmeta
  const filtriraniPredmeti = predmeti.filter((c) => {
    let zadovoljavaKategoriju = true;
    if (params.id) {
      const katIdIzUrl = parseInt(params.id);
      const predmetKatId = dohvatiIdKategorije(c.kategorija);
      zadovoljavaKategoriju = predmetKatId === katIdIzUrl;
    } else if (kategorijaFilter) {
      const nazivKat = prikaziNazivKategorije(c.kategorija);
      zadovoljavaKategoriju = nazivKat.toLowerCase() === kategorijaFilter.toLowerCase();
    }

    const zadovoljavaPretragu = searchTerm 
      ? c.naziv && c.naziv.toLowerCase().includes(searchTerm.toLowerCase())
      : true;

    return zadovoljavaKategoriju && zadovoljavaPretragu;
  }).sort((a, b) => {
    if (sortiranje === "naziv-asc") {
      return (a.naziv || "").localeCompare(b.naziv || "", "hr");
    }
    if (sortiranje === "naziv-desc") {
      return (b.naziv || "").localeCompare(a.naziv || "", "hr");
    }
    if (sortiranje === "datum-postavljanja-asc") {
      return new Date(a.dodano || 0) - new Date(b.dodano || 0);
    }
    if (sortiranje === "datum-postavljanja-desc") {
      return new Date(b.dodano || 0) - new Date(a.dodano || 0);
    }
    if (sortiranje === "datum-zavrsetka-asc") {
      return new Date(a.zavrsava || a.dodano || 0) - new Date(b.zavrsava || b.dodano || 0);
    }
    if (sortiranje === "datum-zavrsetka-desc") {
      return new Date(b.zavrsava || b.dodano || 0) - new Date(a.zavrsava || a.dodano || 0);
    }
    return 0;
  });

  const ukupnoStavki = filtriraniPredmeti.length;
  const ukupnoStranica = Math.ceil(ukupnoStavki / velicinaStranice) || 1;

  useEffect(() => {
    if (stranica > ukupnoStranica) {
      setStranica(1);
    }
  }, [ukupnoStranica, stranica]);

  const zadnjiIndeks = stranica * velicinaStranice;
  const prviIndeks = zadnjiIndeks - velicinaStranice;
  const predmetiNaStranici = filtriraniPredmeti.slice(prviIndeks, zadnjiIndeks);

  function dohvatiIkonaKategorije(kategorijaVal){
    const katId = dohvatiIdKategorije(kategorijaVal);
    const kat = kategorije.find(k => k.id === katId);
    return kat ? kat.ikona : "";
  }

  let items = [];
  for (let number = 1; number <= ukupnoStranica; number++) {
    items.push(
      <Pagination.Item 
        key={number} 
        active={number === stranica}
        onClick={() => setStranica(number)}
      >
        {number}
      </Pagination.Item>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: -1000 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, ease: "easeOut", delay: 0.2 }}
      >
        <Heading as="h2" color="azure" className=" mb-2 mt-0">
          Lista predmeta  {aktivnaKategorijaNaziv ? `- ${aktivnaKategorijaNaziv.toUpperCase()}` : ""} ({ukupnoStavki})
        </Heading>
        <p style={{color:"orange"}} className="m-3 text-center">trenutno ste na stranici {stranica} / {ukupnoStranica} stranica</p>

        <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
          <Link to={RouteNames.PREDMET_NOVI} className="m-3">
            <Button variant="success" size="sm">Dodaj predmet</Button>
          </Link>

          <div className="d-flex align-items-center gap-2 flex-wrap">
            {/* Izbornik sortiranja */}
            <div className="d-flex align-items-center gap-1">
              <span className="fs-7" style={{ whiteSpace: 'nowrap', color:'orange' }}>Sortiraj:</span>
              <Form.Select
                size="sm"
                value={sortiranje}
                onChange={(e) => {
                  setSortiranje(e.target.value);
                  setStranica(1);
                }}
                style={{ width: '170px' }}
              >
                <option value="naziv-asc">Abecedi (A-Z)</option>
                <option value="naziv-desc">Abecedi (Z-A)</option>
                <option value="datum-postavljanja-desc">Datumu postavljanja (Novo)</option>
                <option value="datum-postavljanja-asc">Datumu postavljanja (Staro)</option>
                <option value="datum-zavrsetka-asc">Datumu završetka (Uskoro)</option>
                <option value="datum-zavrsetka-desc">Datumu završetka (Kasnije)</option>
              </Form.Select>
            </div>

            <div className="d-flex align-items-center gap-1">
              <span className="fs-7" style={{ whiteSpace: 'nowrap', color:'orange' }}>Prikaz:</span>
              <Form.Select
                size="sm"
                value={velicinaStranice}
                onChange={(e) => {
                  setVelicinaStranice(parseInt(e.target.value));
                  setStranica(1); 
                }}
                style={{ width: '75px' }}
              >
                <option value="3">3</option>
                <option value="6">6</option>
                <option value="9">9</option>
                <option value="12">12</option>
                <option value="24">24</option>
              </Form.Select>
            </div>

            <Form.Control
              type="text"
              placeholder="Pretraži predmete...  "
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setStranica(1); 
              }}
              style={{ maxWidth: '220px' }}
              size="sm"
            />
              	<LordIcon
									style={{ width: "2rem", height: "2rem" }}
									src="/lordicon/search.json"
              trigger="hover"
             colors="primary:#ff5733,secondary:#ff5733"
								/>
          </div>
        
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -1000 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: "easeOut", delay: 0.3 }}
      >
        <Row xs={1} sm={1} md={2} lg={3} className="g-3">
          {predmetiNaStranici && predmetiNaStranici.length > 0 ? (
            predmetiNaStranici.map((c) => {
              const listaOznaka = c.oznake || c.tagovi || (c.oznaka ? [c.oznaka] : []);
              const listaSlika = c.slike || c.slikaUrls || [];
              const jeZavrseno = zavrseneAukcije[c.id] || false;

              return (
                <Col key={c.id}>
                  <Card 
                    className="h-100 shadow-sm border-0 overflow-hidden position-relative"
                    style={{
                      filter: jeZavrseno ? "blur(1.5px) grayscale(30%)" : "none",
                      opacity: jeZavrseno ? 0.75 : 1,
                      transition: "all 0.3s ease"
                    }}
                  >
                    {listaSlika.length > 1 ? (
                      <Carousel data-bs-theme="dark" interval={null} className="bg-light">
                        {listaSlika.map((slikaItem, idx) => (
                          <Carousel.Item key={idx}>
                            <img
                              className="d-block w-100"
                              src={dohvatiIzvorSlike(slikaItem)}
                              alt={`Slika ${idx + 1}`}
                              style={{ height: '180px', objectFit: 'cover' }}
                            />
                          </Carousel.Item>
                        ))}
                      </Carousel>
                    ) : listaSlika.length === 1 ? (
                      <div style={{ width: '100%', height: '180px', backgroundColor: '#f8f9fa' }}>
                        <Card.Img 
                          variant="top" 
                          src={dohvatiIzvorSlike(listaSlika[0])} 
                          alt={c.naziv} 
                          style={{ width: '100%', height: '180px', objectFit: 'cover' }} 
                        />
                      </div>
                    ) : (
                      <div className="text-muted d-flex align-items-center justify-content-center bg-light" style={{ height: '180px' }}>
                        <small>Nema slike</small>
                      </div>
                    )}

                    <Card.Body className="d-flex flex-column">
                      <div className="d-flex align-items-center gap-3 mb-3">
                        <div
                          className="p-1 rounded-circle d-flex align-items-center justify-content-center"
                          style={{ backgroundColor: "#e7f1ff" }}>
                          <IkonaKategorije nazivIkona={dohvatiIkonaKategorije(c.kategorija)} />
                        </div>
                        <div>
                          <Card.Title className="mb-0" style={{color:'#1a3580'}}>
                            {c.naziv}
                          </Card.Title>
                          {c.godinaNastanka && (
                            <small className="text-muted">
                              Godina nastanka: {c.godinaNastanka}.
                            </small>
                          )}
                        </div>
                      </div>

                      <Card.Text className="text-secondary flex-grow-1 mb-4" style={{fontSize:".9rem"}}>
                        <ExpandableText text={c.opis} maxLength={60} />
                      </Card.Text>

                      <div className="d-flex flex-column gap-1 mb-3">
                        <div className="d-flex justify-content-start">
                          <span className="text-muted" style={{fontSize:".9rem"}}>Početna cijena:</span>
                          <Badge bg="success" className="mx-2 mb-3">
                            {c.pocetnaCijena} €
                          </Badge>
                        </div>
                        <hr />
                        {Array.isArray(listaOznaka) && listaOznaka.length > 0 && (
                          <div className="d-flex align-items-center gap-1 flex-wrap">
                            <span className="text-muted fs-7 me-1">Oznake:</span>
                            {listaOznaka.map((oznakaItem, i) => (
                              <Badge key={i} bg="info" text="dark" className="px-2 py-1">
                                {prikaziNazivOznake(oznakaItem)}
                              </Badge>
                            ))}
                          </div>
                        )}

                        {c.stanje && (
                          <div className="d-flex justify-content-between align-items-center">
                            <span className="text-muted fs-7">Stanje:</span>
                            <Badge bg="secondary" className="px-2 py-1 mx-2">
                              {c.stanje}
                            </Badge>
                          </div>
                        )}

                        <div className="border-top pt-2 mt-1">
                          <small className="text-muted d-block">
                            <strong>Kreirano:</strong> {formatirajDatum(c.dodano)}
                          </small>
                          <small className="text-muted d-block">
                            <strong>Završava:</strong> {formatirajDatum(c.zavrsava)}
                          </small>
                          <small className="text-muted d-block">
                            <strong>U kategoriji:</strong> {prikaziNazivKategorije(c.kategorija)}
                          </small>
                          
                          <AukcijaOdbrojavanje 
                            zavrsavaDatum={c.zavrsava || c.dodano} 
                            onStatusChange={(zavrseno) => {
                              setZavrseneAukcije(prev => ({ ...prev, [c.id]: zavrseno }));
                            }}
                          />
                        </div>
                      </div>

                      <div className="d-flex gap-2 pt-2 border-top">
                        <Button variant="warning" className="w-50" size="sm" onClick={() => navigate(`/predmeti/promijeni/${c.id}`)}>Promijeni</Button>
                        <Button variant="danger" className="w-50" size="sm" onClick={() => obrisi(c.id)}>Obriši</Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })
          ) : (
            <Col xs={12}>
              <p className="text-muted text-center py-4">Nema predmeta u odabranoj kategoriji.</p>
            </Col>
          )}
        </Row>

        {ukupnoStranica > 1 && (
          <div className="d-flex justify-content-center mt-4">
            <div className="d-flex d-sm-none align-items-center gap-2">
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={() => setStranica(1)} 
                disabled={stranica === 1}
              >
                &laquo;&laquo;
              </Button>
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={() => setStranica(prev => Math.max(prev - 1, 1))} 
                disabled={stranica === 1}
              >
                &lsaquo; 
              </Button>
              
              <span className="text-muted small px-2" style={{ whiteSpace: 'nowrap' }}>
                <strong>{stranica}</strong> / {ukupnoStranica}
              </span>

              <Button 
                variant="secondary" 
                size="sm" 
                onClick={() => setStranica(prev => Math.min(prev + 1, ukupnoStranica))} 
                disabled={stranica === ukupnoStranica}
              >
                &rsaquo;
              </Button>
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={() => setStranica(ukupnoStranica)} 
                disabled={stranica === ukupnoStranica}
              >
                &raquo;&raquo;
              </Button>
            </div>

            <div className="d-none d-sm-block">
              <Pagination style={{ padding: "1rem" }}>
                <Pagination.First 
                  onClick={() => setStranica(1)} 
                  disabled={stranica === 1} 
                />
                <Pagination.Prev 
                  onClick={() => setStranica(prev => Math.max(prev - 1, 1))} 
                  disabled={stranica === 1} 
                />
                
                {items}

                <Pagination.Next 
                  onClick={() => setStranica(prev => Math.min(prev + 1, ukupnoStranica))} 
                  disabled={stranica === ukupnoStranica} 
                />
                <Pagination.Last 
                  onClick={() => setStranica(ukupnoStranica)} 
                  disabled={stranica === ukupnoStranica} 
                />
              </Pagination>
            </div>
          </div>
        )}
      </motion.div>
    </>
  );
}