import { DATA_SOURCE } from "../../constants";
import PredmetiServicesMemorija from './PredmetiServicesMemorija'
import PredmetiServicesLocalStorage from "./PredmetiServicesLocalStorage";

// Postavljamo localStorage kao defaultni servis da se izbjegne fallback na prazan servis
let Servis = PredmetiServicesLocalStorage;

if (DATA_SOURCE === 'memorija') {
  Servis = PredmetiServicesMemorija;
} else if (DATA_SOURCE === 'localStorage') {
  Servis = PredmetiServicesLocalStorage;
}

export default {
<<<<<<< Updated upstream
  get: () => AktivniServis.get(),
  getByID: (id) => AktivniServis.getByID(id),
  dodaj: (predmet) => AktivniServis.dodaj(predmet), 
  promijeni: (id, predmet) => AktivniServis.promijeni(id, predmet),
  obrisi: (id) => AktivniServis.obrisi(id), // <-- Ovdje je dodan zarez koji je nedostajao
  dohvatiStranicu: (stranica, velicinaStranice) => AktivniServis.dohvatiStranicu(stranica, velicinaStranice)
=======
  get: () => Servis.get(),
  getByID: (id) => Servis.getByID(id),
  dodaj: (predmet) => Servis.dodaj(predmet), 
  promijeni: (id, predmet) => Servis.promijeni(id, predmet),
  obrisi: (id) => Servis.obrisi(id),
  dohvatiStranicu: (stranica, velicinaStranice, uvjetiPretrazivanja) => Servis.dohvatiStranicu(stranica, velicinaStranice, uvjetiPretrazivanja)
>>>>>>> Stashed changes
}