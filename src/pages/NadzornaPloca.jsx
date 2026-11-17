import { useEffect, useMemo, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReactPaket from "highcharts-react-official";
import { Alert, Spinner } from "react-bootstrap";
import Heading from "../components/UI/Heading";
import PredmetiServices from "../services/predmeti/PredmetiServices";
import KategorijeServices from "../services/kategorije/KategorijeServices";

// Paket je CJS: pod Vite-om default import može biti omotač { HighchartsReact, default }.
const HighchartsReact =
  HighchartsReactPaket?.HighchartsReact ??
  HighchartsReactPaket?.default ??
  HighchartsReactPaket;

// Javlja li se kategorija kao broj, string ili objekt { id, naziv }
function idKategorije(predmet) {
  const k = predmet?.kategorija;
  if (k === null || k === undefined) return null;
  if (typeof k === "object") return k.id ?? k.sifra ?? null;
  return k;
}

export default function NadzornaPloca() {
  const [predmeti, setPredmeti] = useState([]);
  const [kategorije, setKategorije] = useState([]);
  const [ucitavanje, setUcitavanje] = useState(true);
  const [greska, setGreska] = useState(null);

  useEffect(() => {
    let otkazano = false;

    async function ucitaj() {
      try {
        const [odgovorPredmeti, odgovorKategorije] = await Promise.all([
          PredmetiServices.get(),
          KategorijeServices.get(),
        ]);

        if (otkazano) return;

        setPredmeti(Array.isArray(odgovorPredmeti?.data) ? odgovorPredmeti.data : []);
        setKategorije(Array.isArray(odgovorKategorije?.data) ? odgovorKategorije.data : []);
      } catch (error) {
        console.error("Nadzorna ploča — greška pri učitavanju:", error);
        if (!otkazano) setGreska("Podatke trenutno nije moguće učitati.");
      } finally {
        if (!otkazano) setUcitavanje(false);
      }
    }

    ucitaj();

    return () => {
      otkazano = true;
    };
  }, []);

  // Broj predmeta po kategoriji
  const podatci = useMemo(() => {
    const brojac = new Map();

    for (const predmet of predmeti) {
      const id = idKategorije(predmet);
      const kategorija = kategorije.find((k) => String(k.id ?? k.sifra) === String(id));
      const naziv = kategorija?.naziv || "Bez kategorije";

      brojac.set(naziv, (brojac.get(naziv) || 0) + 1);
    }

    return [...brojac.entries()]
      .map(([naziv, broj]) => ({ name: naziv, y: broj }))
      .sort((a, b) => b.y - a.y);
  }, [predmeti, kategorije]);

  const options = {
    chart: {
      type: "pie",
      backgroundColor: "transparent",
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
    },
    title: {
      text: "Broj predmeta po kategorijama",
      align: "left",
      style: { color: "#ffffff" },
    },
    tooltip: {
      pointFormat: "<b>{point.y}</b> predmeta ({point.percentage:.1f}%)",
    },
    accessibility: { enabled: false },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: "pointer",
        dataLabels: {
          enabled: true,
          format: "<b>{point.name}</b>: {point.y}",
          style: { color: "#ffffff", textOutline: "none" },
        },
      },
    },
    series: [
      {
        name: "Broj predmeta",
        colorByPoint: true,
        data: podatci,
      },
    ],
  };

  return (
    <>
      <Heading as="h2" color="azure">
        Nadzorna ploča
      </Heading>

      {greska && <Alert variant="danger">{greska}</Alert>}

      {ucitavanje && (
        <div className="text-white d-flex align-items-center gap-2">
          <Spinner animation="border" size="sm" /> Učitavanje podataka…
        </div>
      )}

      {!ucitavanje && !greska && podatci.length === 0 && (
        <Alert variant="info">Još nema predmeta — dodaj ih na stranici Predmeti.</Alert>
      )}

      {!ucitavanje && podatci.length > 0 && (
        <HighchartsReact highcharts={Highcharts} options={options}  />
      )}
    </>
  );
}
