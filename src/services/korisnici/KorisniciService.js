import { DATA_SOURCE } from "../../constants.js";
import KorisniciServiceMemorija from "./KorisniciServiceMemorija.js";
import KorisniciServiceLocalStorage from "./KorisniciServiceLocalStorage.js";
import KorisniciServiceFirebase from "./KorisniciServiceFirebase.js";

// 1. Odabir servisa prema DATA_SOURCE u constants.js
let Servis = null

switch (DATA_SOURCE) {
  case 'memorija':
    Servis = KorisniciServiceMemorija
    break

  case 'localStorage':
    Servis = KorisniciServiceLocalStorage
    break

  case 'firebase':
    Servis = KorisniciServiceFirebase
    break

  default:
    Servis = null
}

// 2. Definiranje praznog servisa (kad DATA_SOURCE nije prepoznat)
const PrazanServis = {
  get: async () => ({ success: false, data: [] }),
  getById: async () => ({ success: false, data: null }),
  dodaj: async () => ({ success: false, data: null }),
  dodajBezHash: async () => ({ success: false, data: null }),
  promijeni: async () => ({ success: false, data: null }),
  promijeniLozinku: async () => ({ success: false, data: null }),
  obrisi: async () => ({ success: false, data: null }),
  prijava: async () => ({ success: false, data: null })
}

// 3. Jedan export na kraju
const AktivniServis = Servis || PrazanServis

export default {
  get: () => AktivniServis.get(),
  getById: (id) => AktivniServis.getById(id),
  dodaj: (korisnik) => AktivniServis.dodaj(korisnik),
  dodajBezHash: (korisnik) => AktivniServis.dodajBezHash
    ? AktivniServis.dodajBezHash(korisnik)
    : Promise.resolve({ success: false, data: null }),
  promijeni: (id, korisnik) => AktivniServis.promijeni(id, korisnik),
  promijeniLozinku: (id, novaLozinka) => AktivniServis.promijeniLozinku(id, novaLozinka),
  obrisi: (id) => AktivniServis.obrisi(id),
  prijava: (email, lozinka) => AktivniServis.prijava(email, lozinka)
}
