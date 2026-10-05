import { useEffect, useState } from "react";
import AutiServices from "../../../services/kategorije/AutiServices";
import { Container, Table, Button } from "react-bootstrap";
import DateFormat from "../../../components/DateFormat";
import { Link, useNavigate } from "react-router-dom";
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

export default function AutiList() {
  const [auti, setAuti] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    ucitajAute();
  }, []);

  async function ucitajAute() {
    try {
      const odgovor = await AutiServices.get();
      setAuti(odgovor.data);
    } catch (error) {
      console.error("Greška pri dohvaćanju automobila:", error);
    }
  }

  return (

  
    <Container>
      <h1>Lista automobila </h1>
      <Link to={RouteNames.AUTI_NOVI} className="btn btn-success mb-3">
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
            <th>Akcija</th>
          </tr>
        </thead>

        <tbody>
          {auti &&
            auti.map((c, index) => (
              <tr key={c.codeID ?? index}>
                <td data-label="Naziv">{c.naziv}</td>
                <td data-label="Opis">
                  <ExpandableText text={c.opis} maxLength={50} />
                </td>
                <td data-label="Godina proizvodnje">{c.godinaProizvodnje}</td>
                <td data-label="Stanje" className="text-center">
                  {c.stanje}
                </td>
                <td data-label="Kreirano">
                  <DateFormat date={c.dodano} />
                </td>
                <td data-label="Početna cijena">{c.pocetnaCijena}</td>
                <td data-label="Aukcija završava">
                  <DateFormat date={c.zavrsava} />
                </td>
                <td data-label="Akcija">
                  <Button onClick={() => { navigate(`/auti/${c.id}`); }}>
                    Promjeni
                  </Button>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
    </Container>
  );
}