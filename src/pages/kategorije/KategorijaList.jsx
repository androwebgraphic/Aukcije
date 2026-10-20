import { useEffect, useState } from "react"
import KategorijeServices from "../../services/kategorije/KategorijeServices"
import { Button, Container, Row, Col, Card, Badge } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"
import { RouteNames } from "../../constants"



import Heading from "../../components/UI/Heading"
import {motion} from "framer-motion"
import IkonaKategorije from "../../components/UI/IkonaKategorije"

// 1. Objekt s ikonicama


// Pomoćna komponenta za skraćivanje teksta
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
  const navigate = useNavigate()

  useEffect(() => { 
    ucitajKategorije()
  }, [])
  
  async function ucitajKategorije() {
    await KategorijeServices.get()
      .then((res) => {
        setKategorije(res.data)
      })
      .catch((err) => {
        console.error("Greška pri učitavanju kategorija:", err)
      })
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

    <Container className="my-4" >
    
        <motion.div 
      initial={{ opacity: 0, x: -1000 }} // Početno stanje: nevidljiv i 100px u lijevo
            animate={{ opacity: 1, x: 0 }}     // Krajnje stanje: vidljiv i na svom mjestu
            transition={{ duration: 0.4, ease: "easeOut"  ,delay:.2}} // Trajanje i glatkoća
    >
      <Heading as='h2' >   Lista Kategorija <small>({kategorije.length})</small> </Heading>

 <Link to={RouteNames.KATEGORIJA_NOVA} >
            <Button variant="success" size="sm" className="mb-3">Dodaj kategoriju</Button>
      </Link>
   </motion.div>
      {/* Grid sa Bootstrap Card elementima */}
      <Row xs={1} sm={1} md={2} lg={3} className="g-2">
        {kategorije && kategorije.map((c) => {
          return (

            <motion.div
            
            initial={{ opacity: 0, x: -1000 }} // Početno stanje: nevidljiv i 100px u lijevo
            animate={{ opacity: 1, x: 0 }}     // Krajnje stanje: vidljiv i na svom mjestu
            transition={{ duration: 0.7, ease: "easeOut"  , delay:.4}} // Trajanje i glatkoća
            
            >
              <Col key={c.id} className="h-100">
             
                
  
              <Card className="h-100 shadow-sm border-0" >

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
                      <Card.Title style={{color:"#1a3580"}}>{c.naziv} </Card.Title>
                    
                    </div>
                  </div>

                  {/* Opis kategorije */}
                  <Card.Text className="text-secondary flex-grow-1">
                      <ExpandableText text={c.opis} maxLength={60}  />
                  </Card.Text>

                  {/* Broj oglasa badge */}
                  <div className="mb-3">
                    <Badge bg="secondary" className="text-light px-2 py-2">
                      Broj oglasa: dovući kasnije
                    </Badge>
                  </div>

                  {/* Akcijski gumbi */}
                  <div className="d-flex gap-2 mt-auto pt-2 border-top">
                    <Button 
                      variant="warning" 
                        className="w-50"
                        size="sm"
                      onClick={() => navigate(`/kategorije/${c.id}`)}
                    >
                      Promijeni
                      </Button>
                      

                    <Button 
                      variant="danger" 
                        className="w-50"
                        size="sm"
                      onClick={() => obrisi(c.id)}
                    >
                      Obriši
                    </Button>
                  </div>

                    </Card.Body>
                  
                </Card>
         
              </Col>
              </motion.div>
          );
        })}
        </Row>

      </Container>
     
      </>
  )
}