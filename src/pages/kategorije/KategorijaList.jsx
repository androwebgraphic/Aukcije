import { useEffect, useState } from "react"
import KategorijeServices from "../../services/kategorije/KategorijeServices"
import { Button, Container, Row, Col, Card, Badge } from "react-bootstrap"
import DateFormat from "../../components/DateFormat"
import { Link, useNavigate } from "react-router-dom"
import { RouteNames } from "../../constants"

// Uvoz ikona za kategorije
import { FaComputer } from "react-icons/fa6";
import { TbCarSuv } from "react-icons/tb";
import { GiDiamondRing } from "react-icons/gi"; // Ikona za nakit
import { GiPostStamp } from "react-icons/gi";
import { VscTools } from "react-icons/vsc";
import { RiBookShelfLine } from "react-icons/ri";
import { PiHandCoinsBold } from "react-icons/pi";
import { FaArrowTurnUp } from "react-icons/fa6";


import Heading from "../../components/UI/Heading"
import {motion} from "framer-motion"

// 1. Objekt s ikonicama
const ICONS = {
  car: TbCarSuv,
  computer: FaComputer,
  jewelry: GiDiamondRing,
  stamp: GiPostStamp,
  tools: VscTools,
  books: RiBookShelfLine,
  coins: PiHandCoinsBold,
};

// 2. Određivanje ikone na temelju naziva
const getCategoryIcon = (naziv) => {
  if (!naziv) return ICONS.tools;

  const name = naziv.toLowerCase().trim();

  if (name.includes('aut') || name.includes('vozil')) return ICONS.car;
  if (name.includes('računal') || name.includes('racunala') || name.includes('komp') || name.includes('elektronik')) return ICONS.computer;
  if (name.includes('nakit') || name.includes('prsten') || name.includes('zlato') || name.includes('srebro') || name.includes('bižuterija')) return ICONS.jewelry;
  if (name.includes('markic') || name.includes('kolekc') || name.includes('starin')) return ICONS.stamp;
  if (name.includes('knjig') || name.includes('literatur') || name.includes('strip')) return ICONS.books;
  if (name.includes('financij') || name.includes('novac') || name.includes('posa')) return ICONS.coins;
  if (name.includes('alat') || name.includes('uslug') || name.includes('stroj')) return ICONS.tools;

  return ICONS.tools;
};

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
      <Heading as='h1' className="display-1 mb-4">   Lista Kategorija <small>({kategorije.length})</small> </Heading>

 <Link to={RouteNames.KATEGORIJA_NOVA} className="btn btn-success mb-4">
        dodavanje nove kategorije 
      </Link>
   </motion.div>
      {/* Grid sa Bootstrap Card elementima */}
      <Row xs={1} sm={1} md={2} lg={3} className="g-2">
        {kategorije && kategorije.map((c) => {
          const IconComponent = getCategoryIcon(c.naziv);

          return (

            <motion.div
            
            initial={{ opacity: 0, x: -1000 }} // Početno stanje: nevidljiv i 100px u lijevo
            animate={{ opacity: 1, x: 0 }}     // Krajnje stanje: vidljiv i na svom mjestu
            transition={{ duration: 0.7, ease: "easeOut"  , delay:.4}} // Trajanje i glatkoća
            
            >
              <Col key={c.id}>
             
                
  
              <Card className="h-100 shadow-sm border-0" >

                <Card.Body className="d-flex flex-column">
                  
                  {/* Zaglavlje kartice: Ikona i Naziv */}
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <div 
                      className="p-3 rounded-circle d-flex align-items-center justify-content-center" 
                      style={{ backgroundColor: '#e7f1ff' }}
                    >
                      <IconComponent size={25} color="#1a3580" />
                    </div>
                    <div>
                      <Card.Title color="#1a3580">{c.naziv} </Card.Title>
                      <small className="text-muted">
                        Kreirano: <DateFormat date={c.datumMoj} />
                      </small>
                    </div>
                  </div>

                  {/* Opis kategorije */}
                  <Card.Text className="text-secondary flex-grow-1">
                    <ExpandableText text={c.opis} maxLength={60} />
                  </Card.Text>

                  {/* Broj oglasa badge */}
                  <div className="mb-3">
                    <Badge bg="secondary" className="text-light px-2 py-2">
                      Broj oglasa: {c.brojOglasa || 0}
                    </Badge>
                  </div>

                  {/* Akcijski gumbi */}
                  <div className="d-flex gap-2 mt-auto pt-2 border-top">
                    <Button 
                      variant="warning" 
                      className="w-50"
                      onClick={() => navigate(`/kategorije/${c.id}`)}
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
              </motion.div>
          );
        })}
        </Row>

      </Container>
     
      </>
  )
}