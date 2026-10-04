import { useEffect, useState } from "react"
import CategoriesService from '../services/categories/CategoriesServices'
import { Button, Container, Table } from "react-bootstrap"
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

export default function CategoriesList() {
  const [categories, setCategories] = useState([])
  const navigate = useNavigate()

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
          {categories && categories.map((c) => (
            <tr key={c.id}>
              <td data-label="naziv">{c.name}</td>
              <td data-label="Opis">
                <ExpandableText text={c.description} maxLength={50} />
              </td>
              <td data-label="broj oglasa" className="text-center">{c.numItems}</td>
              <td data-label="kreirano"> 
                <DateFormat date={c.datumMoj} />
              </td>
              <td>
                {/* Ispravljeno sa categories.id na c.id i dodana kosa crta na početak */}
                <Button onClick={() => { navigate(`/categories/${c.id}`) }}>
                  Promijeni
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  )
}