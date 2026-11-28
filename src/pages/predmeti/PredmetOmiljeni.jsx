import { useEffect, useState } from "react";
import PredmetiServices from "../../services/predmeti/PredmetiServices";
import KategorijeServices from "../../services/kategorije/KategorijeServices";
import {
  Row,
  Col,
  Card,
  Button,
  Form,
  Carousel,
  InputGroup,
  Modal,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowTurnUp, FaHeart } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import Heading from "../../components/UI/Heading";
import { motion } from "framer-motion";
import Odbrojavanje from "../../components/Odbrojavanje";
import useLoading from "../../hooks/useLoading";
import useAuth from "../../hooks/useAuth";
import { RouteNames } from "../../constants";
import { dohvatiOmiljene, spremiOmiljene } from "../../utils/omiljeni";

function ExpandableText({ text, maxLength = 100 }) {
  const [isExpanded, setIsExpanded] = useState(false);
  if (!text) return null;
  if (text.length <= maxLength) return <span>{text}</span>;
  const displayedText = isExpanded ? text : `${text.substring(0, maxLength)}`;
  return (
    <span>
      {displayedText}
      <span
        onClick={() => setIsExpanded(!isExpanded)}
        style={{ color: "green", cursor: "pointer", marginLeft: ".2rem", fontWeight: "bold" }}>
        {isExpanded ? <FaArrowTurnUp /> : "..."}
      </span>
    </span>
  );
}

function formatirajDatum(datumVrijednost) {
  if (!datumVrijednost) return "-";
  const datum = new Date(datumVrijednost);
  return isNaN(datum.getTime())
    ? "-"
    : datum.toLocaleString("hr-HR", { dateStyle: "short", timeStyle: "short" });
}

function jeAukcijaZavrsena(datumZavrsetka) {
  if (!datumZavrsetka) return false;
  return new Date(datumZavrsetka).getTime() <= new Date().getTime();
}

function dohvatiIzvorSlike(slikaItem) {
  if (!slikaItem) return "";
  const slika =
    typeof slikaItem === "object"
      ? slikaItem.url || slikaItem.putanja || slikaItem.slika
      : slikaItem;
  if (typeof slika !== "string") return "";
  if (slika.startsWith("data:") || slika.startsWith("http")) return slika;
  return `data:image/jpeg;base64,${slika}`;
}

