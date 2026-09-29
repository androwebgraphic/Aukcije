import { useEffect, useState } from "react"
import CategoriesService from '../services/categories/CategoriesServices'
import { Container, Table } from "react-bootstrap"
import DateFormat from "../components/DateFormat"
import { Link } from "react-router-dom"
import { RouteNames } from "../constants"

// 1. Pomoćna komponenta za skraćivanje teksta
function ExpandableText({ text, maxLength = 100 }) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!text) return null; // Ako nema opisa, ne prikazuj ništa

  if (text.length <= maxLength) {
    return <span>{text}</span>;
  }

  const displayedText = isExpanded ? text : `${text.substring(0, maxLength)}`;

  return (
    <span>
      {displayedText}
      <span 
        onClick={() => setIsExpanded(!isExpanded)} 
        style={{ color: 'green', cursor: 'pointer', marginLeft: '2px', fontWeight: 'bold' }}
      >
        {isExpanded ? ' (prikaži manje)' : '... cijeli tekst'} 
      </span>
    </span>
  );
}

export default function CategoriesList() {
  const [categories, setCategories] = useState([])

  useEffect(() => { 
    loadCategories()
  }, [])
  
  async function loadCategories() {
    await CategoriesService.get()
      .then((res) => {
        setCategories(res.data)
      })
  }

  return (
    <Container>
      <Link to={RouteNames.CATEGORY_NEW} className="btn btn-success mb-3">
        dodavanje nove kategorije 
      </Link>

      <Table hover striped bordered>
        <thead>
          <tr>
            <th>Naziv</th>
            <th>Opis</th>
            <th>broj oglasa</th>
            <th>Kreirano</th>
          </tr>
        </thead>

        <tbody>
          {categories && categories.map((c) => (
            <tr key={<unsafe_url>c.id</unsafe_url>}>
              <td>{c.name}</td>
              <td>
                {/* 2. Korištenje ExpandableText komponente */}
                <ExpandableText text={c.description} maxLength={50} />
              </td>
              <td className="text-center">{c.numItems}</td>
              <td>
                <DateFormat date={c.datumMoj} />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  )
}