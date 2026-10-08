import { DATA_SOURCE } from "../../constants";
import KategorijeServicesMemorija  from './KategorijeServicesMemorija'
import KategorijeServicesLocalStorage from "./KategorijeServicesLocalStorage";


let Servis = null

switch (DATA_SOURCE ){
  
  case 'memorija': 
    
    Servis = KategorijeServicesMemorija

    break
  
  case 'localStorage' :
    
    Servis = KategorijeServicesLocalStorage

    break
  
  default:
    
    Servis = null
}

const PrazanServis = {

  get: async () => ({ data: [] }),
  dodaj: async (kategorija) => { console.log('Smjer nije implementiran') },
  getByID: async (id) => ({ data: {} }),
  promijeni: async (id, kategorije) => { console.error('Servis nije  implmentiran') },
  obrisi: async (id) => {console.error('Servis nije  implementiran')}
}

const AktivniServis = Servis || PrazanServis

export default {

  get: () => AktivniServis.get(),
  getByID: (id)=> AktivniServis.getByID(id),
  dodaj: (kategorija) => AktivniServis.dodaj(kategorija), 
  promijeni: (id, kategorija) => AktivniServis.promijeni(id, kategorija),
  obrisi: (id) => AktivniServis.obrisi(id)
}
// export {KategorijeServicesMemorija}