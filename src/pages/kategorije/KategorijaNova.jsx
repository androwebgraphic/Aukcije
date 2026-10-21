import React, { useRef, useState } from "react";
import {
  Button,
  Col,
  Form,
  FormControl,
  FormLabel,
  Row,

} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants";
import KategorijeServices from '../../services/kategorije/KategorijeServices';
import Heading from "../../components/UI/Heading";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function KategorijaNova() {
  const navigate = useNavigate();

  // Reference za dohvaćanje vrijednosti
  const nazivRef = useRef();
  const opisRef = useRef();

  

  // Stanje za greške
  const [errors, setErrors] = useState({});

  async function dodaj(kategorija) {
    await KategorijeServices.dodaj(kategorija).then(() => {
      navigate(RouteNames.KATEGORIJE);
    });
  }

  function handleSubmit(e) {
    e.preventDefault();

    // 1. Dohvati trenutne vrijednosti
    const naziv = nazivRef.current.value;
    const opis = opisRef.current.value;
    // const datumMoj = datumRef.current.value;
    

    // 2. Validacija
    const newErrors = {};
    if (naziv.trim().length < 3 || naziv.trim().length > 30 || naziv.trim.length ==="") {
    
            toast.error("naziv ne smije biti prazno polje, broj znakova veci od 2 a manji od 30", {
    
              position: "top-center",
              autoclose: 2500,
            
            })
            return
          
          }  else {
                toast.success("Naziv prihvaćen", {
          
                    position: "top-center",
                    autoclose: 2500,
                  
                  })
              }
    if (opis.trim().length < 3 || opis.trim().length > 100) {
    
            toast.error("Opis ne smije biti prazno polje, broj znakova veci od 2 a mnji od 100", {
    
              position: "top-center",
              autoclose: 2500,
            
            })
            return
          
          }  else {
                toast.success("Opis prihvaćen", {
          
                    position: "top-center",
                    autoclose: 2500,
                  
                  })
              }
    if (!naziv.trim()) {
      newErrors.naziv = "Naziv je obavezan.";
    }
    if (!opis.trim()) {
      newErrors.opis = "Opis je obavezan.";
    }
    // if (!datumMoj) {
    //   newErrors.datumMoj = "Datum objave je obavezan.";
    // }
  

    // 3. Ako ima grešaka, postavi ih u stanje i prekini slanje
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // 4. Ako je sve u redu, pošalji podatke
    dodaj({
      naziv,
      opis,

      // datumMoj: new Date(datumMoj).toISOString(),
    });
  }

  return (
    <>
      <Heading as='h2' color='azure'>Dodavanje nove kategorije</Heading>

      <Form onSubmit={handleSubmit} noValidate>
        <Row>
          <Col sm={12} md={6}>
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
        <Row>
          <Col>
            <Button type="submit" className="btn btn-success" size="small">
              Dodaj
            </Button>
          </Col>
          <Col>
            <Link to={RouteNames.KATEGORIJE} className="btn btn-danger">
              Odustani
            </Link>
          </Col>
        </Row>
      </Form>
    </>
  );
}