import { useEffect, useState } from "react";
import PredmetiServices from "../../services/predmeti/PredmetiServices";
import KategorijeServices from "../../services/kategorije/KategorijeServices";
import OznakeServices from "../../services/oznake/OznakeServices";
import { Row, Col, Card, Button, Badge, Form } from "react-bootstrap";
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

export default function PredmetiList() {
  const [predmeti, setPredmeti] = useState([]);
  const [kategorije, setKategorije] = useState([]);
  const [oznake, setOznake] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); 
  const navigate = useNavigate();
  const params = useParams();
  
  const [searchParams] = useSearchParams();
  const kategorijaFilter = searchParams.get("kategorija");

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
  }, [params.id]);

  async function ucitajPredmete() {
    try {
      const odgovor = await PredmetiServices.get();
      console.log("Dohvaćeni predmeti:", odgovor.data); // Pomoć za provjeru u konzoli
      
      if(params.id){
        const katId = parseInt(params.id);
        const filtrirano = odgovor.data.filter(p => {
          if (typeof p.kategorija === 'object' && p.kategorija !== null) {
            return p.kategorija.id === katId;
          }
          return p.kategorija === katId;
        });
        console.log(filtrirano)
        setPredmeti(filtrirano);
      } else {
        setPredmeti(odgovor.data);
      }
    } catch (error) {
      console.error("Greška pri dohvaćanju predmeta:", error);
    }
  }

  async function ucitajKategorije() {
    try {
      const odgovor = await KategorijeServices.get();
      setKategorije(odgovor.data);
    } catch (error) {
      console.error("Greška pri dohvaćanju kategorija:", error);
    }
  }

  async function ucitajOznake() {
    try {
      const odgovor = await OznakeServices.get();
      console.log("Dohvaćene oznake iz servisa:", odgovor.data || odgovor);
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
    if (!kategorijaVal) return null;
    if (typeof kategorijaVal === 'object' && kategorijaVal.id) {
      return kategorijaVal.id;
    }
    return parseInt(kategorijaVal);
  }

  // ULTRA ROBUSTNA FUNKCIJA ZA PRIKAZ NAZIVA OZNAKE
  function prikaziNazivOznake(oznakaItem) {
    if (!oznakaItem) return "Nepoznato";
    
    // Ako je oznaka već objekt s nazivom
    if (typeof oznakaItem === 'object') {
      return oznakaItem.naziv || oznakaItem.name || JSON.stringify(oznakaItem);
    }
    
    // Tražimo u globalnoj listi oznaka
    const o = oznake.find((item) => 
      String(item.id) === String(oznakaItem) || 
      String(item.sifra) === String(oznakaItem)
    );
    
    if (o) return o.naziv;
    
    // Ako ne nađemo u listi, vrati barem ID/vrijednost da vidimo ispis na ekranu
    return `Oznaka ID: ${oznakaItem}`;
  }

  const aktivnaKategorijaNaziv = params.id 
    ? prikaziNazivKategorije(parseInt(params.id)) 
    : kategorijaFilter;

  const filtriraniPredmeti = predmeti.filter((c) => {
    const nazivKat = prikaziNazivKategorije(c.kategorija);
    const zadovoljavaKategoriju = !kategorijaFilter || nazivKat.toLowerCase() === kategorijaFilter.toLowerCase();
    const zadovoljavaPretragu = c.naziv && c.naziv.toLowerCase().includes(searchTerm.toLowerCase());

    return zadovoljavaKategoriju && zadovoljavaPretragu;
  });

  function dohvatiIkonaKategorije(kategorijaVal){
    const katId = dohvatiIdKategorije(kategorijaVal);
    const kat = kategorije.find(k => k.id === katId);
    return kat ? kat.ikona : "";
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: -1000 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, ease: "easeOut", delay: 0.2 }}
      >
        <Heading as="h2" color="azure" className=" mb-2 mt-0">
          Lista predmeta  {aktivnaKategorijaNaziv ? `- ${aktivnaKategorijaNaziv.toUpperCase()}` : ""} ({filtriraniPredmeti.length})
        </Heading>

        <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
          <Link to={RouteNames.PREDMET_NOVI} className="mb-0">
            <Button variant="success" size="sm">Dodaj predmet</Button>
          </Link>

          <Form.Control
            type="text"
            placeholder="Pretraži predmete..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ maxWidth: '300px' }}
            size="sm"
          />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -1000 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: "easeOut", delay: 0.3 }}
      >
        <Row xs={1} sm={1} md={2} lg={3} className="g-2">
          {filtriraniPredmeti &&
            filtriraniPredmeti.map((c, index) => {
              // console.log(`Index: ${index}`)
              // Dohvaćamo niz oznaka bez obzira zove li se property oznake, tagovi ili oznaka
              const listaOznaka = c.oznake || c.tagovi || (c.oznaka ? [c.oznaka] : []);

              return (
                <Col key={c.id} >
                  <Card className="h-100 shadow-sm border-0">
                    <Card.Body className="d-flex flex-column">
                      <div className="d-flex align-items-center gap-3 mb-3">
                        <div
                          className="p-1 rounded-circle d-flex align-items-center justify-content-center"
                          style={{ backgroundColor: "#e7f1ff" }}>
                          <IkonaKategorije nazivIkona={dohvatiIkonaKategorije(c.kategorija)} />
                        </div>
                        <div>
                          <Card.Title className="mb-0 " style={{color:'#1a3580'}}>
                            {c.naziv}
                          </Card.Title>
                          {c.godinaNastanka && (
                            <small className="text-muted">
                              Godina nastanka: {c.godinaNastanka}.
                            </small>
                          )}
                        </div>
                      </div>

                      <Card.Text className="text-secondary flex-grow-1">
                        <ExpandableText text={c.opis} maxLength={60} />
                      </Card.Text>

                      <div className="d-flex flex-column gap-2 mb-3">
                        <div className="d-flex justify-content-between align-items-center">
                          <span className="text-muted fs-7">Početna cijena:</span>
                          <Badge bg="success" className="fs-6 px-2 py-1">
                            {c.pocetnaCijena} €
                          </Badge>
                        </div>

                        {/* SIGURAN PRIKAZ OZNAKA (Podržava više mogućih naziva polja u objektu) */}
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
                            <Badge bg="secondary" className="px-2 py-1">
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

                      <div className="d-flex gap-2 mt-predmet pt-2 border-top">
                        <Button
                          variant="warning"
                          className="w-50"
                          size="sm"
                          onClick={() => navigate(`/predmeti/${c.id }`)}>
                          Promijeni
                        </Button>

                   
                        <Button
                          variant="danger"
                          className="w-50"
                          size="sm"
                          onClick={() => obrisi(c.id)}>
                          Obriši
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
        </Row>
      </motion.div>
    </>
  );
}