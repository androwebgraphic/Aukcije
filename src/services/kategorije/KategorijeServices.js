import { DATA_SOURCE } from "../../constants";
import KategorijeServicesMemorija  from './KategorijeServicesMemorija'
import KategorijeServicesLocalStorage from "./KategorijeServicesLocalStorage";
import { saUcitavanjem } from "../../utils/loadingBus";

const PrazanServis = {
  get: async () => ({ data: [] }),
  dodaj: async () => { console.log('Smjer nije implementiran'); },
  getByID: async () => ({ data: {} }),
  promijeni: async () => { console.error('Servis nije implementiran'); },
  obrisi: async () => { console.error('Servis nije implementiran'); }
};

// Firebase se učitava tek kad je stvarno odabran (vidi PredmetiServices).
let servisPromise = null;

function dohvatiServis() {
  if (!servisPromise) {
    switch (DATA_SOURCE) {
      case 'memorija':
        servisPromise = Promise.resolve(KategorijeServicesMemorija);
        break;
      case 'firebase':
        servisPromise = import("./KategorijeServicesFirebase")
          .then((modul) => modul.default)
          .catch((error) => {
            console.error("Firebase servis kategorija nije dostupan:", error);
            return PrazanServis;
          });
        break;
      case 'localStorage':
        servisPromise = Promise.resolve(KategorijeServicesLocalStorage);
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
  obrisi: pozovi('obrisi')
};
