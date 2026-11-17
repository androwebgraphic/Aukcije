import { useEffect, useRef, useState } from "react";
import PredmetiServices from "../../services/predmeti/PredmetiServices";
import KategorijeServices from "../../services/kategorije/KategorijeServices";
import OznakeServices from "../../services/oznake/OznakeServices";
import {
  Row,
  Col,
  Card,
  Button,
  Badge,
  Form,
  Carousel,
  Pagination,
  InputGroup,
  Modal
} from "react-bootstrap";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { RouteNames } from "../../constants";
import { FaEdit, FaPlus, FaSearch, FaTrash } from "react-icons/fa";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";

import Heading from "../../components/UI/Heading";
import { motion } from "framer-motion";
import IkonaKategorije from "../../components/UI/IkonaKategorije";
import useAuth from "../../hooks/useAuth";

import Odbrojavanje from "../../components/Odbrojavanje";

function formatirajDatum(datumVrijednost) {
  if (!datumVrijednost) return "-";
  const datum = new Date(datumVrijednost);
  if (isNaN(datum.getTime())) return "-";

  return datum.toLocaleString("hr-HR", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

function jeAukcijaZavrsena(datumZavrsetka, trenutak = Date.now()) {
  if (!datumZavrsetka) return false;
  const kraj = new Date(datumZavrsetka).getTime();
  return Number.isFinite(kraj) && kraj <= trenutak;
}

function OpisPredmeta({ tekst }) {
  const [prosireno, setProsireno] = useState(false);
  const [prelazi, setPrelazi] = useState(false);
  const tekstRef = useRef(null);
  const sadrzaj = (tekst || "").trim() || "Bez opisa.";

  // Provjeri stvarno prelijevanje teksta (ne broj znakova), pa se "…"
  // prikazuje bez obzira na to koliko riječi opis ima ili koliko je kartica široka.
  useEffect(() => {
    const element = tekstRef.current;
    if (!element || prosireno) return;

    const provjeri = () => {
      setPrelazi(element.scrollHeight > element.clientHeight + 1);
    };

    provjeri();

    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", provjeri);
      return () => window.removeEventListener("resize", provjeri);
    }

    const observer = new ResizeObserver(provjeri);
    observer.observe(element);
    return () => observer.disconnect();
  }, [sadrzaj, prosireno]);

  const stilSkraceno = {
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  };

  const mozeSeSiriti = prelazi || prosireno;

  return (
    <div className="position-relative">
      <Card.Text
        className="text-secondary small mb-1"
        title={sadrzaj}
        style={{
          minHeight: "3em",
          paddingRight: mozeSeSiriti ? "1.8rem" : undefined,
        }}>
        <span
          ref={tekstRef}
          role={prelazi && !prosireno ? "button" : undefined}
          tabIndex={prelazi && !prosireno ? 0 : undefined}
          onClick={() => {
            // Ako je korisnik označio tekst (npr. da ga kopira), ne širi opis.
            const oznaceno = window.getSelection();
            if (oznaceno && oznaceno.toString() !== "") return;
            if (prelazi && !prosireno) setProsireno(true);
          }}
          onKeyDown={(e) => {
            if (prelazi && !prosireno && (e.key === "Enter" || e.key === " ")) {
              e.preventDefault();
              setProsireno(true);
            }
          }}
          style={prosireno ? { cursor: "default" } : { ...stilSkraceno, cursor: prelazi ? "pointer" : "default" }}>
          {sadrzaj}
        </span>
      </Card.Text>
      {mozeSeSiriti && (
        <Button
          type="button"
          variant="light"
          size="sm"
          className="position-absolute bottom-0 end-0 border rounded-circle d-inline-flex align-items-center justify-content-center p-0"
          style={{ width: "1.5rem", height: "1.5rem" }}
          onClick={() => setProsireno((v) => !v)}
          aria-expanded={prosireno}
          title={prosireno ? "Prikaži manje" : "Prikaži cijeli opis"}
          aria-label={prosireno ? "Prikaži manje" : "Prikaži cijeli opis"}>
          {prosireno ? (
            <BsChevronUp size={13} aria-hidden="true" />
          ) : (
            <BsChevronDown size={13} aria-hidden="true" />
          )}
        </Button>
      )}
    </div>
  );
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

export default function PredmetiList() {
  const { isLoggedIn, authUser } = useAuth();
  const [predmeti, setPredmeti] = useState([]);
  const [kategorije, setKategorije] = useState([]);
  const [oznake, setOznake] = useState([]);
  const [uvjetiPretrazivanja, setUvjetiPretrazivanja] = useState("");
  const [sortiranje, setSortiranje] = useState("naziv-asc");
  const [sada, setSada] = useState(() => Date.now());
  const [predmetiNaStranici, setPredmetiNaStranici] = useState([]);

  // Stanje za modal i ponudu
  const [showModal, setShowModal] = useState(false);
  const [odabraniPredmet, setOdabraniPredmet] = useState(null);
  const [iznosPonude, setIznosPonude] = useState(0);

  const [stranica, setStranica] = useState(1);
  const [velicinaStranice, setVelicinaStranice] = useState(6);

  const navigate = useNavigate();
  const params = useParams();
  const [searchParams] = useSearchParams();
  const kategorijaFilter = searchParams.get("kategorija");

//omiljeni predmeti
  const [omiljeniIds, setOmiljeniIds] = useState(() => {
  return JSON.parse(localStorage.getItem("omiljeniPredmeti")) || [];
});
  useEffect(() => {
    setStranica(1);
  }, [params.id, kategorijaFilter]);

  useEffect(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        window.scrollTo(0, 0);
      });
    });
  }, [stranica]);

  // Dok je stranica otvorena, povremeno provjeri je li koja aukcija završila.
  useEffect(() => {
    const interval = setInterval(() => setSada(Date.now()), 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    async function ucitajSve() {
      try {
        await Promise.all([ucitajKategorije(), ucitajOznake()]);
        await ucitajPredmete();
      } catch (error) {
        console.error("Greška pri inicijalnom učitavanju:", error);
      }
    }
    ucitajSve();
  }, []);

  async function ucitajPredmete() {
    try {
      const odgovor = await PredmetiServices.dohvatiStranicu(1, 1000);
      setPredmeti(odgovor.data || odgovor || []);
    } catch (error) {
      console.error("Greška pri dohvaćanju predmeta:", error);
    }
  }

  async function ucitajKategorije() {
    try {
      const odgovor = await KategorijeServices.get();
      setKategorije(odgovor.data || odgovor);
    } catch (error) {
      console.error("Greška pri dohvaćanju kategorija:", error);
    }
  }

  async function ucitajOznake() {
    try {
      const odgovor = await OznakeServices.get();
      setOznake(odgovor.data || odgovor);
    } catch (error) {
      console.error("Greška pri dohvaćanju oznaka:", error);
    }
  }

  async function obrisi(predmetItem) {
    const identifikator = predmetItem.id || predmetItem.sifra || predmetItem.predmetId;

    if (!identifikator) {
      alert("Greška: Predmet nema definiran ID ni šifru!");
      return;
    }

    if (!confirm(`Želite li obrisati predmet "${predmetItem.naziv || ''}"?`)) {
      return;
    }

    try {
      await PredmetiServices.obrisi(identifikator);
      ucitajPredmete();
    } catch (error) {
      console.error("Greška prilikom brisanja:", error);
      alert("Brisanje predmeta nije uspjelo. Provjerite konzolu za detalje.");
    }
  }

  function otvoriModalZaPonudu(predmet) {
    if (!isLoggedIn) {
      // Ponudu smije dati samo prijavljeni korisnik.
      navigate(RouteNames.LOGIRANJE);
      return;
    }

    if (jeAukcijaZavrsena(predmet.zavrsava)) return;

    setOdabraniPredmet(predmet);
    
    // Utvrđujemo trenutnu važeću cijenu (zadnja ponuda ako postoji, inače početna cijena)
    const imaPonuda = Array.isArray(predmet.ponude) && predmet.ponude.length > 0;
    const trenutnaCijena = imaPonuda
      ? Number(predmet.ponude[predmet.ponude.length - 1].cijena)
      : Number(predmet.pocetnaCijena);

    setIznosPonude(trenutnaCijena + 1);
    setShowModal(true);
  }

  async function potvrdiPonudu() {
    if (!odabraniPredmet) return;

    if (!isLoggedIn) {
      setShowModal(false);
      setOdabraniPredmet(null);
      navigate(RouteNames.LOGIRANJE);
      return;
    }

    const imaPonuda = Array.isArray(odabraniPredmet.ponude) && odabraniPredmet.ponude.length > 0;
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
          korisnik: authUser?.email ?? null,
          datum: new Date().toISOString(),
          cijena: Number(iznosPonude),
        },
      ],
    };

    try {
      // 1. Slanje promjene na server
      await PredmetiServices.promijeni(odabraniPredmet.id || odabraniPredmet.sifra, azuriraniPredmet);

      // 2. Trenutno ažuriranje lokalnog stanja da se promjena vidi ODMAH bez refresha
      setPredmeti((prevPredmeti) =>
        prevPredmeti.map((p) => {
          if (!p) return p;
          const pId = p.id || p.sifra;
          const targetId = odabraniPredmet.id || odabraniPredmet.sifra;
          return pId === targetId ? azuriraniPredmet : p;
        })
      );

      setShowModal(false);
      setOdabraniPredmet(null);
    } catch (error) {
      console.error("Greška prilikom slanja ponude:", error);
      alert("Slanje ponude nije uspjelo.");
    }
  }

  function prikaziNazivKategorije(kategorijaVal) {
    if (!kategorijaVal) return "Nepoznato";
    if (typeof kategorijaVal === "object" && kategorijaVal.naziv) {
      return kategorijaVal.naziv;
    }
    const kategorija = kategorije.find((s) => s.id === parseInt(kategorijaVal));
    return kategorija ? kategorija.naziv : "Nepoznato";
  }

  function dohvatiIdKategorije(kategorijaVal) {
    if (kategorijaVal === null || kategorijaVal === undefined) return null;
    if (typeof kategorijaVal === "object") {
      return Number(
        kategorijaVal.id ??
        kategorijaVal.sifra ??
        kategorijaVal.kategorijaId ??
        kategorijaVal.kategorija_id ??
        null,
      );
    }
    const parsed = Number(kategorijaVal);
    return isNaN(parsed) ? null : parsed;
  }

  function prikaziNazivOznake(oznakaItem) {
    if (!oznakaItem) return "Nepoznato";
    if (typeof oznakaItem === "object") {
      return oznakaItem.naziv || oznakaItem.name || JSON.stringify(oznakaItem);
    }
    const o = oznake.find(
      (item) =>
        String(item.id) === String(oznakaItem) ||
        String(item.sifra) === String(oznakaItem),
    );
    return o ? o.naziv : `Oznaka ID: ${oznakaItem}`;
  }

  const aktivnaKategorijaNaziv = params.id
    ? prikaziNazivKategorije(parseInt(params.id))
    : kategorijaFilter;

  const filtriraniPredmeti = predmeti
    .filter((c) => {
      if (!c) return false; // Sigurnosna zaštita protiv undefined objekata

      let zadovoljavaKategoriju = true;
      if (params.id) {
        const katIdIzUrl = parseInt(params.id);
        const predmetKatId = dohvatiIdKategorije(c.kategorija);
        zadovoljavaKategoriju = predmetKatId === katIdIzUrl;
      } else if (kategorijaFilter) {
        const nazivKat = prikaziNazivKategorije(c.kategorija);
        zadovoljavaKategoriju =
          nazivKat.toLowerCase() === kategorijaFilter.toLowerCase();
      }

      const zadovoljavaPretragu = uvjetiPretrazivanja
        ? c.naziv && c.naziv.toLowerCase().includes(uvjetiPretrazivanja.toLowerCase())
        : true;

      return zadovoljavaKategoriju && zadovoljavaPretragu;
    })
    .sort((a, b) => {
      if (sortiranje === "naziv-asc") {
        return (a.naziv || "").localeCompare(b.naziv || "", "hr");
      }
      if (sortiranje === "naziv-desc") {
        return (b.naziv || "").localeCompare(a.naziv || "", "hr");
      }
      if (sortiranje === "datum-postavljanja-asc") {
        return new Date(a.dodano || 0) - new Date(b.dodano || 0);
      }
      if (sortiranje === "datum-postavljanja-desc") {
        return new Date(b.dodano || 0) - new Date(a.dodano || 0);
      }
      if (sortiranje === "datum-zavrsetka-asc") {
        return (
          new Date(a.zavrsava || a.dodano || 0) -
          new Date(b.zavrsava || b.dodano || 0)
        );
      }
      if (sortiranje === "datum-zavrsetka-desc") {
        return (
          new Date(b.zavrsava || b.dodano || 0) -
          new Date(a.zavrsava || a.dodano || 0)
        );
      }
      return 0;
    });

  const ukupnoStavki = filtriraniPredmeti.length;
  const ukupnoStranica = Math.ceil(ukupnoStavki / velicinaStranice) || 1;

  useEffect(() => {
    if (stranica > ukupnoStranica) {
      setStranica(1);
    }
    const zadnjiIndeks = stranica * velicinaStranice;
    const prviIndeks = zadnjiIndeks - velicinaStranice;
    setPredmetiNaStranici(filtriraniPredmeti.slice(prviIndeks, zadnjiIndeks));
  }, [ukupnoStranica, stranica, predmeti, uvjetiPretrazivanja, sortiranje, kategorijaFilter, params.id]);

  function dohvatiIkonaKategorije(kategorijaVal) {
    const katId = dohvatiIdKategorije(kategorijaVal);
    const kat = kategorije.find((k) => k.id === katId);
    return kat ? kat.ikona : "";
  }

  let items = [];
  for (let number = 1; number <= ukupnoStranica; number++) {
    items.push(
      <Pagination.Item
        key={number}
        active={number === stranica}
        aria-current={number === stranica ? "page" : undefined}
        onClick={() => setStranica(number)}>
        {number}
      </Pagination.Item>,
    );
  }

  function PromijeniUvjetPretrazivanja(e) {
    setUvjetiPretrazivanja(e.target.value);
    setStranica(1);
  }

  function toggleOmiljeni(predmetId) {
  let noviOmiljeni;
  if (omiljeniIds.includes(predmetId)) {
    noviOmiljeni = omiljeniIds.filter((id) => id !== predmetId);
  } else {
    noviOmiljeni = [...omiljeniIds, predmetId];
  }
  setOmiljeniIds(noviOmiljeni);
  localStorage.setItem("omiljeniPredmeti", JSON.stringify(noviOmiljeni));
}

