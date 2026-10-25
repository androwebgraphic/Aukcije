import { useEffect, useState } from "react"
import KategorijeServices from "../../services/kategorije/KategorijeServices"
import PredmetiServices from "../../services/predmeti/PredmetiServices"
import { Button, Container, Row, Col, Card, Badge } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"
import { RouteNames } from "../../constants"
import { FaArrowTurnUp } from "react-icons/fa6"

import Heading from "../../components/UI/Heading"
import { motion } from "framer-motion"
import IkonaKategorije from "../../components/UI/IkonaKategorije"

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
        style={{ color: 'green', cursor: 'pointer', marginLeft: '.2rem', fontWeight: 'bold' }}
      >
        {isExpanded ? <FaArrowTurnUp /> : '...'} 
      </span>
    </span>
  );
}

export default function KategorijaList() {
  const [kategorije, setKategorije] = useState([])
  const [predmeti, setPredmeti] = useState([])
  const navigate = useNavigate()

  useEffect(() => { 
    ucitajKategorije()
    ucitajPredmete()
  }, [])
  
  async function ucitajKategorije() {
    try {
      const res = await KategorijeServices.get()
      console.log("Učitane kategorije (res.data):", res.data)
      // Ako API vraća objekt s podacima unutra (npr. .content), prilagodi ovdje
      const dohvaceneKategorije = Array.isArray(res.data) ? res.data : (res.data.content || res.data.kategorije || []);
      setKategorije(dohvaceneKategorije)
    } catch (err) {
      console.error("Greška pri učitavanju kategorija:", err)
    }
  }

  async function ucitajPredmete() {
    try {
      const res = await PredmetiServices.get()
      const dohvaceniPredmeti = Array.isArray(res.data) ? res.data : (res.data.content || res.data.predmeti || []);
      setPredmeti(dohvaceniPredmeti)
      console.log("Učitani predmeti:", dohvaceniPredmeti)
    } catch (error) {
      console.error("Greška pri učitavanju predmeta:", error)
    }
  }

  async function obrisi(id) {
    if (!confirm('Želite obrisati?')) {
      return
    }
    await KategorijeServices.obrisi(id)
    ucitajKategorije()
  }

  return (
    <>
      <Container className="my-4">
        <motion.div 
          initial={{ opacity: 0, x: -100 }} 
          animate={{ opacity: 1, x: 0 }}     
          transition={{ duration: 0.4, ease: "easeOut", delay: 0.2 }}
        >
          <Heading as='h2'> Lista Kategorija <small>({kategorije.length})</small> </Heading>

          <Link to={RouteNames.KATEGORIJA_NOVA}>
            <Button variant="success" size="sm" className="mb-3">Dodaj kategoriju</Button>
          </Link>
        </motion.div>

        {/* Ako nema kategorija, prikazujemo poruku da korisnik zna da je lista prazna */}
        {kategorije.length === 0 && (
          <p className="text-muted">Trenutno nema učitanih kategorija ili se podaci još učitavaju...</p>
        )}

        {/* Grid sa Bootstrap Card elementima */}
        <Row xs={1} sm={1} md={2} lg={3} className="g-2">
          {kategorije && kategorije.map((c, index) => {
            const brojPredmeta = Array.isArray(predmeti) ? predmeti.filter(p => {
              const katId = 
                (typeof p.kategorija === 'object' && p.kategorija !== null ? p.kategorija.id : p.kategorija) ?? 
                p.kategorijeId ?? 
                p.kategorijaId ?? 
                p.kategorija_id;

              return String(katId ?? "").trim() === String(c.id ?? "").trim();
            }).length : 0;

            const jedinstveniKey = c.id ? `${c.id}-${index}` : index;

            return (
              <Col key={jedinstveniKey} className="h-100" xs={12} sm={6}>
                <motion.div
                  initial={{ opacity: 0, x: -100 }} 
                  animate={{ opacity: 1, x: 0 }}     
                  transition={{ duration: 0.7, ease: "easeOut", delay: 0.4 }}
                  className="h-100"
                >
                  <Card className="h-100 shadow-sm border-0">
                    <Card.Body className="d-flex flex-column">
                      
                      {/* Zaglavlje kartice: Ikona i Naziv */}
                      <div className="d-flex align-items-center gap-3 mb-3">
                        <div 
                          className="p-1 rounded-circle d-flex align-items-center justify-content-center" 
                          style={{ backgroundColor: '#e7f1ff' }}
                        >
                          <IkonaKategorije nazivIkona={c.ikona} />
                        </div>
                        <div>
                          <Card.Title style={{ color: "#1a3580" }}>{c.naziv}</Card.Title>
                        </div>
                      </div>

                      {/* Opis kategorije */}
                      <Card.Text className="text-secondary flex-grow-1">
                          <ExpandableText text={c.opis} maxLength={60} />
                      </Card.Text>

                      {/* Broj predmeta badge */}
                      <div className="mb-3">
                        <Badge bg="secondary" className="text-light px-2 py-2">
                          Broj predmeta: {brojPredmeta}
                        </Badge>
                      </div>

                      {/* Akcijski gumbi */}
                   
                                            <div className="d-flex gap-2 mt-predmet pt-2 border-top">

                      <Button
                            variant="warning"
                            className="w-100"
                            size="sm"
                            onClick={() => navigate(`/kategorije/${c.id}`)}
                          >
                            Promijeni
                          </Button>
                  
                        
               
                        <Button 
                          variant="danger" 
                          className="w-100"
                          size="sm"
                          onClick={() => obrisi(c.id)}
                        >
                          Obriši
                        </Button>
                        </div>
         

                    </Card.Body>
                  </Card>
                </motion.div>
              </Col>
            );
          })}
        </Row>
      </Container>
    </>
  )
}