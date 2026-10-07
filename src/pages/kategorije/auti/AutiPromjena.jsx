import {
  Button,
  Col,
  Form,
  FormControl,
  FormLabel,
  Row,
} from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { RouteNames } from "../../../constants";
import { useEffect, useState } from "react";
import AutiServices from "../../../services/kategorije/AutiServices";
import Heading from "../../../components/UI/Heading";

export default function AutiPromijena() {
  const navigate = useNavigate();
  const params = useParams();
  const [auto, setAuto] = useState(null);

  useEffect(() => {
    ucitajAuti();
  }, []);

  async function ucitajAuti() {
    await AutiServices.getByID(params.id).then((odgovor) => {
      const s = odgovor.data;

      // Pretvaramo ISO datume u YYYY-MM-DD za type="date" inpute
      if (s.datumMoj) {
        s.datumMoj = s.datumMoj.substring(0, 10);
      }
      if (s.zavrsava) {
        s.zavrsava = s.zavrsava.substring(0, 10);
      }

      setAuto(s);
    });
  }

  async function promijeni(autoPodaci) {
    await AutiServices.promijeni(params.id, autoPodaci).then(() => {
      navigate(RouteNames.AUTI);
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    const dataNew = new FormData(e.currentTarget);

    const formatDatum = (d) => (d ? new Date(d).toISOString() : null);

    promijeni({
      naziv: dataNew.get("naziv"),
      opis: dataNew.get("opis"),
      godinaProizvodnje: Number(dataNew.get("godinaProizvodnje")),
      stanje: dataNew.get("stanje"),
      datumMoj: formatDatum(dataNew.get("datumMoj")),
      pocetnaCijena: Number(dataNew.get("pocetnaCijena")),
      zavrsava: formatDatum(dataNew.get("zavrsava")),
    });
  }

  // Dok se podaci ne učitaju, prikazujemo poruku učitavanja
  if (!auto) {
    return <div>Učitavanje...</div>;
  }

  return (
    <>
           <Heading as='h2' color='azure' className="display-2" >Lista auta</Heading>
     

      <Form onSubmit={handleSubmit}>
        <Row>
          <Col sm={12} md={6}>
            <Form.Group controlId="naziv">
              <FormLabel>Naziv</FormLabel>
              <FormControl
                type="text"
                name="naziv"
                required
                defaultValue={auto.naziv}
              />
            </Form.Group>
          </Col>

          <Col sm={12} md={6}>
            <Form.Group controlId="opis">
              <FormLabel>Opis</FormLabel>
              <FormControl
                as="textarea"
                name="opis"
                rows={3}
                defaultValue={auto.opis}
              />
            </Form.Group>
          </Col>

          <Col sm={12} md={6}>
            <Form.Group controlId="godinaProizvodnje">
              <FormLabel>Godina proizvodnje</FormLabel>
              <FormControl
                type="number"
                name="godinaProizvodnje"
                defaultValue={auto.godinaProizvodnje}
              />
            </Form.Group>
          </Col>

          <Col sm={12} md={6}>
            <Form.Group controlId="stanje">
              <FormLabel>Stanje</FormLabel>
              <FormControl
                type="text"
                name="stanje"
                defaultValue={auto.stanje}
              />
            </Form.Group>
          </Col>

          

          <Col sm={12} md={6}>
            <Form.Group controlId="pocetnaCijena">
              <FormLabel>Pocetna cijena</FormLabel>
              <FormControl
                type="number"
                name="pocetnaCijena"
                defaultValue={auto.pocetnaCijena}
              />
            </Form.Group>
          </Col>

          <Col sm={12} md={6}>
            <Form.Group controlId="zavrsava">
              <FormLabel>Zavrsava</FormLabel>
              <FormControl
                type="date"
                name="zavrsava"
                defaultValue={auto.zavrsava}
              />
            </Form.Group>
          </Col>
        </Row>

        <hr />
        <Row>
          <Col sm={12} md={6}>
            <Button type="submit" className="btn btn-success">
              Promijeni
            </Button>
          </Col>
          <Col sm={12} md={6}>
            <Link to={RouteNames.AUTI} className="btn btn-danger">
              Odustani
            </Link>
          </Col>
        </Row>
      </Form>
    </>
  );
}