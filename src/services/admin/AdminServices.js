// import AdminServicesLocalStorage from "./AdmiServicesLocalStorage.js";
// import AdminServicesmmemorija from "./AdminServicesMemorija.js"
import { DATA_SOURCE } from "../../constants.js";


//1.Oadbir Servisa
let Servis = null
switch (DATA_SOURCE) {
  case 'localStorage':
    Servis = AdminServicesLocalStorage
    break
  case 'memorija':
    Servis = AdminServicesmmemorija
    break
  default:
    Servis = null
}
//2. Derfinirnje praznog servisa
const PrazanServis = {
  get: async () => {
         ({ success: false, data: null})
    },
  getById: async (id) => {
    return( { success: false, data: null })
  },
  dodaj: async (admin) => {
   return ({ success: false, data: null }  )
  },
  promijeni: async (admin) => {
    return ({ success: false, data: null })
  },
  promijeniLozinku: async (id, lozinka) => {
    return ({ success: false, data: null })
  },
  obrisi: async (id) => {
    return ({ success: false, data: null })
  },
  prijava: async (email, lozinka) => {
    return  ({ success: false, data: null })
  }
}

//3jedan export nakraju
const AktivniServis = Servis || PrazanServis
export default {
  get: AktivniServis.get,
  getById: AktivniServis.getById,
  dodaj: AktivniServis.dodaj,
  promijeni: AktivniServis.promijeni,
  obrisi: AktivniServis.obrisi,
  prijava: AktivniServis.prijava
}