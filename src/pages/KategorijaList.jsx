import { useEffect, useState } from "react"
import KategorijeServices from "../services/kategorije/KategorijeServices"
import { Button, Container, FormGroup, Table } from "react-bootstrap"
import DateFormat from "../components/DateFormat"
import { Link, useNavigate } from "react-router-dom"
import { RouteNames } from "../constants"
import { FaArrowTurnDown } from "react-icons/fa6";
import { FaArrowTurnUp } from "react-icons/fa6";
import '../ResponsiveTable.css';

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
        style={{color: 'green', cursor: 'pointer', marginLeft: '.2rem', fontWeight: 'bold'}}
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
  }

  async function obrisi(id) {
  
    if (!confirm('Želite obrisat?')) {
      return
    }
    await KategorijeServices.obrisi(id)

    ucitajKategorije()
}

  return (
    <Container>
      <h1>Lista kategorija</h1>
      <Link to={RouteNames.KATEGORIJA_NOVA} className="btn btn-success mb-3">
        dodavanje nove kategorije 
      </Link>

      <Table hover striped bordered className="table-stacked">
        <thead>
          <tr>
            <th>Naziv</th>
            <th>Opis</th>
            <th>broj oglasa</th>
            <th>Kreirano</th>
            <th>Akcija</th>
          </tr>
        </thead>

        <tbody>
          {kategorije && kategorije.map((c) => (
            <tr key={c.id}>
              <td data-label="naziv">{c.naziv}</td>
              <td data-label="Opis">
                <ExpandableText text={c.opis} maxLength={50} />
              </td>
              <td data-label="broj oglasa" className="text-center">{c.brojOglasa}</td>
              <td data-label="kreirano"> 
                <DateFormat date={c.datumMoj} />
              </td>
              <td>
               
                <Button onClick={() => { navigate(`/kategorije/${c.id}`) }}>
                  Promijeni
                
                </Button>
&nbsp; &nbsp;
                <Button variant='danger' onClick={ () => obrisi(c.id) }>
              Obriši

                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  )
}