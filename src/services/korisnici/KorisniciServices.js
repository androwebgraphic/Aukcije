import { DATA_SOURCE } from "../../constants";
import KorisniciServicesMemorija  from './KorisniciServicesMemorija'
import KorisniciServicesLocalStorage from "./KorisniciServicesLocalStorage";


let Servis = null

switch (DATA_SOURCE ){
  
  case 'memorija': 
    
    Servis =KorisniciServicesMemorija

    break
  
  case 'localStorage' :
    
    Servis = KorisniciServicesLocalStorage

    break
  
  default:
    
    Servis = null
}

const PrazanServis = {

  get: async () => ({ data: [] }),
  dodaj: async (korisnik) => { console.log('Smjer nije implementiran') },
  getByID: async (id) => ({ data: {} }),
  promijeni: async (id, korisnici) => { console.error('Servis nije  implmentiran') },
  obrisi: async (id) => {console.error('Servis nije  implementiran')}
}

const AktivniServis = Servis || PrazanServis

export default {

  get: () => AktivniServis.get(),
  getByID: (id)=> AktivniServis.getByID(id),
  dodaj: (korisnik) => AktivniServis.dodaj(korisnik), 
  promijeni: (id, korisnik )=> AktivniServis.promijeni(id, korisnik),
  obrisi: (id) => AktivniServis.obrisi(id)
}
// export {KategorijeServicesMemorija}