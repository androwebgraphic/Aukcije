import { DATA_SOURCE } from "../../constants";
import PredmetiServicesMemorija from './PredmetiServicesMemorija';
import PredmetiServicesLocalStorage from "./PredmetiServicesLocalStorage";
import { saUcitavanjem } from "../../utils/loadingBus";

const PrazanServis = {
  get: async () => ({ data: [] }),
  dodaj: async () => { console.log('Servis nije implementiran'); },
  getByID: async () => ({ data: null }),
  promijeni: async () => { console.error('Servis nije implementiran'); },
  obrisi: async () => { console.error('Servis nije implementiran'); },
  dohvatiStranicu: async () => ({
    data: [],
    ukupnoStranica: 0,
    ukupnoStavki: 0
  })
};

// Firebase se učitava tek kad je stvarno odabran. U localStorage/memorija
// načinu rada njegov SDK (~434 kB) tako ne ulazi u početni bundle.
let servisPromise = null;

function dohvatiServis() {
  if (!servisPromise) {
    switch (DATA_SOURCE) {
      case 'memorija':
        servisPromise = Promise.resolve(PredmetiServicesMemorija);
        break;
      case 'firebase':
        servisPromise = import("./PredmetiFirebaseServices")
          .then((modul) => modul.default)
          .catch((error) => {
            console.error("Firebase servis predmeta nije dostupan:", error);
            return PrazanServis;
          });
        break;
      case 'localStorage':
        servisPromise = Promise.resolve(PredmetiServicesLocalStorage);
        break;
      default:
        servisPromise = Promise.resolve(PrazanServis);
    }
  }

  return servisPromise;
}

function pozovi(metoda) {
  return async (...argumenti) => {
    const servis = await dohvatiServis();
    const funkcija = servis?.[metoda] ?? PrazanServis[metoda];
    return typeof funkcija === 'function' ? funkcija(...argumenti) : undefined;
  };
}

export default {
  get: saUcitavanjem(pozovi('get')),
  getByID: saUcitavanjem(pozovi('getByID')),
  dodaj: pozovi('dodaj'),
  promijeni: pozovi('promijeni'),
  obrisi: pozovi('obrisi'),
  dohvatiStranicu: saUcitavanjem(pozovi('dohvatiStranicu'))
};
