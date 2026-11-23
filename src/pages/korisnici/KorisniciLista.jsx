import { useEffect, useMemo, useState } from "react"
import {
    Badge,
    Button,
    Card,
    Col,
    Form,
    InputGroup,
    Pagination,
    Row,
    Table,
} from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"
import { FaEdit, FaFilePdf, FaKey, FaPlus, FaSearch, FaTrash } from "react-icons/fa"
import KorisniciService from "../../services/korisnici/KorisniciService"
import { APP_NAME, RouteNames } from "../../constants"
import useLoading from "../../hooks/useLoading"
import useModal from "../../hooks/useModal"


  

function BedzUloge({ uloga }) {
    const jeAdmin = String(uloga).toLowerCase() === "admin"
    return (
        <Badge bg={jeAdmin ? "danger" : "primary"} className="text-uppercase">
            {uloga}
        </Badge>
    )
}

function Akcije({ korisnik, onUredi, onLozinka, onObrisi, punaSirina = false }) {
    const razredGumba = punaSirina ? "flex-fill" : ""
    return (
        <div className={punaSirina ? "d-flex gap-2" : "d-flex gap-2 justify-content-center"}>
            <Button
                variant="outline-warning"
                size="sm"
                className={razredGumba}
                onClick={() => onUredi(korisnik)}
                title="Promjena korisnika"
                aria-label={`Promjena korisnika: ${korisnik.email}`}
            >
                <FaEdit aria-hidden="true" />
            </Button>
            <Button
                variant="outline-warning"
                size="sm"
                className={razredGumba}
                onClick={() => onLozinka(korisnik)}
                title="Promjena lozinke"
                aria-label={`Promjena lozinke: ${korisnik.email}`}
            >
                <FaKey aria-hidden="true" />
            </Button>
            <Button
                variant="outline-danger"
                size="sm"
                className={razredGumba}
                onClick={() => onObrisi(korisnik)}
                title="Brisanje korisnika"
                aria-label={`Brisanje korisnika: ${korisnik.email}`}
            >
                <FaTrash aria-hidden="true" />
            </Button>
        </div>
    )
}

function putanja(sablona, id) {
    return sablona.replace(":id", id)
}

