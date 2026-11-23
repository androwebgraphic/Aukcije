import React, { useRef, useState } from "react";
import {
  Button,
  Col,
  Form,
  FormControl,
  FormLabel,
  Row
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants";
import KategorijeServices from '../../services/kategorije/KategorijeServices';
import Heading from "../../components/UI/Heading";
import { FaPlus } from "react-icons/fa";
import useModal from "../../hooks/useModal"


export default function KategorijaNova() {
  const navigate = useNavigate();

  // Reference za dohvaćanje vrijednosti
  const nazivRef = useRef();
  const opisRef = useRef();

  

  // Stanje za greške
  const [errors, setErrors] = useState({});

  async function dodaj(kategorija) {
    showLoading()
    await KategorijeServices.dodaj(kategorija).then(() => {
      navigate(RouteNames.KATEGORIJE);
    });
    hideLoading()
  }

  function handleSubmit(e) {
    e.preventDefault();

    const naziv = nazivRef.current.value.trim();
    const opis = opisRef.current.value.trim();
    const newErrors = {};

    if (naziv.length < 3 || naziv.length > 30) {
      newErrors.naziv = "Naziv mora imati između 3 i 30 znakova.";
    }
    if (opis.length < 3 || opis.length > 100) {
      newErrors.opis = "Opis mora imati između 3 i 100 znakova.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    dodaj({ naziv, opis });
  }


  
  return (
    <>
      <Heading as='h2' color='azure'>Dodavanje nove kategorije</Heading>

      <Form onSubmit={handleSubmit} noValidate>
        <Row>
          <Col xs={12} md={6}>
            <Form.Group controlId="naziv">
              <FormLabel>Naziv</FormLabel>
              <FormControl 
                type="text" 
                ref={nazivRef} 
                isInvalid={!!errors.naziv}
                onChange={() => setErrors({...errors, naziv: null})}
              />
              <Form.Control.Feedback type="invalid">
                {errors.naziv}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          <Col sm={12} md={6}>
            <Form.Group controlId="opis">
              <FormLabel>Opis</FormLabel>
              <FormControl 
                as="textarea" 
                ref={opisRef} 
                rows={3} 
                isInvalid={!!errors.opis}
                onChange={() => setErrors({...errors, opis: null})}
              />
              <Form.Control.Feedback type="invalid">
                {errors.opis}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

         </Row>

        <hr />
        <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-4 forma-akcije">
          <Button type="submit" variant="success">
            <FaPlus className="me-2" aria-hidden="true" />
            Dodaj
          </Button>
          <Button
            type="button"
            variant="outline-danger"
            onClick={() => navigate(RouteNames.KATEGORIJE)}>
            Odustani
          </Button>
        </div>
        </Form>
    </>
  );
}