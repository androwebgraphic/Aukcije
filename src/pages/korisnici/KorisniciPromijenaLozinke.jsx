import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import KorisniciService from "../../services/korisnici/KorisniciService"
import { Form, Button, Row, Col, Alert } from "react-bootstrap"
import { RouteNames } from "../../constants"
import { ShemaPromjenaLozinke } from "../../schemas/SchemaKorisnik"
import Heading from "../../components/UI/Heading"

export default function KorisniciPromijeniLozinka() {
  const navigate = useNavigate()
  const params = useParams()
  const [korisnik, setKorisnik] = useState({})
  const [errors, setErrors] = useState({})
  const [greska, setGreska] = useState("")

  useEffect(() => {
    ucitajKorisnika()
  }, [])

  async function ucitajKorisnika() {
    const odgovor = await KorisniciService.getById(params.id)

    if (!odgovor.success) {
      alert("Korisnik nije pronađen")
      navigate(RouteNames.KORISNICI)
      return
    }

    setKorisnik(odgovor.data || {})
  }

  async function promijeniLozinku(novaLozinka) {
    const rezultat = await KorisniciService.promijeniLozinku(params.id, novaLozinka)

    if (rezultat.success) {
      alert("Lozinka uspješno promijenjena")
      navigate(RouteNames.KORISNICI)
    } else {
      setGreska(rezultat.message || "Greška pri promjeni lozinke")
    }
  }

  function handleSubmit(e) {
    e.preventDefault()

    const podatci = new FormData(e.target)

    setErrors({})
    setGreska("")

    const objektPodataka = Object.fromEntries(podatci)
    const rezultat = ShemaPromjenaLozinke.safeParse(objektPodataka)

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

    promijeniLozinku(podatci.get("novaLozinka"))
  }

  const ocistiGreske = (nazivPolja) => {
    if (errors[nazivPolja]) {
      const noveGreske = { ...errors }
      delete noveGreske[nazivPolja]
      setErrors(noveGreske)
    }
  }

  return (
    <>
      <Heading as="h2" color="azure" className="mb-4">
        Promjena lozinke{korisnik.email ? `: ${korisnik.email}` : ""}
      </Heading>

      {greska && <Alert variant="danger">{greska}</Alert>}

      <Form onSubmit={handleSubmit} noValidate>
        <Row className="g-3">
          <Col xs={12} md={6}>
            <Form.Group controlId="novaLozinka">
              <Form.Label className="fw-bold">Nova lozinka</Form.Label>
              <Form.Control
                type="password"
                name="novaLozinka"
                placeholder="Unesite novu lozinku"
                isInvalid={!!errors.novaLozinka}
                onFocus={() => ocistiGreske("novaLozinka")}
              />
              <Form.Control.Feedback type="invalid">
                {errors.novaLozinka}
              </Form.Control.Feedback>
              <Form.Text className="text-muted">
                Lozinka mora sadržavati: najmanje 8 znakova, veliko slovo, malo slovo, broj i
                interpunkcijski znak (!@#$%^&*...)
              </Form.Text>
            </Form.Group>
          </Col>

          <Col xs={12} md={6}>
            <Form.Group controlId="potvrdaLozinke">
              <Form.Label className="fw-bold">Potvrda lozinke</Form.Label>
              <Form.Control
                type="password"
                name="potvrdaLozinke"
                placeholder="Ponovite novu lozinku"
                isInvalid={!!errors.potvrdaLozinke}
                onFocus={() => ocistiGreske("potvrdaLozinke")}
              />
              <Form.Control.Feedback type="invalid">
                {errors.potvrdaLozinke}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <hr className="my-4" />

        <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-4 forma-akcije">
          <Button type="submit" variant="outline-warning">
            Promijeni lozinku
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
