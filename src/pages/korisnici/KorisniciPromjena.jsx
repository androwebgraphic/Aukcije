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
import KorisniciServices from "../../services/korisnici/KorisniciServices";
import Heading from "../../components/UI/Heading";

export default function KorisniciPromijena() {
  const navigate = useNavigate();
  const params = useParams();
  const [korisnik, setKorisnik] = useState(null);

  useEffect(() => {
    ucitajKorisnici();
  }, []);

  async function ucitajKorisnici() {
    await KorisniciServices.getByID(params.id).then((odgovor) => {
      const s = odgovor.data || {};

      // Pretvaramo ISO datume u YYYY-MM-DD za type="date" inpute
      if (s && s.datumMoj) {
        s.datumMoj = s.datumMoj.substring(0, 10);
      }
      

      setKorisnik(s);
    });
  }

  async function promijeni(podatci) {
    await KorisniciServices.promijeni(params.id,podatci).then(() => {
      navigate(RouteNames.KORISNICI);
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    const dataNew = new FormData(e.currentTarget);

    const formatDatum = (d) => (d ? new Date(d).toISOString() : null);

    promijeni({
      ime: dataNew.get("ime"),
      email: dataNew.get("email"),

      lozinka: dataNew.get("lozinka"),
    });
  }

  // Dok se podaci ne učitaju, prikazujemo poruku učitavanja
  if (!korisnik) {
    return <div>Učitavanje...</div>;
  }

  return (
    <>
      <Heading as='h2' color='azure' className="display-2" >Promjena korisnika: {korisnik.ime }</Heading>
     

      <Form onSubmit={handleSubmit}>
        <Row>
          <Col sm={12} md={6}>
            <Form.Group controlId="ime">
              <FormLabel>Ime</FormLabel>
              <FormControl
                type="text"
                name="ime"
                required
                defaultValue={korisnik.ime}
              />
            </Form.Group>
          </Col>

          <Col sm={12} md={6}>
            <Form.Group controlId="email">
              <FormLabel>Email</FormLabel>
              <FormControl
               type="text"
                name="email"
            
                defaultValue={korisnik.email}
              />
            </Form.Group>

             <Form.Group controlId="lozinka">
              <FormLabel>Lozinka</FormLabel>
              <FormControl
               type="text"
                name="lozinka"
            
                defaultValue={korisnik.lozinka}
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
            <Link to={RouteNames.KORISNICI} className="btn btn-danger">
              Odustani
            </Link>
          </Col>
        </Row>
      </Form>
    </>
  );
}