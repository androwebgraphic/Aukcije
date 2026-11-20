import { Button, Col, Form, Row, Modal } from "react-bootstrap";
import { BiQuestionMark } from 'react-icons/bi';
import { Link, useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants"
import KorisniciService from "../../services/korisnici/KorisniciService"
import Heading from "../../components/UI/Heading";

import Uvjeti from "../../pages/Uvjeti"
import { useState } from "react";
export default function KorisnikoNovi() {
    const navigate = useNavigate();
    const [show, setShow] = useState(false)
    const [korisnikZaUnos, setKorisnikZaUnos] = useState({})

    async function dodaj() {
        try {
            const odgovor = await KorisniciService.dodaj(korisnikZaUnos);
            // Servis ne baca grešku, vraća { success: false, message }, pa se
            // rezultat mora provjeriti prije preusmjeravanja.
            if (!odgovor || odgovor.success === false) {
                throw new Error(odgovor?.message || "Registracija nije uspjela.");
            }
            setShow(false)
            navigate(RouteNames.KORISNICI); // Preusmjeravanje nakon uspješnog slanja
        } catch (error) {
            console.error("Greška prilikom registracije korisnika:", error);
        }
    }

    function prikaziModal(korisnik){
        setKorisnikZaUnos(korisnik)
        setShow(true)
    }


    function handleSubmit(e) {
        e.preventDefault();
        const podatci = new FormData(e.target);

        // Trenutni datum i vrijeme u ISO formatu
        const dateAdded = new Date().toISOString();

        // Slanje podataka s uključenim automatskim datumom
       prikaziModal({
            ime: podatci.get('ime') || '',
            email: podatci.get('email') || '',
            lozinka: podatci.get('lozinka') || '',
            uloga: 'korisnik',
            dodano: dateAdded, // Ovdje šaljemo automatski generirani datum (prilagodi naziv 'dodano' ako backend traži npr. 'datum')
        })

        
    }

    return (
      <>
        <Heading as='h2' color='azure'>Registracija</Heading>

     
            <Row>
              <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col sm={12} md={6}>
                      <Form.Group controlId="ime">
                          <Form.Label>Ime</Form.Label>
                          <Form.Control type="text" name="ime" required placeholder="Upiši ime ili korisničko ime"/>
                      </Form.Group>
                    </Col>
                    <Col sm={12} md={6}>
                      <Form.Group controlId="email">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" name="email" required placeholder="Upiši adresu e-pošte"/>
                      </Form.Group>
                    </Col>
              
                    <Col sm={12} md={6}>
                    </Col>
                    <Col sm={12} md={6}>
                      <Form.Group controlId="lozinka" className="mt-2">
                          <Form.Label>Lozinka</Form.Label>
                          <Form.Control type="password" name="lozinka" required placeholder="Upiši lozinku" />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row className="mt-4 mb-3">
                    <Col xs={6} sm={6}>
                        <Button type="submit" variant="outline-success" size="sm">
                            Registriraj se
                        </Button>
                    </Col>
                    <Col xs={6} sm={6}>
                        <Button variant="outline-danger" size="sm" as={Link} to={RouteNames.KORISNICI}>
                            Odustani
                        </Button>
                    </Col>
                  </Row>
              </Form>
          </Row>




<Modal 
      show={show} 
      centered 
      onHide={()=>setShow(false)}
      backdrop='static'
          contentClassName='border-0 shadow-lg rounded-4'
          style={{}}
    >
      <Modal.Header closeButton className='border-0 pb-0 pt-4 px-4'>
        <div className='d-flex align-items-center gap-3'>
          <div 
            className='d-flex align-items-center justify-content-center rounded-circle bg-warning bg-opacity-25 text-warning' 
            style={{ width: '42px', height: '42px' }}
          >
            <BiQuestionMark size={26} />
          </div>
          <Modal.Title className='fs-5 fw-bold mb-0 '>
            Pročitajte i prihvatite
          </Modal.Title>
        </div>
      </Modal.Header>

      <Modal.Body className='text-secondary fs-6 py-3 px-4' style={{maxHeight: '300px', overflow: 'auto'}}>
        



            <Uvjeti />
            









        <Button onClick={dodaj}>
            Pristajem
        </Button>




      </Modal.Body>
{/* 
      <Modal.Footer className='border-0 pt-2 pb-4 px-4 gap-2'>
        Možda nešto
      </Modal.Footer> */}
    </Modal>

        </>
    );
}
