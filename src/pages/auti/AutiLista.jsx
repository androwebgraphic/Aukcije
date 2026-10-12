import { useEffect, useState } from "react";
import AutiServices from "../../services/auti/AutiServicesMemorija";
import { Container, Row, Col, Card, Button, Badge } from "react-bootstrap";
import DateFormat from "../../components/DateFormat";
import { Link, useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants";
import { FaArrowTurnUp } from "react-icons/fa6";
import { TbCarSuv } from "react-icons/tb"; // Ikona za aute
import Heading from "../../components/UI/Heading";
import {motion} from "framer-motion"

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
        }}
      >
        {isExpanded ? <FaArrowTurnUp /> : "..."}
      </span>
    </span>
  );
}

export default function AutiList() {
  const [auti, setAuti] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    ucitajAute();
  }, []);

  async function ucitajAute() {
    try {
      const odgovor = await AutiServices.get();
      setAuti(odgovor.data);
    } catch (error) {
      console.error("Greška pri dohvaćanju automobila:", error);
    }
  }

  async function obrisi(id) {
    if (!confirm("Želite obrisati?")) {
      return;
    }
    await AutiServices.obrisi(id);
    ucitajAute();
  }

  return (

    <Container className="my-4">
          <motion.div
    
    
         initial={{ opacity: 0, x: -1000 }} // Početno stanje: nevidljiv i 100px u lijevo
            animate={{ opacity: 1, x: 0 }}     // Krajnje stanje: vidljiv i na svom mjestu
            transition={{ duration: 0.4, ease: "easeOut"  , delay:.4}} // Trajanje i glatkoća
    >
      <Heading as="h2" color="azure" className="display-2 mb-4">
        Lista auta ({auti.length})
      </Heading>

      <Link to={RouteNames.AUTI_NOVI} className="btn btn-success mb-4">
        Dodavanje novog auta
      </Link>
      </motion.div>
      <motion.div
      
                  initial={{ opacity: 0, x: -1000 }} // Početno stanje: nevidljiv i 100px u lijevo
            animate={{ opacity: 1, x: 0 }}     // Krajnje stanje: vidljiv i na svom mjestu
            transition={{ duration: 0.7, ease: "easeOut"  , delay:.6}} // Trajanje i glatkoća
      
      >
      {/* Grid sa Bootstrap Card elementima */}
        <Row xs={1} sm={1} md={2} lg={3} className="g-2">
        {auti &&
          auti.map((c, index) => (
            <Col key={c.id ?? index}>
              <Card className="h-100 shadow-sm border-0">
                <Card.Body className="d-flex flex-column">
                  
                  {/* Zaglavlje kartice: Ikona i Naziv auta */}
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <div
                      className="p-3 rounded-circle d-flex align-items-center justify-content-center"
                      style={{ backgroundColor: "#e7f1ff" }}
                    >
                      <TbCarSuv size={32} color="#1a3580" />
                    </div>
                    <div>
                      <Card.Title className="mb-0 fw-bold">{c.naziv}</Card.Title>
                      {c.godinaProizvodnje && (
                        <small className="text-muted">
                          Godina: {c.godinaProizvodnje}.
                        </small>
                      )}
                    </div>
                  </div>

                  {/* Opis auta */}
                  <Card.Text className="text-secondary flex-grow-1">
                    <ExpandableText text={c.opis} maxLength={60} />
                  </Card.Text>

                  {/* Detalji: Cijena, Stanje i Datum aukcije */}
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
                        <strong>Kreirano:</strong> <DateFormat date={c.dodano} />
                      </small>
                      <small className="text-muted d-block">
                        <strong>Završava:</strong> <DateFormat date={c.zavrsava} />
                      </small>
                    </div>
                  </div>

                  {/* Akcijski gumbi */}
                  <div className="d-flex gap-2 mt-auto pt-2 border-top">
                    <Button
                      variant="warning"
                      className="w-50"
                      onClick={() => navigate(`./${c.id}`)}
                    >
                      Promijeni
                    </Button>
                    <Button
                      variant="danger"
                      className="w-50"
                      onClick={() => obrisi(c.id)}
                    >
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