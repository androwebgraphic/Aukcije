import { useEffect, useState, useRef } from "react";
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
import useModal from "../../hooks/useModal";
import useNespremljenePromjene from "../../hooks/useNespremljenePromjene";

export default function KategorijePromijena() {
  const navigate = useNavigate();
  const params = useParams();

  const { potvrdi } = useModal();
  const [imaPromjena, setImaPromjena] = useState(false);
  useNespremljenePromjene(imaPromjena);

  const [kategorija, setKategorija] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});

  const nazivRef = useRef();
  const opisRef = useRef();
  const datumRef = useRef();

  useEffect(() => {
    ucitajKategoriju();
  }, [params.id]);

  async function ucitajKategoriju() {
    setLoading(true);
    try {
      const odgovor = await KategorijeServices.getByID(params.id);
      const s = odgovor.data;

      if (s && s.datumMoj) {
        s.datumMoj = s.datumMoj.substring(0, 10);
      }

      setKategorija(s);
      setImaPromjena(false);
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

  async function handleSubmit(e) {
    e.preventDefault();

    const naziv = nazivRef.current.value.trim();
    const opis = opisRef.current.value.trim();
    const newErrors = {};

    if (naziv.length < 2 || naziv.length > 30) {
      newErrors.naziv = "Naziv mora imati između 2 i 30 znakova.";
    }
    if (opis.length < 3 || opis.length > 500) {
      newErrors.opis = "Opis mora imati između 3 i 500 znakova.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    if (!(await potvrdi("Sigurno spremiti promjene?"))) return;
    promijeni({ naziv, opis });
  }
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
      <Heading as="h2">Promijeni kategoriju: {kategorija.naziv}</Heading>

      <Form onSubmit={handleSubmit} key={kategorija.id || params.id} noValidate>
        <Row>
          <Col xs={12} md={6}>
            <Form.Group controlId="naziv" className="mb-3">
              <FormLabel>Naziv</FormLabel>
              <FormControl
                type="text"
                ref={nazivRef}
                defaultValue={kategorija.naziv || ""}
                isInvalid={!!errors.naziv}
                onChange={() => {
                  setErrors({ ...errors, naziv: null });
                  setImaPromjena(true);
                }}
              />
              <Form.Control.Feedback type="invalid">
                {errors.naziv}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          <Col sm={12} md={6}>
            <Form.Group controlId="opis" className="mb-3">
              <FormLabel>Opis</FormLabel>
              <FormControl
                as="textarea"
                ref={opisRef}
                rows={3}
                defaultValue={kategorija.opis || ""}
                isInvalid={!!errors.opis}
                onChange={() => {
                  setErrors({ ...errors, opis: null });
                  setImaPromjena(true);
                }}
              />
              <Form.Control.Feedback type="invalid">
                {errors.opis}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          
        </Row>

  
  
        <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-4 forma-akcije">
          <Button type="submit" variant="outline-warning">
            Promijeni
          </Button>
          <Button
            type="button"
            variant="outline-danger"
            onClick={async () => {
              if (imaPromjena && !(await potvrdi("Odbaciti nespremljene promjene?"))) return;
              navigate(RouteNames.KATEGORIJE);
            }}>
            Odustani
          </Button>
        </div>
     
     
      </Form>
    </>
  );
}