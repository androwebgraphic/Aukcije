import { useEffect, useState } from "react";
import CarsServices from "../../../services/categories/CarsServices";
import { Container, Table } from "react-bootstrap";
import DateFormat from "../../../components/DateFormat";
import { Link } from "react-router-dom";
import { RouteNames } from "../../../constants";
import { FaArrowTurnUp } from "react-icons/fa6";

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

export default function CarsList() {
  const [cars, setCars] = useState([]);

  useEffect(() => {
    loadCars();
  }, []);

  async function loadCars() {
    try {
      const odgovor = await CarsServices.get();
      setCars(odgovor.data);
    } catch (error) {
      console.error("Greška pri dohvaćanju automobila:", error);
    }
  }

  return (
    <Container>
      <Link to={RouteNames.CAR_NEW} className="btn btn-success mb-3">
        Dodavanje novog auta
      </Link>

      <Table hover bordered className="table-stacked">
        <thead>
          <tr>
            <th>Naziv</th>
            <th>Opis</th>
            <th>Godina proizvodnje</th>
            <th>Stanje</th>
            <th>Kreirano</th>
            <th>Početna cijena</th>
            <th>Aukcija završava</th>
          </tr>
        </thead>

        <tbody>
          {cars &&
            cars.map((c, index) => (
              <tr key={c.id ?? index}>
                <td data-label="Naziv">{c.name}</td>
                <td data-label="Opis">
                  <ExpandableText text={c.description} maxLength={50} />
                </td>
                <td data-label="Godina proizvodnje">{c.productionYear}</td>
                <td data-label="Stanje" className="text-center">
                  {c.condition}
                </td>
                <td data-label="Kreirano">
                  <DateFormat date={c.dateAdded} />
                </td>
                <td data-label="Početna cijena">{c.startPrice}</td>
                <td data-label="Aukcija završava">
                  <DateFormat date={c.dateEnds} />
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
    </Container>
  );
}