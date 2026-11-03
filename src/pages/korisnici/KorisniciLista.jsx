import { useEffect, useState } from "react";
import KorisniciServices from "../../services/korisnici/KorisniciServices";
import { Row, Col, Card, Button } from "react-bootstrap";
import DateFormat from "../../components/DateFormat";
import { Link, useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants";
import { FaRegUser } from "react-icons/fa";
import Heading from "../../components/UI/Heading";
import { motion } from "framer-motion";
import { korisnici } from "../../services/korisnici/KorisniciData";

// ⚠️ Ovdje ispravite putanju ili naziv ako se PDF generator drugačije zove
import KorisniciPdfGenerator from '../../components/KorisniciPdfGenerator'; 
import { FaRegFilePdf } from "react-icons/fa6";


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

  async function generirajPDF(korisnickiId) {
    try {
        const odgovorKorisnici = await KorisniciServices.get();

        // Filtriramo po ID-ju (ako želimo generirati za jednog korisnika ili više njih)
        const korisniciZaPdf = odgovorKorisnici.data.filter(p => 
            korisnickiId === p.id || (Array.isArray(korisnickiId) && korisnickiId.includes(p.id))
        );

        // Pozivamo pravu funkciju/komponentu za PDF
        const generiraj = KorisniciPdfGenerator({
            korisnici: korisniciZaPdf
        });

            await generiraj();

        
    } catch (error) {
        console.log("Greška pri generiranju PDF-a:", error);
    }
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: -1000 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, ease: "easeOut", delay: .2 }}
      >
        <Heading as="h2" color="azure">
          Lista korisnika ({korisnici.length})
        </Heading>

        <Link to={RouteNames.KORISNIK_NOVI} className="btn btn-success mb-4">
          Dodavanje korisnika
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -1000 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: "easeOut", delay: .3 }}
      >
        <Row xs={1} sm={1} md={2} lg={3} className="g-2">
          {korisnici &&
            korisnici.map((c, index) => (
              <Col key={c.id ?? index} sm={6} md={6}>
                <Card className="h-100 shadow-sm border-0">
                  <Card.Body className="d-flex flex-column">
                    <div className="d-flex align-items-center gap-3 mb-3">
                      <div
                        className="p-3 rounded-circle d-flex align-items-center justify-content-center"
                        style={{ backgroundColor: "#e7f1ff" }}
                      >
                        <FaRegUser size={32} color="#1a3580" />
                      </div>
                      <div>
                        <Card.Title className="mb-0 fw-bold">
                          <strong><small className="text-muted d-block">Ime:</small></strong>{c.ime}
                        </Card.Title>
                      </div>
                    
                      {/* ⚠️ Ovdje proslijeđujemo c.id umjesto cijelog niza korisnika */}
                      <FaRegFilePdf
                        color="1a3580"
                        style={{ cursor: 'pointer' }}
                        size={40}
                        onClick={() => generirajPDF(c.id)} 
                        title="Generiraj PDF"
                      />
                    </div>

                    <div className="border-top pt-2 mt-1">
                      <small className="text-muted d-block">
                        <strong>email:</strong> {c.email}
                      </small>
                    </div>

                    <div className="border-top pt-2 mt-1">
                      <small className="text-muted d-block">
                        <strong>Dodano:</strong> <DateFormat date={c.dodano} />
                      </small>
                    </div>

                    <Row className="mt-auto pt-3">
                      <Col xs={6} md={6}>
                        <Button
                          variant="warning"
                          className="w-100"
                          size="sm"
                          onClick={() => navigate(`/korisnici/${c.id}`)}
                        >
                          Promijeni
                        </Button>
                      </Col>
                      <Col xs={6} md={6}>
                        <Button
                          variant="danger"
                          className="w-100"
                          size="sm"
                          onClick={() => obrisi(c.id)}
                        >
                          Obriši
                        </Button>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            ))}
        </Row>
      </motion.div>
    </>
  );
}