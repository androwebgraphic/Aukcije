// Globalni brojač učitavanja.
//
// Servisi ga zovu oko svakog dohvata (saUcitavanjem), a LoadingProvider se
// pretplati na njega. Tako spinner radi na svim stranicama bez toga da svaka
// stranica posebno zove showLoading/hideLoading — prije je to radila samo
// lista kategorija, pa se spinner nigdje drugdje nije ni pojavljivao.

let aktivnih = 0;
const pretplatnici = new Set();

function obavijesti() {
  for (const pretplatnik of pretplatnici) {
    pretplatnik(aktivnih);
  }
}

export const brojAktivnihUcitavanja = () => aktivnih;

export function pocniUcitavanje() {
  aktivnih += 1;
  obavijesti();
}

export function zavrsiUcitavanje() {
  aktivnih = Math.max(0, aktivnih - 1);
  obavijesti();
}

// Vraća funkciju za odjavu pretplate (za useEffect cleanup).
export function pretplatiSeNaUcitavanje(pretplatnik) {
  pretplatnici.add(pretplatnik);
  pretplatnik(aktivnih);
  return () => pretplatnici.delete(pretplatnik);
}

// Omotava funkciju koja vraća Promise: brojač je aktivan dok Promise traje,
// bez obzira završio uspješno ili greškom.
export function saUcitavanjem(funkcija) {
  return async (...argumenti) => {
    pocniUcitavanje();
    try {
      return await funkcija(...argumenti);
    } finally {
      zavrsiUcitavanje();
    }
  };
}
