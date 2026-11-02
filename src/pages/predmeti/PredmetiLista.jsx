import { useEffect, useState } from "react";
import PredmetiServices from "../../services/predmeti/PredmetiServices";
import KategorijeServices from "../../services/kategorije/KategorijeServices";
import OznakeServices from "../../services/oznake/OznakeServices";
import { Row, Col, Card, Button, Badge, Form, Carousel, Pagination } from "react-bootstrap";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { RouteNames } from "../../constants";
import { FaArrowTurnUp } from "react-icons/fa6";
import Heading from "../../components/UI/Heading";
import { motion } from "framer-motion";
import IkonaKategorije from "../../components/UI/IkonaKategorije";

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
  
  // State za paginaciju i veličinu stranice
  const [stranica, setStranica] = useState(1);
  const [velicinaStranice, setVelicinaStranice] = useState(6);

  const navigate = useNavigate();
  const params = useParams();
  const [searchParams] = useSearchParams();
  const kategorijaFilter = searchParams.get("kategorija");

  // Resetiramo stranicu na 1 kad god se promijeni kategorija
  useEffect(() => {
    setStranica(1);
  }, [params.id, kategorijaFilter]);

  // Pouzdano vraćanje na vrh stranice nakon što se DOM i animacije renderiraju
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

  // Filtriranje predmeta
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

  // Generiranje itema za desktop paginaciju
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

        <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
          <Link to={RouteNames.PREDMET_NOVI} className="mb-0">
            <Button variant="success" size="sm">Dodaj predmet</Button>
          </Link>

          <div className="d-flex align-items-center gap-2">
            <span className="text-secondary fs-7" style={{ whiteSpace: 'nowrap' }}>Prikaz:</span>
            <Form.Select
              size="sm"
              value={velicinaStranice}
              onChange={(e) => {
                setVelicinaStranice(parseInt(e.target.value));
                setStranica(1); 
              }}
              style={{ width: '80px' }}
            >
              <option value="3">3</option>
              <option value="6">6</option>
              <option value="9">9</option>
              <option value="12">12</option>
            </Form.Select>

            <Form.Control
              type="text"
              placeholder="Pretraži predmete..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setStranica(1); 
              }}
              style={{ maxWidth: '250px' }}
              size="sm"
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

              return (
                <Col key={c.id}>
                  <Card className="h-100 shadow-sm border-0 overflow-hidden">
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

                      <Card.Text className="text-secondary flex-grow-1 mb-4 " style={{fontSize:".9rem"}}>
                        <ExpandableText text={c.opis} maxLength={60} />
                      </Card.Text>

                      <div className="d-flex flex-column gap-1 mb-3">
                        <div className="d-flex justify-content-start">
                          <span className="text-muted" style={{fontSize:".9rem"}}>Početna cijena:</span>
                          <Badge bg="success" className=" mx-2 mb-3">
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

        {/* Responzivna paginacija na dnu */}
        {ukupnoStranica > 1 && (
          <div className="d-flex justify-content-center mt-4">
            
            {/* 1. Mobilna verzija paginacije (vidljiva samo na mobitelima) */}
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
                &lsaquo; Prethodna
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
                Sljedeća &rsaquo;
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

            {/* 2. Desktop verzija paginacije (skrivena na mobitelu, vidljiva od 'sm' nadalje) */}
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