export default function KorisniciLista() {
    const navigate = useNavigate()

    const [korisnici, setKorisnici] = useState([])
    const [ucitavanje, setUcitavanje] = useState(true)
    const [upit, setUpit] = useState("")
    const [pdfSeGenerira, setPdfSeGenerira] = useState(false)

    const [stranica, setStranica] = useState(1)
    const [velicinaStranice, setVelicinaStranice] = useState(10)
  const { showModal } = useModal()
    const { showLoading, hideLoading } = useLoading()
    useEffect(() => {
        document.title = "Korisnici, " + APP_NAME
    }, [])

    useEffect(() => {
        ucitajKorisnike()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

  async function ucitajKorisnike() {


        setUcitavanje(true)
    try {
          showLoading()
            const odgovor = await KorisniciService.get()
            if (!odgovor.success) {
                alert("Nije implementiran servis")
                setKorisnici([])
                return
            }
      setKorisnici(odgovor.data || [])
      hideLoading()
        } catch {
            alert("Greška pri dohvaćanju korisnika")
        } finally {
          setUcitavanje(false)
     
        }
    }

    async function brisanje(korisnik) {
        showModal(`Sigurno obrisati korisnika ${korisnik.email}?`, async () => {
            showLoading()
            try {
                const rezultat = await KorisniciService.obrisi(korisnik.id)
                if (rezultat.success) {
                    await ucitajKorisnike()
                } else {
                    alert(rezultat.message || "Greška pri brisanju")
                }
            } catch (error) {
                console.error("Greška pri brisanju korisnika:", error)
                alert("Brisanje korisnika nije uspjelo. Provjerite konzolu za detalje.")
            } finally {
                hideLoading()
            }
        })
    }

    async function preuzmiPdf(korisniciZaPdf, naslov) {
        if (pdfSeGenerira || korisniciZaPdf.length === 0) return

        setPdfSeGenerira(true)
        try {
            // jsPDF je velik, pa ga učitavamo tek kada korisnik zatraži PDF.
            const { generirajKorisniciPDF } = await import("../../components/KorisniciPdfGenerator")
            await generirajKorisniciPDF(korisniciZaPdf, { naslov })
        } catch (error) {
            console.error("Greška pri generiranju PDF-a:", error)
            alert("PDF nije moguće generirati. Pokušajte ponovno.")
        } finally {
            setPdfSeGenerira(false)
        }
    }

    const prikazani = useMemo(() => {
        const q = upit.trim().toLowerCase()
        if (!q) return korisnici
        return korisnici.filter((k) =>
            `${k.email ?? ""} ${k.uloga ?? ""}`.toLowerCase().includes(q)
        )
    }, [korisnici, upit])

    const ukupnoStavki = prikazani.length
    const ukupnoStranica = Math.ceil(ukupnoStavki / velicinaStranice) || 1

    const naStranici = useMemo(() => {
        const zadnjiIndeks = stranica * velicinaStranice
        return prikazani.slice(zadnjiIndeks - velicinaStranice, zadnjiIndeks)
    }, [prikazani, stranica, velicinaStranice])

    useEffect(() => {
        if (stranica > ukupnoStranica) {
            setStranica(1)
        }
    }, [stranica, ukupnoStranica])

    useEffect(() => {
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                window.scrollTo(0, 0)
            })
        })
    }, [stranica])

    function promijeniUpit(e) {
        setUpit(e.target.value)
        setStranica(1)
    }

    const akcije = {
        onUredi: (k) => navigate(putanja(RouteNames.KORISNIK_PROMJENA, k.id)),
        onLozinka: (k) => navigate(putanja(RouteNames.KORISNIK_PROMJENA_LOZINKE, k.id)),
        onObrisi: brisanje,
    }

    const items = []
    for (let number = 1; number <= ukupnoStranica; number++) {
        items.push(
            <Pagination.Item
                key={number}
                active={number === stranica}
                aria-current={number === stranica ? "page" : undefined}
                onClick={() => setStranica(number)}
            >
                {number}
            </Pagination.Item>
        )
    }

    return (
        <>
        <Row className="g-2 align-items-center my-3">
               <Row>
                 <Col xs={6}>
                          <Button as={Link} to={RouteNames.KORISNIK_NOVI} variant="success">
                              <FaPlus className="me-2" aria-hidden="true" />
                              Novi korisnik
                             </Button>
                             </Col>
                  <Col xs={6} >
                      {/* <div className="d-grid d-lg-flex gap-2"> */}
                          <Button
                              type="button"
                              variant="outline-danger"
                              onClick={() => preuzmiPdf(prikazani)}
                              disabled={pdfSeGenerira || prikazani.length === 0}
                              title="Preuzmi PDF popis korisnika"
                              aria-label="Preuzmi PDF popis korisnika"
                          >
                              <FaFilePdf className="me-2" aria-hidden="true" />
                              PDF
                               </Button>
                           </Col>
               </Row>
     
                    {/* </div> */}
               
                <Col xs={12} lg={6}>
                    <div className="d-flex gap-2 align-items-center mt-4">
                        <InputGroup size="sm">
                            <InputGroup.Text>
                                <FaSearch aria-hidden="true" />
                            </InputGroup.Text>
                            <Form.Control
                                type="search"
                                value={upit}
                                onChange={promijeniUpit}
                                placeholder="Pretraži korisnike…"
                                aria-label="Pretraži korisnike"
                            />
                        </InputGroup>
                        <div className="d-flex align-items-center gap-1">
                            <span
                                className="small d-none d-sm-inline"
                                style={{ whiteSpace: "nowrap", color: "orange" }}
                            >
                                Prikaz:
                            </span>
                            <Form.Select
                                size="sm"
                                value={velicinaStranice}
                                onChange={(e) => {
                                    setVelicinaStranice(parseInt(e.target.value))
                                    setStranica(1)
                                }}
                                style={{ width: "75px" }}
                                aria-label="Broj korisnika po stranici"
                            >
                                <option value="5">5</option>
                                <option value="10">10</option>
                                <option value="25">25</option>
                                <option value="50">50</option>
                            </Form.Select>
                        </div>
                    </div>
                </Col>
            </Row>

            {ucitavanje && <p className="text-muted">Učitavanje…</p>}

            {!ucitavanje && ukupnoStavki > 0 && (
                <p className="small mb-2" style={{ color: "orange" }}>
                    Prikazano {naStranici.length} od {ukupnoStavki} korisnika
                    {ukupnoStranica > 1 && ` · stranica ${stranica} / ${ukupnoStranica}`}
                </p>
            )}

            {!ucitavanje && ukupnoStavki === 0 && (
                <div className="text-center text-muted bg-white border rounded-3 py-5 px-3">
                    {korisnici.length === 0
                        ? "Nema korisnika u evidenciji."
                        : "Nema rezultata za traženi pojam."}
                </div>
            )}

            {/* Desktop / tablet: tablica na bijeloj podlozi */}
            {naStranici.length > 0 && (
                <div className="d-none d-lg-block bg-white rounded-3 shadow-sm p-2 p-lg-3 mb-4">
                    <Table
                        striped
                        bordered
                        hover
                        className="align-middle mb-0"
                        style={{ tableLayout: "fixed" }}
                    >
                        <thead className="table-light">
                            <tr>
                                <th scope="col">Email</th>
                                <th scope="col" style={{ width: "9rem" }}>
                                    Uloga
                                </th>
                                <th scope="col" className="text-center" style={{ width: "11rem" }}>
                                    Akcije
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {naStranici.map((korisnik) => (
                              <tr key={korisnik.id}>
                         
                                    <td className="text-break">
                                        {korisnik.email}
                                        <Button
                                            type="button"
                                            variant="link"
                                            className="p-0 ms-2 align-baseline text-danger"
                                            onClick={() => preuzmiPdf([korisnik], "Podaci o korisniku")}
                                            disabled={pdfSeGenerira}
                                            title={`Preuzmi PDF za ${korisnik.email}`}
                                            aria-label={`Preuzmi PDF za ${korisnik.email}`}
                                        >
                                            <FaFilePdf aria-hidden="true" />
                                        </Button>
                                    </td>
                                    <td>
                                        <BedzUloge uloga={korisnik.uloga} />
                                    </td>
                                    <td>
                                        <Akcije korisnik={korisnik} {...akcije} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            )}

            {/* Mobitel: svaki korisnik je svoja kartica */}
            {naStranici.length > 0 && (
                <div className="d-lg-none">
                    {naStranici.map((korisnik) => (
                        <Card key={korisnik.id} className="mb-3 border-0 shadow-sm">
                            <Card.Body>
                                <div className="fw-bold text-break">
                                    {korisnik.email}
                                    <Button
                                        type="button"
                                        variant="link"
                                        className="p-0 ms-2 align-baseline text-danger"
                                        onClick={() => preuzmiPdf([korisnik], "Podaci o korisniku")}
                                        disabled={pdfSeGenerira}
                                        title={`Preuzmi PDF za ${korisnik.email}`}
                                        aria-label={`Preuzmi PDF za ${korisnik.email}`}
                                    >
                                        <FaFilePdf aria-hidden="true" />
                                    </Button>
                                </div>
                                <div className="my-2">
                                    <BedzUloge uloga={korisnik.uloga} />
                                </div>
                                <div style={{ maxWidth: "22rem" }}>
                                    <Akcije korisnik={korisnik} {...akcije} punaSirina />
                                </div>
                            </Card.Body>
                        </Card>
                    ))}
                </div>
            )}

            {ukupnoStranica > 1 && (
                <div className="d-flex justify-content-center mt-4">
                    <div className="d-flex d-sm-none align-items-center gap-2">
                        <Button
                            variant="secondary"
                            size="sm"
                            aria-label="Prva stranica"
                            onClick={() => setStranica(1)}
                            disabled={stranica === 1}
                        >
                            &laquo;&laquo;
                        </Button>
                        <Button
                            variant="secondary"
                            size="sm"
                            aria-label="Prethodna stranica"
                            onClick={() => setStranica((prev) => Math.max(prev - 1, 1))}
                            disabled={stranica === 1}
                        >
                            &lsaquo;
                        </Button>

                        <span className="text-muted small px-2" style={{ whiteSpace: "nowrap" }}>
                            <strong>{stranica}</strong> / {ukupnoStranica}
                        </span>

                        <Button
                            variant="secondary"
                            size="sm"
                            aria-label="Sljedeća stranica"
                            onClick={() =>
                                setStranica((prev) => Math.min(prev + 1, ukupnoStranica))
                            }
                            disabled={stranica === ukupnoStranica}
                        >
                            &rsaquo;
                        </Button>
                        <Button
                            variant="secondary"
                            size="sm"
                            aria-label="Posljednja stranica"
                            onClick={() => setStranica(ukupnoStranica)}
                            disabled={stranica === ukupnoStranica}
                        >
                            &raquo;&raquo;
                        </Button>
                    </div>

                    <div className="d-none d-sm-block">
                        <Pagination style={{ padding: "1rem" }}>
                            <Pagination.First aria-label="Prva stranica"
                                onClick={() => setStranica(1)}
                                disabled={stranica === 1}
                            />
                            <Pagination.Prev aria-label="Prethodna stranica"
                                onClick={() => setStranica((prev) => Math.max(prev - 1, 1))}
                                disabled={stranica === 1}
                            />

                            {items}

                            <Pagination.Next aria-label="Sljedeća stranica"
                                onClick={() =>
                                    setStranica((prev) => Math.min(prev + 1, ukupnoStranica))
                                }
                                disabled={stranica === ukupnoStranica}
                            />
                            <Pagination.Last aria-label="Posljednja stranica"
                                onClick={() => setStranica(ukupnoStranica)}
                                disabled={stranica === ukupnoStranica}
                            />
                        </Pagination>
                    </div>
                </div>
            )}
        </>
    )
}
