import { useEffect, useState } from "react";
import {
  Button,
  Col,
  Form,
  FormControl,
  FormLabel,
  Row,
  Spinner,
} from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import Heading from "../../components/UI/Heading";
import { RouteNames } from "../../constants";
import KategorijeServices from "../../services/kategorije/KategorijeServices";

export default function KategorijePromijena() {
  const navigate = useNavigate();
  const params = useParams();
  const [kategorija, setKategorija] = useState(null); // Postavljamo na null dok se ne učita
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ucitajKategoriju();
  }, [params.id]);

  async function ucitajKategoriju() {
    setLoading(true);
    try {
      const odgovor = await KategorijeServices.getByID(params.id);
      console.log("Odgovor iz SErvisa: ",odgovor)
      const s = odgovor.data;

      if (s && s.datumMoj) {
        s.datumMoj = s.datumMoj.substring(0, 10);
      }

      setKategorija(s);
    } catch (error) {
      console.error("Greška pri učitavanju kategorije:", error);
    } finally {
      setLoading(false);
    }
  }

  async function promijeni(kategorijaData) {
    try {
      await KategorijeServices.promijeni(params.id, kategorijaData);
      navigate(RouteNames.KATEGORIJE);
    } catch (error) {
      console.error("Greška pri spremanju promjena:", error);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    const dataNew = new FormData(e.target);

    promijeni({
      naziv: dataNew.get("naziv"),
      opis: dataNew.get("opis"),
      brojOglasa: Number(dataNew.get("brojOglasa")),
      datumMoj: dataNew.get("datumMoj")
        ? new Date(dataNew.get("datumMoj")).toISOString()
        : null,
    });
  }

  // 1. Dok se podaci učitavaju, prikazujemo Spinner
  if (loading || !kategorija) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Učitavanje...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <>
      <Heading as="h1" className="display-2 mb-4">
        Promijeni kategoriju: {kategorija.naziv}
      </Heading>

      {/* 2. key={kategorija.id || params.id} osigurava da se defaultValue ispravno napuni */}
      <Form onSubmit={handleSubmit} key={kategorija.id || params.id}>
        <Row>
          <Col sm={12} md={6}>
            <Form.Group controlId="naziv" className="mb-3">
              <FormLabel>Naziv</FormLabel>
              <FormControl
                type="text"
                name="naziv"
                required
                defaultValue={kategorija.naziv || ""}
              />
            </Form.Group>
          </Col>

          <Col sm={12} md={6}>
            <Form.Group controlId="opis" className="mb-3">
              <FormLabel>Opis</FormLabel>
              <FormControl
                as="textarea"
                name="opis"
                rows={3}
                defaultValue={kategorija.opis || ""}
              />
            </Form.Group>
          </Col>

          <Col sm={12} md={6}>
            <Form.Group controlId="datumMoj" className="mb-3">
              <FormLabel>Datum objave</FormLabel>
              <FormControl
                type="date"
                name="datumMoj"
                defaultValue={kategorija.datumMoj || ""}
              />
            </Form.Group>
          </Col>

          <Col sm={12} md={6}>
            <Form.Group controlId="brojOglasa" className="mb-3">
              <FormLabel>Broj oglasa</FormLabel>
              <FormControl
                type="number"
                name="brojOglasa"
                defaultValue={kategorija.brojOglasa ?? ""}
              />
            </Form.Group>
          </Col>
        </Row>

        <hr />
        <Row>
          <Col sm={12} md={6} className="mb-2">
            <Button type="submit" variant="success" className="w-100">
              Promijeni
            </Button>
          </Col>
          <Col sm={12} md={6}>
            <Link to={RouteNames.KATEGORIJE} className="btn btn-danger w-100">
              Odustani
            </Link>
          </Col>
        </Row>
      </Form>
    </>
  );
}