export default function PredmetOmiljeni() {
  const { isLoggedIn, authUser, spremno } = useAuth();
  const navigate = useNavigate();

  const [omiljeniPredmeti, setOmiljeniPredmeti] = useState([]);
  const [kategorije, setKategorije] = useState([]);
  const [uvjetiPretrazivanja, setUvjetiPretrazivanja] = useState("");
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [odabraniPredmet, setOdabraniPredmet] = useState(null);
  const [iznosPonude, setIznosPonude] = useState(0);

  const { showLoading, hideLoading } = useLoading();

  useEffect(() => {
    if (!spremno) return;

    let otkazano = false;

    async function ucitajOmiljene() {
      setLoading(true);
      showLoading();

      try {
        // Omiljeni se čitaju iz ključa vezanog uz prijavljenog korisnika.
        const spremljeniOmiljeni = dohvatiOmiljene(authUser);

        const [katOdgovor, predmetiOdgovor] = await Promise.all([
          KategorijeServices.get(),
          PredmetiServices.dohvatiStranicu(1, 1000),
        ]);

        if (otkazano) return;

        setKategorije(katOdgovor.data || katOdgovor || []);

        const sviPredmeti = predmetiOdgovor.data || predmetiOdgovor || [];
        const samoOmiljeni = sviPredmeti.filter((p) =>
          spremljeniOmiljeni.includes(String(p.id || p.sifra)),
        );

        setOmiljeniPredmeti(samoOmiljeni);
      } catch (error) {
        console.error("Greška pri učitavanju omiljenih:", error);
        if (!otkazano) setOmiljeniPredmeti([]);
      } finally {
        hideLoading();
        if (!otkazano) setLoading(false);
      }
    }

    ucitajOmiljene();

    return () => {
      otkazano = true;
    };
  }, [spremno, authUser?.id]);

  function ukloniIzOmiljenih(idZaUklanjanje) {
    const id = String(idZaUklanjanje);
    const noviOmiljeniIds = dohvatiOmiljene(authUser).filter((x) => x !== id);

    spremiOmiljene(authUser, noviOmiljeniIds);
    setOmiljeniPredmeti((prev) =>
      prev.filter((p) => String(p.id || p.sifra) !== id),
    );
  }

  function otvoriModalZaPonudu(predmet) {
    if (jeAukcijaZavrsena(predmet.zavrsava)) return;

    if (!isLoggedIn) {
      navigate(RouteNames.LOGIRANJE);
      return;
    }

    setOdabraniPredmet(predmet);
    const imaPonuda =
      Array.isArray(predmet.ponude) && predmet.ponude.length > 0;
    const trenutnaCijena = imaPonuda
      ? Number(predmet.ponude[predmet.ponude.length - 1].cijena)
      : Number(predmet.pocetnaCijena);
    setIznosPonude(trenutnaCijena + 1);
    setShowModal(true);
  }

  async function potvrdiPonudu() {
    if (!odabraniPredmet) return;

    const imaPonuda =
      Array.isArray(odabraniPredmet.ponude) && odabraniPredmet.ponude.length > 0;
    const trenutnaCijena = imaPonuda
      ? Number(odabraniPredmet.ponude[odabraniPredmet.ponude.length - 1].cijena)
      : Number(odabraniPredmet.pocetnaCijena);
    const minimalnaDozvoljenaCijena = trenutnaCijena + 1;

    if (Number(iznosPonude) < minimalnaDozvoljenaCijena) {
      alert(`Iznos ponude mora biti minimalno ${minimalnaDozvoljenaCijena} €.`);
      return;
    }

    const azuriraniPredmet = {
      ...odabraniPredmet,
      ponude: [
        ...(odabraniPredmet.ponude || []),
        {
          korisnik: authUser?.id ?? authUser?.email ?? null,
          datum: new Date().toISOString(),
          cijena: Number(iznosPonude),
        },
      ],
    };

    try {
      await PredmetiServices.promijeni(
        odabraniPredmet.id || odabraniPredmet.sifra,
        azuriraniPredmet,
      );

      const ciljId = String(odabraniPredmet.id || odabraniPredmet.sifra);
      setOmiljeniPredmeti((prev) =>
        prev.map((p) =>
          String(p.id || p.sifra) === ciljId ? azuriraniPredmet : p,
        ),
      );

      setShowModal(false);
      setOdabraniPredmet(null);
    } catch (error) {
      console.error("Greška:", error);
      alert("Slanje ponude nije uspjelo.");
    }
  }

  function prikaziNazivKategorije(kategorijaVal) {
    if (!kategorijaVal) return "Nepoznato";
    if (typeof kategorijaVal === "object" && kategorijaVal.naziv) {
      return kategorijaVal.naziv;
    }
    const kat = kategorije.find((s) => String(s.id) === String(kategorijaVal));
    return kat ? kat.naziv : "Nepoznato";
  }

  const filtriraniOmiljeni = omiljeniPredmeti.filter((c) =>
    uvjetiPretrazivanja
      ? c.naziv &&
        c.naziv.toLowerCase().includes(uvjetiPretrazivanja.toLowerCase())
      : true,
  );

  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: -1000 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}>
        <Heading as="h2" color="azure" className="mb-2 mt-0">
          Omiljeni Predmeti ({filtriraniOmiljeni.length})
        </Heading>
        <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
          <Link to={RouteNames.PREDMETI} className="m-3">
            <Button variant="secondary" size="sm">
              Natrag na sve predmete
            </Button>
          </Link>
          <InputGroup className="mb-3" style={{ maxWidth: "300px" }}>
            <InputGroup.Text>
              <FaSearch aria-hidden="true" />
            </InputGroup.Text>
            <Form.Control
              type="text"
              aria-label="Pretraži omiljene predmete"
              placeholder="Pretraži omiljene..."
              value={uvjetiPretrazivanja}
              onChange={(e) => setUvjetiPretrazivanja(e.target.value)}
            />
          </InputGroup>
        </div>
      </motion.div>

      <Row xs={1} sm={1} md={2} lg={3} className="g-3">
        {loading ? (
          <Col xs={12}>
            <p className="text-muted text-center py-4">Učitavanje...</p>
          </Col>
        ) : filtriraniOmiljeni.length > 0 ? (
          filtriraniOmiljeni.map((c) => {
            const pId = c.id || c.sifra;
            const jeZavrseno = jeAukcijaZavrsena(c.zavrsava);
            const imaPonuda = Array.isArray(c.ponude) && c.ponude.length > 0;
            const zadnjaPonuda = imaPonuda
              ? c.ponude[c.ponude.length - 1].cijena
              : null;

            let siroveSlike =
              c.slike || c.slikaUrls || (c.slika ? [c.slika] : []);
            if (!Array.isArray(siroveSlike)) {
              siroveSlike =
                typeof siroveSlike === "string" ? [siroveSlike] : [];
            }

            return (
              <Col key={pId}>
                <Card
                  className="h-100 shadow-sm border-0 overflow-hidden position-relative"
                  style={{ opacity: jeZavrseno ? 0.75 : 1 }}>
                  <button
                    type="button"
                    className="btn rounded-circle d-flex align-items-center justify-content-center p-0 shadow-sm border-0"
                    style={{
                      position: "absolute",
                      top: ".5rem",
                      right: ".5rem",
                      zIndex: 10,
                      width: "2.25rem",
                      height: "2.25rem",
                      backgroundColor: "rgba(255, 255, 255, 0.9)",
                    }}
                    onClick={() => ukloniIzOmiljenih(pId)}
                    aria-label={`Ukloni ${c.naziv} iz omiljenih`}
                    title="Ukloni iz omiljenih">
                    <FaHeart color="#dc3545" aria-hidden="true" />
                  </button>

                  {siroveSlike.length > 0 && (
                    <Carousel data-bs-theme="dark" interval={null} className="bg-light">
                      {siroveSlike.map((slikaItem, idx) => (
                        <Carousel.Item key={idx}>
                          <img
                            className="d-block w-100"
                            src={dohvatiIzvorSlike(slikaItem)}
                            alt=""
                            style={{ height: "180px", objectFit: "cover" }}
                          />
                        </Carousel.Item>
                      ))}
                    </Carousel>
                  )}

                  <Card.Body className="d-flex flex-column">
                    <Card.Title style={{ color: "#1a3580" }}>
                      {c.naziv}
                    </Card.Title>
                    <Card.Text
                      className="text-secondary flex-grow-1 mb-4"
                      style={{ fontSize: ".9rem" }}>
                      <ExpandableText text={c.opis} maxLength={60} />
                    </Card.Text>

                    <div className="small text-muted">
                      Kategorija: {prikaziNazivKategorije(c.kategorija)}
                    </div>

                    {imaPonuda && (
                      <div className="small text-muted">
                        Zadnja ponuda: {zadnjaPonuda} €
                      </div>
                    )}

                    <div className="border-top pt-2 mt-1 mb-3">
                      <small className="text-muted d-block">
                        <strong>Završava:</strong> {formatirajDatum(c.zavrsava)}
                      </small>
                      <Odbrojavanje zavrsava={c.zavrsava} />
                    </div>

                    <Button
                      variant={jeZavrseno ? "secondary" : "primary"}
                      size="sm"
                      className="w-100 mb-2"
                      disabled={jeZavrseno}
                      onClick={() => otvoriModalZaPonudu(c)}>
                      {jeZavrseno ? "Aukcija je završila" : "Tvoja ponuda"}
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            );
          })
        ) : (
          <Col xs={12}>
            <p className="text-muted text-center py-4">
              Nemate spremljenih omiljenih predmeta.
            </p>
          </Col>
        )}
      </Row>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Unos ponude</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {odabraniPredmet && (
            <Form>
              <Form.Group>
                <Form.Label>Ponuda za: {odabraniPredmet.naziv}</Form.Label>
                <Form.Control
                  type="number"
                  aria-label="Iznos ponude"
                  value={iznosPonude}
                  onChange={(e) => setIznosPonude(e.target.value)}
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Odustani
          </Button>
          <Button variant="primary" onClick={potvrdiPonudu}>
            Potvrdi ponudu
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
