import { Form, Button, Row, Col } from "react-bootstrap"
import { FaPlus } from "react-icons/fa"
import { RouteNames } from "../../constants"
import { useNavigate } from "react-router-dom"
import KorisniciService from "../../services/korisnici/KorisniciService" // 1. Uklonjeno 's' s kraja
import SchemaKorisnik  from "../../schemas/SchemaKorisnik"
import { useState } from "react"
import Heading from "../../components/UI/Heading"

export default function korisnikiiNovi(){

  const navigate = useNavigate()
  const [errors, setErrors] = useState({}) 
  
  async function dodaj(korisnik){ // 2. Ispravljeno 'async.function' u 'async function'
    
    const rezultat = await KorisniciService.dodaj(korisnik) // 3. Ispravljeno 'KorisniciService' u 'korisnikService'

    if (rezultat.success) {
      
      navigate(RouteNames.KORISNICI) // 4. Ispravljen tipfeler u 'ADMINISTARORI'
    } else {
      
      alert(rezultat.message || 'Greška pri dodavanju korisnika')
    }
  }

  function handleSubmit(e) { // 5. Ispravljeno 'handleSubmi' u 'handleSubmit'
  
    e.preventDefault() // 6. Ispravljeno 'e, preventDefault()' u 'e.preventDefault()'
    
    const podatci = new FormData(e.target)
    setErrors({})
    const objektPodataka = Object.fromEntries(podatci)

    // 7. Premještena logika validacije unutar handleSubmit funkcije
    const rezultat = SchemaKorisnik.safeParse(objektPodataka) // 8. Ispravljeno 'SchemaAdministrtaor.safePrse'

    if (!rezultat.success) { // 9. Ispravljen uvjet i dodana vitičasta zagrada
      const noveGreske = {}

      rezultat.error.issues.forEach((issue) => {
        const kljuc = issue.path[0]
        if (!noveGreske[kljuc]) { // 10. Dodana zagrada ']' koja je nedostajala
          noveGreske[kljuc] = issue.message
        }
      })
      
      setErrors(noveGreske)
      return
    }

    // 11. Poziv funkcije dodaj ako je validacija uspješna
    dodaj({

      email: podatci.get('email'),
      lozinka: podatci.get('lozinka'),
      uloga: podatci.get('uloga')

    })
  }

  const ocistiGresku = (nazivPolja) => {
    
    if (errors[nazivPolja]) {
      
      const noveGreske = { ...errors }
      delete noveGreske[nazivPolja]
      setErrors(noveGreske)
    }
  }
  return (
        <>
            <Heading as='h2' color='azure'>Registracija</Heading>

      <Form onSubmit={handleSubmit}>
        
  

                            <Row>
                                <Col xs={12}>
                                    <Form.Group controlId="email" className="mb-3">
                                        <Form.Label className="fw-bold">Email</Form.Label>
                                        <Form.Control
                                            type="email"
                                            name="email"
                                            placeholder="operater@edunova.hr"
                                            isInvalid={!!errors.email}
                                            onFocus={() => ocistiGresku('email')}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.email}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col xs={12}>
                                    <Form.Group controlId="lozinka" className="mb-3">
                                        <Form.Label className="fw-bold">Lozinka</Form.Label>
                                        <Form.Control
                                            type="password"
                                            name="lozinka"
                                            placeholder="Min 8 znakova, velika/mala slova, broj i znak"
                                            isInvalid={!!errors.lozinka}
                                            onFocus={() => ocistiGresku('lozinka')}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.lozinka}
                                        </Form.Control.Feedback>
                                        <Form.Text className="text-muted">
                                            Lozinka mora sadržavati: najmanje 8 znakova, veliko slovo, malo slovo, broj i interpukcijski znak (!@#$%^&*...)
                                        </Form.Text>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col xs={12}>
                                    <Form.Group controlId="uloga" className="mb-3">
                                        <Form.Label className="fw-bold">Uloga</Form.Label>
                                        <Form.Select
                                            name="uloga"
                                            isInvalid={!!errors.uloga}
                                            onFocus={() => ocistiGresku('uloga')}
                                        >
                                            <option value="">Odaberite ulogu...</option>
                                            <option value="admin">Admin</option>
                                            <option value="korisnik">Korisnik</option>
                                        </Form.Select>
                                        <Form.Control.Feedback type="invalid">
                                            {errors.uloga}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <hr />

                            <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-4 forma-akcije">
                                <Button type="submit" variant="success">
                                    <FaPlus className="me-2" aria-hidden="true" />
                                    Dodaj novog korisnika
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline-danger"
                                    onClick={() => navigate(RouteNames.KORISNICI)}
                                >
                                    Odustani
                                </Button>
                            </div>
            </Form>
        </>
    )
  }