//const jeOmiljen = omiljeniIds.includes(pId);
  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: -1000 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, ease: "easeOut", delay: 0.2 }}>
        <Heading as="h2" color="azure" className=" mb-2 mt-0">
          Svi Predmeti{" "}
          {aktivnaKategorijaNaziv
            ? `- ${aktivnaKategorijaNaziv.toUpperCase()}`
            : ""}{" "}
          ({ukupnoStavki})
        </Heading>
        <p style={{ color: "orange" }} className="m-3 text-center">
          trenutno ste na stranici {stranica} / {ukupnoStranica} stranica
        </p>

        <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
          {isLoggedIn && (
            <Link to={RouteNames.PREDMET_NOVI} className="me-2">
              <Button variant="success">
                <FaPlus className="me-2" aria-hidden="true" />
                Dodaj predmet
              </Button>
            </Link>
          )}

          <div className="d-flex align-items-center gap-2 flex-wrap flex-lg-nowrap">
            <div className="d-flex align-items-center gap-1">
              <span
                className="fs-7"
                style={{ whiteSpace: "nowrap", color: "orange" }}>
                Sortiraj:
              </span>
              <Form.Select
                size="sm"
                aria-label="Sortiraj predmete"
                value={sortiranje}
                onChange={(e) => {
                  setSortiranje(e.target.value);
                  setStranica(1);
                }}
                style={{ width: "170px" }}>
                <option value="naziv-asc">Abecedi (A-Z)</option>
                <option value="naziv-desc">Abecedi (Z-A)</option>
                <option value="datum-postavljanja-desc">
                  Datumu postavljanja (Novo)
                </option>
                <option value="datum-postavljanja-asc">
                  Datumu postavljanja (Staro)
                </option>
                <option value="datum-zavrsetka-asc">
                  Datumu završetka (Uskoro)
                </option>
                <option value="datum-zavrsetka-desc">
                  Datumu završetka (Kasnije)
                </option>
              </Form.Select>
            </div>

            <div className="d-flex align-items-center gap-1">
              <span
                className="fs-7"
                style={{ whiteSpace: "nowrap", color: "orange" }}>
                Prikaz:
              </span>
              <Form.Select
                size="sm"
                aria-label="Broj predmeta po stranici"
                value={velicinaStranice}
                onChange={(e) => {
                  setVelicinaStranice(parseInt(e.target.value));
                  setStranica(1);
                }}
                style={{ width: "75px" }}>
                <option value="3">3</option>
                <option value="6">6</option>
                <option value="9">9</option>
                <option value="12">12</option>
                <option value="24">24</option>
              </Form.Select>
            </div>

            <InputGroup
              size="sm"
              className="flex-grow-1"
              style={{ minWidth: "180px", maxWidth: "420px" }}>
              <InputGroup.Text>
                <FaSearch />
              </InputGroup.Text>
              <Form.Control
                type="text"
                aria-label="Pretraži predmete"
                placeholder="Pretraži predmete"
                value={uvjetiPretrazivanja}
                onChange={PromijeniUvjetPretrazivanja}
              />
            </InputGroup>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -1000 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: "easeOut", delay: 0.3 }}>
        <Row xs={1} sm={2} lg={3} xl={4} className="g-3">
          {predmetiNaStranici && predmetiNaStranici.length > 0 ? (
            predmetiNaStranici.map((c) => {
              const listaOznaka = Array.isArray(c.oznake) ? c.oznake : [];
              const brojVidljivihOznaka = c.stanje ? 2 : 3;

              let siroveSlike = c.slike || c.slikaUrls || (c.slika ? [c.slika] : []);
              if (!Array.isArray(siroveSlike)) {
                siroveSlike = typeof siroveSlike === "string" ? [siroveSlike] : [];
              }
              const listaSlika = siroveSlike;

              const jeZavrseno = jeAukcijaZavrsena(c.zavrsava, sada);

              // Provjera ponuda
              const imaPonuda = Array.isArray(c.ponude) && c.ponude.length > 0;
              const zadnjaPonuda = imaPonuda
                ? c.ponude[c.ponude.length - 1].cijena
                : null;

              return (
                <Col key={c.id || c.sifra}>
                  <Card className="h-100 shadow-sm border-0 overflow-hidden position-relative">
                    {listaSlika.length > 1 ? (
                      <Carousel
                        data-bs-theme="dark"
                        interval={null}
                        className="bg-light"
                        aria-label={`Galerija slika predmeta ${c.naziv}`}>
                        {listaSlika.map((slikaItem, idx) => (
                          <Carousel.Item key={idx}>
                            <img
                              className="d-block w-100"
                              src={dohvatiIzvorSlike(slikaItem)}
                              alt={`${c.naziv} – slika ${idx + 1}`}
                              style={{ height: "140px", objectFit: "cover" }}
                            />
                          </Carousel.Item>
                        ))}
                      </Carousel>
                    ) : listaSlika.length === 1 ? (
                      <div style={{ width: "100%", height: "140px", backgroundColor: "#f8f9fa" }}>
                        <Card.Img
                          variant="top"
                          src={dohvatiIzvorSlike(listaSlika[0])}
                          alt={c.naziv}
                          style={{ width: "100%", height: "140px", objectFit: "cover" }}
                        />
                      </div>
                    ) : (
                      <div
                        className="text-muted d-flex align-items-center justify-content-center bg-light"
                        style={{ height: "140px" }}>
                        <small>Nema slike</small>
                      </div>
                    )}

                    <Card.Body className="d-flex flex-column" style={{ padding: "0.7rem 0.8rem" }}>
                      {/* Naslov + kategorija/godina u jednom redu */}
                      <div className="d-flex align-items-center gap-2 mb-1">
                        <div
                          className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                          style={{ width: "1.9rem", height: "1.9rem", backgroundColor: "#e7f1ff" }}>
                          <IkonaKategorije nazivIkona={dohvatiIkonaKategorije(c.kategorija)} />
                        </div>
                        <div className="flex-grow-1" style={{ minWidth: 0 }}>
                          <Card.Title
                            className="mb-0 fs-6 text-break"
                            style={{ color: "#1a3580" }}>
                            {c.naziv}
                          </Card.Title>
                          {c.godinaNastanka && (
                            <small className="text-muted d-block text-truncate">
                              Godina: {c.godinaNastanka}.
                            </small>
                          )}
                        </div>
                      </div>

                      {/* Opis – skraćen, klik na "…" prikazuje cijeli tekst */}
                      <OpisPredmeta tekst={c.opis} />

                      {/* Cijene u jednom redu */}
                      <div className="d-flex flex-wrap justify-content-between align-items-center gap-1 border-top pt-2 mb-1 small">
                        <span className="text-muted">
                          Početna: <strong className="text-dark">{c.pocetnaCijena} €</strong>
                        </span>
                        {imaPonuda && (
                          <Badge bg="success" className="fw-normal">
                            Zadnja: {zadnjaPonuda} €
                          </Badge>
                        )}
                      </div>

                      {/* Stanje + oznake (najviše 3, ostalo brojač) */}
                      {(c.stanje || listaOznaka.length > 0) && (
                        <div className="d-flex flex-wrap align-items-center gap-1 mb-1">
                          {c.stanje && (
                            <Badge bg="secondary" className="fw-normal">
                              {c.stanje}
                            </Badge>
                          )}
                          {Array.isArray(listaOznaka) &&
                            listaOznaka.slice(0, brojVidljivihOznaka).map((oznakaItem, i) => (
                              <Badge
                                key={i}
                                bg="info"
                                text="dark"
                                className="fw-normal text-truncate"
                                style={{ maxWidth: "7rem" }}>
                                {prikaziNazivOznake(oznakaItem)}
                              </Badge>
                            ))}
                          {Array.isArray(listaOznaka) && listaOznaka.length > brojVidljivihOznaka && (
                            <Badge bg="light" text="dark" className="fw-normal border">
                              +{listaOznaka.length - brojVidljivihOznaka}
                            </Badge>
                          )}
                        </div>
                      )}

                      {/* Kategorija – odmah ispod badgeva, bez velikog razmaka */}
                      <div
                        className="small text-muted text-truncate"
                        title={prikaziNazivKategorije(c.kategorija)}>
                        Kategorija: {prikaziNazivKategorije(c.kategorija)}
                      </div>

                      {/* Završava + odbrojavanje */}
                      <div>
                        <div className="small text-muted d-flex flex-wrap justify-content-between align-items-center gap-1">
                          <span className="text-nowrap" title={formatirajDatum(c.zavrsava)}>
                            {jeZavrseno ? "Završila" : "Završava"}: {formatirajDatum(c.zavrsava)}
                          </span>
                          <span className={`ms-auto fw-semibold text-nowrap ${jeZavrseno ? "text-danger" : "text-dark"}`}>
                            <Odbrojavanje zavrsava={c.zavrsava} />
                          </span>
                        </div>
                      </div>

                      {/* Ponuda + akcije u istom redu */}
                      <div className="d-flex gap-2 mt-auto pt-2 border-top">
                        {isLoggedIn ? (
                          <Button
                            variant="primary"
                            size="sm"
                            className="flex-grow-1"
                            disabled={jeZavrseno}
                            onClick={() => otvoriModalZaPonudu(c)}>
                            Tvoja ponuda
                          </Button>
                        ) : (
                          <Button
                            variant="outline-primary"
                            size="sm"
                            className="flex-grow-1"
                            disabled={jeZavrseno}
                            title="Za davanje ponude potrebna je prijava"
                            onClick={() => navigate(RouteNames.LOGIRANJE)}>
                            Prijavi se za ponudu
                          </Button>
                        )}
                        {isLoggedIn && (
                          <>
                            <Button
                              variant="outline-warning"
                              size="sm"
                              onClick={() => navigate(`/predmeti/promijeni/${c.id || c.sifra}`)}
                              title="Promjena predmeta"
                              aria-label={`Promjena predmeta: ${c.naziv}`}>
                              <FaEdit aria-hidden="true" />
                            </Button>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => obrisi(c)}
                              title="Brisanje predmeta"
                              aria-label={`Brisanje predmeta: ${c.naziv}`}>
                              <FaTrash aria-hidden="true" />
                            </Button>
                          </>
                        )}
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })
          ) : (
            <Col xs={12}>
              <p className="text-muted text-center py-4">
                Nema predmeta u odabranoj kategoriji.
              </p>
            </Col>
          )}
        </Row>

        {ukupnoStranica > 1 && (
          <div className="d-flex justify-content-center mt-4">
            <div className="d-flex d-sm-none align-items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                aria-label="Prva stranica"
                onClick={() => setStranica(1)}
                disabled={stranica === 1}>
                &laquo;&laquo;
              </Button>
              <Button
                variant="secondary"
                size="sm"
                aria-label="Prethodna stranica"
                onClick={() => setStranica((prev) => Math.max(prev - 1, 1))}
                disabled={stranica === 1}>
                &lsaquo;
              </Button>

              <span
                className="text-muted small px-2"
                style={{ whiteSpace: "nowrap" }}>
                <strong>{stranica}</strong> / {ukupnoStranica}
              </span>

              <Button
                variant="secondary"
                size="sm"
                aria-label="Sljedeća stranica"
                onClick={() =>
                  setStranica((prev) => Math.min(prev + 1, ukupnoStranica))
                }
                disabled={stranica === ukupnoStranica}>
                &rsaquo;
              </Button>
              <Button
                variant="secondary"
                size="sm"
                aria-label="Posljednja stranica"
                onClick={() => setStranica(ukupnoStranica)}
                disabled={stranica === ukupnoStranica}>
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
      </motion.div>

      {/* Modal za ponudu */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Unos ponude</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {odabraniPredmet && (() => {
            const imaPonuda = Array.isArray(odabraniPredmet.ponude) && odabraniPredmet.ponude.length > 0;
            const trenutnaCijena = imaPonuda
              ? Number(odabraniPredmet.ponude[odabraniPredmet.ponude.length - 1].cijena)
              : Number(odabraniPredmet.pocetnaCijena);
            const minimalnaCijena = trenutnaCijena + 1;

            return (
              <Form>
                <Form.Group>
                  <Form.Label>Vaša ponuda za: {odabraniPredmet.naziv}</Form.Label>
                  <Form.Control
                    type="number"
                    aria-label="Iznos ponude"
                    min={minimalnaCijena}
                    value={iznosPonude}
                    onChange={(e) => setIznosPonude(e.target.value)}
                    isInvalid={Number(iznosPonude) < minimalnaCijena}
                  />
                  <Form.Control.Feedback type="invalid">
                    Ponuda mora biti minimalno {minimalnaCijena} €.
                  </Form.Control.Feedback>
                  <Form.Text className="text-muted">
                    Trenutno važeća cijena je {trenutnaCijena} €. Minimalni iznos ponude je {minimalnaCijena} €.
                  </Form.Text>
                </Form.Group>
              </Form>
            );
          })()}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Odustani
          </Button>
          <Button 
            variant="primary" 
            onClick={potvrdiPonudu}
            disabled={
              odabraniPredmet && (() => {
                const imaPonuda = Array.isArray(odabraniPredmet.ponude) && odabraniPredmet.ponude.length > 0;
                const trenutnaCijena = imaPonuda
                  ? Number(odabraniPredmet.ponude[odabraniPredmet.ponude.length - 1].cijena)
                  : Number(odabraniPredmet.pocetnaCijena);
                return Number(iznosPonude) <= trenutnaCijena;
              })()
            }>
            Potvrdi ponudu
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}