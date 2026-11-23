import { Alert, Button, Col, Form, Row, Modal } from "react-bootstrap";
import { BiQuestionMark } from 'react-icons/bi';
import { Link, useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants"
import KorisniciService from "../../services/korisnici/KorisniciService"
import { ShemaRegistracija } from "../../schemas/SchemaKorisnik"
import Heading from "../../components/UI/Heading";

import Uvjeti from "../../pages/Uvjeti"
import { useState } from "react";

/**
 * Provjera postoji li već korisnik s tom e-mail adresom.
 * Usporedba ignorira velika/mala slova i praznine na početku/kraju.
 * Baca grešku ako popis korisnika nije moguće dohvatiti — u tom slučaju
 * registraciju ne puštamo naslijepo.
 */
async function postojiKorisnikSEmailom(email) {
    const trazeni = String(email ?? "").trim().toLowerCase();
    if (!trazeni) return false;

    const odgovor = await KorisniciService.get();

    if (odgovor && odgovor.success === false) {
        throw new Error(odgovor.message || "Popis korisnika nije dostupan.");
    }

    const lista = Array.isArray(odgovor) ? odgovor : odgovor?.data;
    if (!Array.isArray(lista)) return false;

    return lista.some(
        (korisnik) => String(korisnik?.email ?? "").trim().toLowerCase() === trazeni
    );
}

// Zod greške pretvaramo u { nazivPolja: prvaPoruka } kako bi svako polje
// prikazalo svoju poruku (email, lozinka), umjesto jedne zajedničke.
function greskePoPoljima(error) {
    const polja = {};
    for (const issue of error.issues) {
        const polje = String(issue.path?.[0] ?? "opcenito");
        if (!polja[polje]) polja[polje] = issue.message;
    }
    return polja;
}

export default function KorisnikoNovi() {
    const navigate = useNavigate();
    const [show, setShow] = useState(false)
    const [korisnikZaUnos, setKorisnikZaUnos] = useState({})
    const [greska, setGreska] = useState("")
    const [errors, setErrors] = useState({})
    const [saljem, setSaljem] = useState(false)

    async function dodaj() {
        if (saljem) return;

        setSaljem(true)
        setGreska("")

        try {
            // Ponovna provjera prije upisa: korisnik je mogao biti registriran
            // u drugoj kartici dok je ovaj modal s uvjetima bio otvoren.
            if (await postojiKorisnikSEmailom(korisnikZaUnos.email)) {
                setShow(false)
                setGreska(`Korisnik s e-mail adresom ${korisnikZaUnos.email} već postoji. Prijavite se ili upotrijebite drugu adresu.`)
                return
            }

            const odgovor = await KorisniciService.dodaj(korisnikZaUnos);
            // Servis ne baca grešku, vraća { success: false, message }, pa se
            // rezultat mora provjeriti prije preusmjeravanja.
            if (!odgovor || odgovor.success === false) {
                throw new Error(odgovor?.message || "Registracija nije uspjela.");
            }
            setShow(false)
            navigate(RouteNames.LOGIRANJE); // Preusmjeravanje nakon uspješnog slanja
        } catch (error) {
            console.error("Greška prilikom registracije korisnika:", error);
            setShow(false)
            setGreska(error?.message || "Registracija nije uspjela. Pokušajte ponovno.")
        } finally {
            setSaljem(false)
        }
    }

    function prikaziModal(korisnik){
        setKorisnikZaUnos(korisnik)
        setShow(true)
    }

    function ocistiGresku(polje) {
        if (errors[polje]) {
            const noveGreske = { ...errors }
            delete noveGreske[polje]
            setErrors(noveGreske)
        }
    }


    async function handleSubmit(e) {
        e.preventDefault();
        const podatci = new FormData(e.target);
        const ime = String(podatci.get('ime') || '').trim();
        const email = String(podatci.get('email') || '').trim();
        const lozinka = String(podatci.get('lozinka') || '');

        // Trenutni datum i vrijeme u ISO formatu
        const dateAdded = new Date().toISOString();

        setGreska("")
        setErrors({})

        // Zod validacija svih polja (ime, format e-maila, pravila lozinke)
        // prije provjere u bazi.
        const rezultat = ShemaRegistracija.safeParse({ ime, email, lozinka, uloga: 'korisnik' })

        if (!rezultat.success) {
            setErrors(greskePoPoljima(rezultat.error))
            return
        }

        try {
            if (await postojiKorisnikSEmailom(rezultat.data.email)) {
                setGreska(`Korisnik s e-mail adresom ${rezultat.data.email} već postoji. Prijavite se ili upotrijebite drugu adresu.`)
                return
            }
        } catch (error) {
            console.error("Greška pri provjeri e-mail adrese:", error);
            setGreska("Nije moguće provjeriti postoji li korisnik s tom e-mail adresom. Pokušajte ponovno.")
            return
        }

        // Slanje podataka s uključenim automatskim datumom
       prikaziModal({
            ime: rezultat.data.ime,
            email: rezultat.data.email,
            lozinka: rezultat.data.lozinka,
            uloga: 'korisnik',
            dodano: dateAdded, // Ovdje šaljemo automatski generirani datum (prilagodi naziv 'dodano' ako backend traži npr. 'datum')
        })

        
    }

    return (
      <>
        <Heading as='h2' color='azure'>Registracija</Heading>

        {greska && (
          <Alert variant="danger" dismissible onClose={() => setGreska("")}>
            {greska}
          </Alert>
        )}
            <Row>
              <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col sm={12} md={6}>
                      <Form.Group controlId="ime">
                          <Form.Label>Ime</Form.Label>
                          <Form.Control
                            type="text"
                            name="ime"
                            required
                            placeholder="Upiši ime ili korisničko ime"
                            isInvalid={!!errors.ime}
                            onFocus={() => ocistiGresku('ime')}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.ime}
                          </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col sm={12} md={6}>
                      <Form.Group controlId="email">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          required
                          placeholder="Upiši adresu e-pošte"
                          isInvalid={!!errors.email}
                          onFocus={() => ocistiGresku('email')}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.email}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
              
                    <Col sm={12} md={6}>
                    </Col>
                    <Col sm={12} md={6}>
                      <Form.Group controlId="lozinka" className="mt-2">
                          <Form.Label>Lozinka</Form.Label>
                          <Form.Control
                            type="password"
                            name="lozinka"
                            required
                            placeholder="Upiši lozinku"
                            isInvalid={!!errors.lozinka}
                            onFocus={() => ocistiGresku('lozinka')}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.lozinka}
                          </Form.Control.Feedback>
                          <Form.Text className="text-muted">
                            Najmanje 8 znakova, veliko i malo slovo, broj i interpunkcijski znak.
                          </Form.Text>
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
            









        <Button onClick={dodaj} disabled={saljem}>
            {saljem ? 'Šaljem…' : 'Pristajem'}
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
