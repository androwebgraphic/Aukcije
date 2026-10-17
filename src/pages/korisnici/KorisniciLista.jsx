import { useEffect, useState } from "react";
import KorisniciServices from "../../services/korisnici/KorisniciServices";
import { Container, Row, Col, Card, Button} from "react-bootstrap";
import DateFormat from "../../components/DateFormat";
import { Link, useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants";
import { FaArrowTurnUp } from "react-icons/fa6";
import { FaRegUser } from "react-icons/fa"; // Ikona za aute
import Heading from "../../components/UI/Heading";
import {motion} from "framer-motion"
import { korisnici } from "../../services/korisnici/KorisniciData"

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

export default function KorisniciList() {
  const [korisnici, setKorisnici] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    ucitajKorisnike();
  }, []);

  async function ucitajKorisnike() {
    try {
      const odgovor = await KorisniciServices.get();
      setKorisnici(odgovor.data);
    } catch (error) {
      console.error("Greška pri dohvaćanju korisnika:", error);
    }
  }

  async function obrisi(id) {
    if (!confirm("Želite obrisati korisnika?")) {
      return;
    }
    await KorisniciServices.obrisi(id);
    ucitajKorisnike();
  }

  return (

    <Container className="my-4">
          <motion.div
    
    
         initial={{ opacity: 0, x: -1000 }} // Početno stanje: nevidljiv i 100px u lijevo
            animate={{ opacity: 1, x: 0 }}     // Krajnje stanje: vidljiv i na svom mjestu
            transition={{ duration: 0.4, ease: "easeOut"  , delay:.2}} // Trajanje i glatkoća
    >
      <Heading as="h2" color="azure" >
        Lista korisnika ({korisnici.length})
      </Heading>

      <Link to={RouteNames.KORISNIK_NOVI} className="btn btn-success mb-4">
        Dodavanje korisnika
      </Link>
      </motion.div>
      <motion.div
      
                  initial={{ opacity: 0, x: -1000 }} // Početno stanje: nevidljiv i 100px u lijevo
            animate={{ opacity: 1, x: 0 }}     // Krajnje stanje: vidljiv i na svom mjestu
            transition={{ duration: 0.7, ease: "easeOut"  , delay:.3}} // Trajanje i glatkoća
      
      >
      {/* Grid sa Bootstrap Card elementima */}
        <Row xs={1} sm={1} md={2} lg={3} className="g-2">
        {korisnici&&
          korisnici.map((c, index) => (
            <Col key={c.id ?? index}>
              <Card className="h-100 shadow-sm border-0">
                <Card.Body className="d-flex flex-column">
                  
           
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <div
                      className="p-3 rounded-circle d-flex align-items-center justify-content-center"
                      style={{ backgroundColor: "#e7f1ff" }}
                    >
                      <FaRegUser size={ 32} color="#1a3580"/>
                    </div>
                    <div>
                      <Card.Title className="mb-0 fw-bold">{c.ime}</Card.Title>
                   
                    </div>
                  </div>

                <div className="border-top pt-2 mt-1">
                      <small className="text-muted d-block">
                        <strong>Kreirano:</strong> <DateFormat date={c.dodano} />
                      </small>
                     
                    </div>
             

                  {/* Akcijski gumbi */}
                  <div className="d-flex gap-2 mt-auto pt-2 border-top">
                    <Button
                      variant="warning"
                      className="w-50"
                      onClick={() => navigate(`/korisnici/${c.id}`)}
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