import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Alert, Button, Col, Form, Row } from "react-bootstrap"
import { z } from "zod"
import KorisniciService from "../../services/korisnici/KorisniciService"
import { RouteNames } from "../../constants"
import Heading from "../../components/UI/Heading"
import useModal from "../../hooks/useModal"
import useNespremljenePromjene from "../../hooks/useNespremljenePromjene"
import useLoading from "../../hooks/useLoading"

const ShemaPromjenaKorisnika = z.object({
  email: z
    .email({
      error: (issue) =>
        !issue.input || (typeof issue.input === "string" && issue.input.trim() === "")
          ? "Email je obavezan!"
          : "Unesite ispravan email format!"
    })
    .trim(),
  uloga: z.enum(["admin", "korisnik"], {
    error: "Uloga mora biti 'admin' ili 'korisnik'!"
  })
})

export default function KorisniciPromijena() {
  const navigate = useNavigate()
  const params = useParams()

  const [korisnik, setKorisnik] = useState({})
  const [email, setEmail] = useState("")
  const [uloga, setUloga] = useState("")
  const [errors, setErrors] = useState({})
  const [greska, setGreska] = useState("")
  const [ucitavanje, setUcitavanje] = useState(true)

  const { potvrdi } = useModal()
  const [imaPromjena, setImaPromjena] = useState(false)
  useNespremljenePromjene(imaPromjena)
  const { showLoading, hideLoading, postaviNaslov } = useLoading()
  useEffect(() => {
    ucitajKorisnika()
postaviNaslov('Korisnici-promijena')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id])

  async function ucitajKorisnika() {
    setUcitavanje(true)

    try {
      const odgovor = await KorisniciService.getById(params.id)

      if (!odgovor.success) {
        alert("Korisnik nije pronađen")
        navigate(RouteNames.KORISNICI)
        return
      }

      const podaci = odgovor.data || {}
      setKorisnik(podaci)
      setEmail(podaci.email || "")
      setUloga(podaci.uloga || "")
      setImaPromjena(false)
    } catch (error) {
      console.error("Greška pri dohvaćanju korisnika:", error)
      alert("Greška pri dohvaćanju korisnika")
      navigate(RouteNames.KORISNICI)
    } finally {
      setUcitavanje(false)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setGreska("")

    const rezultat = ShemaPromjenaKorisnika.safeParse({ email, uloga })

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

    setErrors({})

    if (!(await potvrdi("Sigurno spremiti promjene?"))) return

    try {
      const odgovor = await KorisniciService.promijeni(params.id, rezultat.data)

      if (!odgovor.success) {
        setGreska(odgovor.message || "Greška pri promjeni korisnika")
        return
      }

      navigate(RouteNames.KORISNICI)
    } catch (error) {
      console.error("Greška pri promjeni korisnika:", error)
      setGreska("Greška pri promjeni korisnika")
    }
  }

  const ocistiGresku = (nazivPolja) => {
    if (errors[nazivPolja]) {
      const noveGreske = { ...errors }
      delete noveGreske[nazivPolja]
      setErrors(noveGreske)
    }
  }

  if (ucitavanje) {
    return (
      <>
        <Heading as="h2" color="azure" className="mb-4">
          Promjena korisnika
        </Heading>
        <p className="text-muted">Učitavanje…</p>
      </>
    )
  }

  return (
    <>
      <Heading as="h2" color="azure" className="mb-4">
        Promjena korisnika{korisnik.email ? `: ${korisnik.email}` : ""}
      </Heading>

      {greska && <Alert variant="danger">{greska}</Alert>}

      <Form onSubmit={handleSubmit} noValidate>
        <Row className="g-3">
          <Col xs={12} md={6}>
            <Form.Group controlId="email">
              <Form.Label className="fw-bold">Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={email}
                placeholder="operater@edunova.hr"
                isInvalid={!!errors.email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  ocistiGresku("email")
                  setImaPromjena(true)
                }}
              />
              <Form.Control.Feedback type="invalid">
                {errors.email}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          <Col xs={12} md={6}>
            <Form.Group controlId="uloga">
              <Form.Label className="fw-bold">Uloga</Form.Label>
              <Form.Select
                name="uloga"
                value={uloga}
                isInvalid={!!errors.uloga}
                onChange={(e) => {
                  setUloga(e.target.value)
                  ocistiGresku("uloga")
                  setImaPromjena(true)
                }}
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

        <hr className="my-4" />

        <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-4 forma-akcije">
          <Button type="submit" variant="outline-warning">
            Promijeni
          </Button>
          <Button
            type="button"
            variant="outline-danger"
            onClick={async () => {
              if (imaPromjena && !(await potvrdi("Odbaciti nespremljene promjene?"))) return
              navigate(RouteNames.KORISNICI)
            }}
          >
            Odustani
          </Button>
        </div>
      </Form>
    </>
  )
}
