import {
  Button,
  Col,
  Form,
  FormControl,
  FormLabel,
  Row,
} from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { RouteNames } from "../../constants";
import { useEffect, useState } from "react";
import ViniliServices from "../../services/vinili/ViniliServices";
import Heading from "../../components/UI/Heading";

export default function ViniliPromijena() {
  const navigate = useNavigate();
  const params = useParams();
  
  // Inicijaliziramo s praznim objektom ili potrebnim poljima da spriječimo rušenje
  const [vinil, setVinil] = useState({
    naziv: "",
    opis: "",
    godinaProizvodnje: "",
    stanje: "",
    datumMoj: "",
    pocetnaCijena: "",
    zavrsava: ""
  });
  const [ucitava, setUcitava] = useState(true);

  useEffect(() => {
    ucitajVinilic();
  }, []);

  async function ucitajVinilic(){
    try {
      const odgovor = await ViniliServices.getByID(params.id);
      const s = odgovor.data || {};

      // Formatiranje datuma za input tipa "date" (YYYY-MM-DD)
      if (s.datumMoj) s.datumMoj = s.datumMoj.substring(0, 10);
      if (s.zavrsava) s.zavrsava = s.zavrsava.substring(0, 10);

      setVinil(s);
    } catch (error) {
      console.error("Greška kod dohvata vinila:", error);
    } finally {
      setUcitava(false);
    }
  }

  // Funkcija koja prati promjene u bilo kojem inputu
  function handleChange(e) {
    const { name, value } = e.target;
    setVinil(prev => ({
      ...prev,
      [name]: value
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const formatDatum = (d) => (d ? new Date(d).toISOString() : null);

    const podatciZaSlanje = {
      naziv: vinil.naziv,
      opis: vinil.opis,
      godinaProizvodnje: vinil.godinaProizvodnje ? Number(vinil.godinaProizvodnje) : 0,
      stanje: vinil.stanje,
      datumMoj: formatDatum(vinil.datumMoj),
      pocetnaCijena: vinil.pocetnaCijena ? Number(vinil.pocetnaCijena) : 0,
      zavrsava: formatDatum(vinil.zavrsava),
    };

    try {
      await ViniliServices.promijeni(params.id, podatciZaSlanje);
      navigate(RouteNames.VINILI);
    } catch (error) {
      console.error("Greška kod spremanja:", error);
    }
  }

  if (ucitava) {
    return <div>Učitavanje...</div>;
  }

  return (
    <>
      <Heading as='h2' color='azure' className="display-2">Promjena vinila: {vinil.naziv}</Heading>
     
      <Form onSubmit={handleSubmit} noValidate autoComplete="off">
        <Row>
          <Col sm={12} md={6}>
            <Form.Group controlId="naziv">
              <FormLabel>Naziv</FormLabel>
              <FormControl
                type="text"
                name="naziv"
                // required
                value={vinil.naziv || ""}
                onChange={handleChange}
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
                value={vinil.opis || ""}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>

          <Col sm={12} md={6}>
            <Form.Group controlId="godinaProizvodnje">
              <FormLabel>Godina proizvodnje</FormLabel>
              <FormControl
                type="number"
                name="godinaProizvodnje"
                value={vinil.godinaProizvodnje || ""}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>

          <Col sm={12} md={6}>
            <Form.Group controlId="stanje">
              <FormLabel>Stanje</FormLabel>
              <FormControl
                type="text"
                name="stanje"
                value={vinil.stanje || ""}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>

          <Col sm={12} md={6}>
            <Form.Group controlId="pocetnaCijena">
              <FormLabel>Početna cijena</FormLabel>
              <FormControl
                type="number"
                name="pocetnaCijena"
                value={vinil.pocetnaCijena || ""}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>

          <Col sm={12} md={6}>
            <Form.Group controlId="zavrsava">
              <FormLabel>Završava</FormLabel>
              <FormControl
                type="date"
                name="zavrsava"
                value={vinil.zavrsava || ""}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>

        <hr />
        <Row>
          <Col sm={12} md={6}>
            <Button type="submit" className="btn btn-warning">
              Promijeni
            </Button>
          </Col>
          <Col sm={12} md={6}>
            <Link to={RouteNames.VINILI} className="btn btn-danger">
              Odustani
            </Link>
          </Col>
        </Row>
      </Form>
    </>
  );
}