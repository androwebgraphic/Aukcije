import { DATA_SOURCE } from "../../constants";
import PredmetiServicesMemorija  from './PredmetiServicesMemorija'
import PredmetiServicesLocalStorage from "./PredmetiServicesLocalStorage";


let Servis = null

switch (DATA_SOURCE ){
  
  case 'memorija': 
    Servis = PredmetiServicesMemorija
    break
  
  case 'localStorage' :
    Servis = PredmetiServicesLocalStorage
    break
  
  default:
    Servis = null
}

const PrazanServis = {
  get: async () => ({ data: [] }),
  dodaj: async (predmet) => { console.log('Smjer nije implementiran') },
  async getByID(id) {
    const predmeti = JSON.parse(localStorage.getItem("predmeti")) || [];
    const predmet = predmeti.find(p => String(p.id) === String(id));
    return { data: predmet || null };
  },
  promijeni: async (id, predmett) => { console.error('Servis nije implementiran') },
  obrisi: async (id) => { console.error('Servis nije implementiran') },
  dohvatiStranicu: async (stranica, velicinaStranice) => ({ data: [], ukupnoStranica: 0, ukupnoStavki: 0 })
}

const AktivniServis = Servis || PrazanServis

export default {
  get: () => AktivniServis.get(),
  getByID: (id) => AktivniServis.getByID(id),
  dodaj: (predmet) => AktivniServis.dodaj(predmet), 
  promijeni: (id, predmet) => AktivniServis.promijeni(id, predmet),
  obrisi: (id) => AktivniServis.obrisi(id), // <-- Ovdje je dodan zarez koji je nedostajao
  dohvatiStranicu: (stranica, velicinaStranice,uvjetiPretrazivanja) => AktivniServis.dohvatiStranicu(stranica, velicinaStranice,uvjetiPretrazivanja)
}