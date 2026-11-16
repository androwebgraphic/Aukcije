import AdminServiceLocalStorage from "./KorisniciServiceLocalStorage.js";
import AdminServicemmemorija from "./KorisniciServiceMemorija.js"
import { DATA_SOURCE } from "../../constants.js";


//1.Oadbir Servisa
let Servis = null
switch (DATA_SOURCE) {
  case 'localStorage':
    Servis = AdminServiceLocalStorage
    break
  case 'memorija':
    Servis = AdminServicemmemorija
    break
  default:
    Servis = null
}
//2. Derfinirnje praznog servisa
const PrazanServis = {
  get: async () => ({ success: false, data: null }),
  getById: async () => ({ success: false, data: null }),
  dodaj: async () => ({ success: false, data: null }),
  promijeni: async () => ({ success: false, data: null }),
  promijeniLozinku: async () => ({ success: false, data: null }),
  obrisi: async () => ({ success: false, data: null }),
  prijava: async () => ({ success: false, data: null })
}

//3jedan export nakraju
const AktivniServis = Servis || PrazanServis
export default {
  get: AktivniServis.get,
  getById: AktivniServis.getById,
  dodaj: AktivniServis.dodaj,
  promijeni: AktivniServis.promijeni,
  promijeniLozinku: AktivniServis.promijeniLozinku,
  obrisi: AktivniServis.obrisi,
  prijava: AktivniServis.prijava
}