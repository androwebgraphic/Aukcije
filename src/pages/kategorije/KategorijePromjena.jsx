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
import {ToastContainer, toast} from "react-toastify"

export default function KategorijePromijena() {
  const navigate = useNavigate();
  const params = useParams();

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

    const naziv = nazivRef.current.value;
    const opis = opisRef.current.value; 
    if (naziv.trim().length < 2 || naziv.trim().length > 30 || naziv.trim() === "") {

      toast.error("Polja ne smiju biti prazna, broj znakova veci od 2 a mnji od 10", {

        position: "top-center",
        autoclose: 3000,
        
      })
      return
      
    } else {
      toast.success("Naziv je. prihvaćen")
    }
    
  
      if (opis.trim().length < 3 || opis.trim().length > 500 || opis.trim().length ==="") {

        toast.error("Opis ne smije biti prazno polje, broj znakova veci od 2 a mnji od 500", {

          position: "top-center",
          autoclose: 2500,
        
        })
        return
      
      }
    
     else {
      toast.success("Opis prihvaćen", {

          position: "top-center",
          autoclose: 2500,
        
        })
    }

    const newErrors = {};

    if (!naziv.trim()) {
      newErrors.naziv = "Naziv je obavezan.";
      
    }
    if (!opis.trim()) {
      newErrors.opis = "Opis je obavezan.";
    }
  

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    promijeni({
      naziv,
      opis,
  
    });
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
                onChange={() => setErrors({ ...errors, naziv: null })}
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
                onChange={() => setErrors({ ...errors, opis: null })}
              />
              <Form.Control.Feedback type="invalid">
                {errors.opis}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          
        </Row>

  
  
                                <div className="d-flex gap-2 mt-predmet pt-2 ">

            <Button type="submit" className="btn btn-warning w-100" size="sm">
              Promijeni
            </Button>
      
   
           <Button size="sm" className="btn btn-danger w-100 "> <Link to={RouteNames.KATEGORIJE} >
              Odustani
          </Link>
            </Button>
            </div>
     
     
      </Form>
    </>
  );
}