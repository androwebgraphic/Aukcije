import { DATA_SOURCE } from "../../constants";
import PredmetiServicesMemorija from './PredmetiServicesMemorija';
import PredmetiServicesLocalStorage from "./PredmetiServicesLocalStorage";

let Servis = null;

switch (DATA_SOURCE) {
  case 'memorija': 
    Servis = PredmetiServicesMemorija;
    break;
  
  case 'localStorage': 
    Servis = PredmetiServicesLocalStorage;
    break;
  
  default:
    Servis = null;
}

const PrazanServis = {
  get: async () => ({ data: [] }),
  dodaj: async (predmet) => { console.log('Servis nije implementiran'); },
  getByID: async (id) => ({ data: null }),
  promijeni: async (id, predmet) => { console.error('Servis nije implementiran'); },
  obrisi: async (id) => { console.error('Servis nije implementiran'); },
  dohvatiStranicu: async (stranica, velicinaStranice, uvjetiPretrazivanja) => ({ 
    data: [], 
    ukupnoStranica: 0, 
    ukupnoStavki: 0 
  })
};

const AktivniServis = Servis || PrazanServis;

export default {
  get: () => AktivniServis.get ? AktivniServis.get() : Promise.resolve({ data: [] }),
  getByID: (id) => AktivniServis.getByID ? AktivniServis.getByID(id) : Promise.resolve({ data: null }),
  dodaj: (predmet) => AktivniServis.dodaj ? AktivniServis.dodaj(predmet) : Promise.resolve(), 
  promijeni: (id, predmet) => AktivniServis.promijeni ? AktivniServis.promijeni(id, predmet) : Promise.resolve(),
  obrisi: (id) => AktivniServis.obrisi ? AktivniServis.obrisi(id) : Promise.resolve(),
  dohvatiStranicu: (stranica, velicinaStranice, uvjetiPretrazivanja) => {
    if (AktivniServis && typeof AktivniServis.dohvatiStranicu === 'function') {
      return AktivniServis.dohvatiStranicu(stranica, velicinaStranice, uvjetiPretrazivanja);
    }
    return Promise.resolve({ data: [], ukupnoStranica: 0, ukupnoStavki: 0 });
  }
};