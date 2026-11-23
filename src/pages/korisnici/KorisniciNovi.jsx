import { Form, Button, Row, Col, Alert } from "react-bootstrap"
import { FaPlus } from "react-icons/fa"
import { RouteNames,APP_NAME } from "../../constants"
import { useNavigate } from "react-router-dom"
import KorisniciService from "../../services/korisnici/KorisniciService"
import SchemaKorisnik from "../../schemas/SchemaKorisnik"
import { useState, useEffect } from "react"
import Heading from "../../components/UI/Heading"
import useLoading from "../../hooks/useLoading"

export default function KorisniciNovi() {

  const navigate = useNavigate()
  const [errors, setErrors] = useState({})
  const [poruka, setPoruka] = useState(null)
    useEffect(() => {
        document.title = "Korisnici-dodaj, " + APP_NAME
    }, [])
  async function dodaj(korisnik) {
    try {
      const rezultat = await KorisniciService.dodaj(korisnik)
      if (rezultat.success) {
        navigate(RouteNames.KORISNICI)
      } else {
        setPoruka(rezultat.message || 'Greška pri dodavanju korisnika')
      }
    } catch (error) {
      console.error("Greška pri dodavanju korisnika:", error)
      setPoruka(error.message || 'Greška pri dodavanju korisnika')
    }
  }

  function handleSubmit(e) {
    e.preventDefault()

    const podatci = new FormData(e.target)
    setErrors({})
    setPoruka(null)
    const objektPodataka = Object.fromEntries(podatci)

    const rezultat = SchemaKorisnik.safeParse(objektPodataka)
    if (!rezultat.success) {
      const noveGreske = {}

      rezultat.error.issues.forEach((issue) => {
        const kljuc = issue.path[0]
        if (!noveGreske[kljuc]) {
          noveGreske[kljuc] = issue.message
        }
      })

      setErrors(noveGreske)
      return
    }

    // VAŽNO: lozinka se MORA poslati. Servis je hashira (bcrypt.hashSync) i bez
    // nje baca "Illegal arguments: undefined, string". Prije je polje lozinke
    // uopće nedostajalo u formi, pa je Zod padao na 'lozinka' i ništa se nije
    // dogodilo (greška se nije imala gdje prikazati).
    dodaj({
      email: rezultat.data.email,
      lozinka: rezultat.data.lozinka,
      uloga: rezultat.data.uloga
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
      <Heading as='h2' color='azure'>Dodavanje novog korisnika</Heading>

      {poruka && (
        <Alert variant="danger" dismissible onClose={() => setPoruka(null)}>
          {poruka}
        </Alert>
      )}

      {/* noValidate: validaciju radi Zod, da browser ne blokira submit svojom porukom */}
      <Form onSubmit={handleSubmit} noValidate>

        <Row>
          <Col xs={6}>
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
    

      
          <Col xs={6}>
            <Form.Group controlId="lozinka" className="mb-3">
              <Form.Label className="fw-bold">Lozinka</Form.Label>
              <Form.Control
                type="password"
                name="lozinka"
                placeholder="Najmanje 8 znakova, veliko i malo slovo, broj i znak"
                isInvalid={!!errors.lozinka}
                onFocus={() => ocistiGresku('lozinka')}
                autoComplete="new-password"
              />
              <Form.Control.Feedback type="invalid">
                {errors.lozinka}
              </Form.Control.Feedback>
              <Form.Text className="text-muted">
                Lozinka mora imati najmanje 8 znakova, veliko i malo slovo, broj i interpunkcijski znak.
              </Form.Text>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col xs={6}>
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
          <Button type="submit" variant="outline-success">
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
