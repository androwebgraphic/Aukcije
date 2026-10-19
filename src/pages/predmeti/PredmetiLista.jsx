import { useEffect, useState } from "react";
import PredmetiServices from "../../services/predmeti/PredmetiServices";
import { Container, Row, Col, Card, Button, Badge, Form } from "react-bootstrap";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { RouteNames } from "../../constants";
import { FaArrowTurnUp } from "react-icons/fa6";
import { TbCarSuv } from "react-icons/tb";
import Heading from "../../components/UI/Heading";
import { motion } from "framer-motion";
import KategorijeServices from "../../services/kategorije/KategorijeServices";

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
  const [searchTerm, setSearchTerm] = useState(""); // Stanje za tekst pretrage
  const navigate = useNavigate();
   const params = useParams()
  
  const [searchParams] = useSearchParams();
  const kategorijaFilter = searchParams.get("kategorija");

  useEffect(() => {
    ucitajKategorije();
    ucitajPredmete();
  }, []);

  async function ucitajPredmete() {
    try {
      const odgovor = await PredmetiServices.get();
      if(params.id){
        const filtrirano = odgovor.data.filter(p=>p.kategorija===parseInt(params.id))
        console.table(filtrirano)
        setPredmeti(filtrirano)
      }else{
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

  async function obrisi(id) {
    if (!confirm("Želite obrisati?")) {
      return;
    }
    await PredmetiServices.obrisi(id);
    ucitajPredmete();
  }

  function prikaziNazivKategorije(id) {
    const kategorija = kategorije.find((s) => s.id === id);
    return kategorija ? kategorija.naziv : "Nepoznato";
  }

  // Filtriranje predmeta prema kategoriji (iz URL-a) i upisanom tekstu (pretraga)
  const filtriraniPredmeti = predmeti.filter((c) => {
    const nazivKat = prikaziNazivKategorije(c.kategorija);
    const zadovoljavaKategoriju = !kategorijaFilter || nazivKat.toLowerCase() === kategorijaFilter.toLowerCase();
    
    // Provjera sadrži li naziv predmeta upisani tekst (ignoriramo mala/velika slova)
    const zadovoljavaPretragu = c.naziv.toLowerCase().includes(searchTerm.toLowerCase());

    return zadovoljavaKategoriju && zadovoljavaPretragu;
  });

  return (
    <Container className="my-4">
 
      <motion.div
        initial={{ opacity: 0, x: -1000 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, ease: "easeOut", delay: 0.2 }}
      >
        <Heading as="h2" color="azure" className=" mb-2 mt-0">
          Lista predmeta {kategorijaFilter ? `- ${kategorijaFilter.toUpperCase()}` : ""} ({filtriraniPredmeti.length})
        </Heading>

        <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
          <Link to={RouteNames.PREDMET_NOVI} className="mb-0">
            <Button variant="success" size="sm">Dodaj predmet</Button>
          </Link>

          {/* Input polje za automatsku pretragu */}
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
            filtriraniPredmeti.map((c, index) => (
              <Col key={c.id ?? index} >
                <Card className="h-100 shadow-sm border-0">
                  <Card.Body className="d-flex flex-column">
                    <div className="d-flex align-items-center gap-3 mb-3">
                      <div
                        className="p-1 rounded-circle d-flex align-items-center justify-content-center"
                        style={{ backgroundColor: "#e7f1ff" }}>
                        <TbCarSuv size={25} color="#1a3580" />
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
                        onClick={() => navigate(`/predmeti/${c.id}`)}>
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
            ))}
        </Row>
      </motion.div>
    </Container>
  );
}