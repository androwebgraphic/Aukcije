import { useEffect, useState } from "react"
import KategorijeServices from "../services/kategorije/KategorijeServices"
import { Button, Container, Table } from "react-bootstrap"
import DateFormat from "../components/DateFormat"
import { Link, useNavigate } from "react-router-dom"
import { RouteNames } from "../constants"

// Uvoz ikona koje si naveo
import { FaComputer } from "react-icons/fa6";
import { TbCarSuv } from "react-icons/tb";
import { MdWatch } from "react-icons/md";
import { GiPostStamp } from "react-icons/gi";
import { VscTools } from "react-icons/vsc";
import { RiBookShelfLine } from "react-icons/ri";
import { PiHandCoinsBold } from "react-icons/pi";
import { FaArrowTurnUp } from "react-icons/fa6";

import '../ResponsiveTable.css';
import Heading from "../components/UI/Heading"

// 1. Objekt koji grupira isključivo navedene ikone
const ICONS = {
  car: TbCarSuv,
  computer: FaComputer,
  watch: MdWatch,
  stamp: GiPostStamp,
  tools: VscTools,
  books: RiBookShelfLine,
  coins: PiHandCoinsBold,
};

// 2. Logika za prepoznavanje odgovarajuće ikone na temelju naziva kategorije
const getCategoryIcon = (naziv) => {
  if (!naziv) return ICONS.tools;

  const name = naziv.toLowerCase().trim();

  if (name.includes('aut') || name.includes('vozil')) return ICONS.car;
  if (name.includes('računal') || name.includes('racunala') || name.includes('komp') || name.includes('elektronik')) return ICONS.computer;
  if (name.includes('sat') || name.includes('nakit')) return ICONS.watch;
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
    <Container>
      <Heading as='h1' className="display-1">Lista Kategorija</Heading>
      
      <Link to={RouteNames.KATEGORIJA_NOVA} className="btn btn-success mb-3">
        dodavanje nove kategorije 
      </Link>

      <Table hover striped bordered className="table-stacked">
        <thead>
          <tr>
            <th className="text-center">Ikona</th>
            <th>Naziv</th>
            <th>Opis</th>
            <th className="text-center">broj oglasa</th>
            <th>Kreirano</th>
            <th>Akcija</th>
          </tr>
        </thead>

        <tbody>
          {kategorije && kategorije.map((c) => {
            const IconComponent = getCategoryIcon(c.naziv);

            return (
              <tr key={c.id}>
                <td data-label="ikone" className="text-center align-middle">
                  <IconComponent size={40} color="#0d6efd" />
                </td>
                <td data-label="naziv">{c.naziv}</td>
                <td data-label="Opis">
                  <ExpandableText text={c.opis} maxLength={50} />
                </td>
                <td data-label="broj oglasa" className="text-center">{c.brojOglasa}</td>
                <td data-label="kreirano"> 
                  <DateFormat date={c.datumMoj} />
                </td>
                <td data-label="Akcija">
                  <Button onClick={() => { navigate(`/kategorije/${c.id}`) }}>
                    Promijeni
                  </Button>
                  &nbsp; &nbsp;
                  <Button variant='danger' onClick={() => obrisi(c.id)}>
                    Obriši
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </Container>
  )
}