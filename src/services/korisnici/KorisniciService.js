import { DATA_SOURCE } from "../../constants.js";
import KorisniciServiceMemorija from "./KorisniciServiceMemorija.js";
import KorisniciServiceLocalStorage from "./KorisniciServiceLocalStorage.js";
import { saUcitavanjem } from "../../utils/loadingBus";

// 1. Prazan servis (kad DATA_SOURCE nije prepoznat)
const PrazanServis = {
  get: async () => ({ success: false, data: [] }),
  getById: async () => ({ success: false, data: null }),
  dodaj: async () => ({ success: false, data: null }),
  dodajBezHash: async () => ({ success: false, data: null }),
  promijeni: async () => ({ success: false, data: null }),
  promijeniLozinku: async () => ({ success: false, data: null }),
  obrisi: async () => ({ success: false, data: null }),
  prijava: async () => ({ success: false, data: null })
};

// 2. Firebase se učitava tek kad je stvarno odabran. U localStorage/memorija
// načinu rada njegov SDK (~434 kB) tako ne ulazi u početni bundle.
let servisPromise = null;

function dohvatiServis() {
  if (!servisPromise) {
    switch (DATA_SOURCE) {
      case 'memorija':
        servisPromise = Promise.resolve(KorisniciServiceMemorija);
        break;
      case 'localStorage':
        servisPromise = Promise.resolve(KorisniciServiceLocalStorage);
        break;
      case 'firebase':
        servisPromise = import("./KorisniciServiceFirebase.js")
          .then((modul) => modul.default)
          .catch((error) => {
            console.error("Firebase servis korisnika nije dostupan:", error);
            return PrazanServis;
          });
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

// 3. Jedan export na kraju
export default {
  get: saUcitavanjem(pozovi('get')),
  getById: saUcitavanjem(pozovi('getById')),
  dodaj: pozovi('dodaj'),
  dodajBezHash: pozovi('dodajBezHash'),
  promijeni: pozovi('promijeni'),
  promijeniLozinku: pozovi('promijeniLozinku'),
  obrisi: pozovi('obrisi'),
  prijava: pozovi('prijava')
};
