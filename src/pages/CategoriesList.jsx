import { useEffect, useState } from "react"
import CategoriesService from '../services/categories/CategoriesServices'
import { Container, Table } from "react-bootstrap"
import DateFormat from "../components/DateFormat"
import { Link } from "react-router-dom"
import { RouteNames } from "../constants"
import { FaArrowTurnDown } from "react-icons/fa6";
import { FaArrowTurnUp } from "react-icons/fa6";
import '../ResponsiveTable.css';

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
        style={{color: 'green',cursor: 'pointer', marginLeft: '.2rem', fontWeight: 'bold'}}
      >
        {isExpanded ?  <FaArrowTurnUp />:'...'} 
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

      <Table hover  striped bordered className="table-stacked">
        <thead>
          <tr>
            <th key="naziv">Naziv</th>
            <th key="opis">Opis</th>
            <th key="brojOglasa">broj oglasa</th>
            <th key="kreirano">Kreirano</th>
          </tr>
        </thead>

        <tbody>
          {categories && categories.map((c) => (
            <tr key={c.id}>
              <td data-label="naziv" key={c.name}>{c.name}</td>
              <td data-label='Opis' key={c.description}>
                {/* 2. Korištenje ExpandableText komponente */}
                <ExpandableText text={c.description} maxLength={50} />
              </td>
              <td data-label="broj oglasa"className="text-center" key={c.numItems}>{c.numItems}</td>
              <td data-label="kreirano" key={c.datumMoj}> 
                <DateFormat date={c.datumMoj} />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  )
}