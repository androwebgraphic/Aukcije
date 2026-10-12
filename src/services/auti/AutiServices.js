import { DATA_SOURCE } from "../../constants";
import AutiServicesMemorija  from './AutiServicesMemorija'
import AutiServicesLocalStorage from "./AutiServicesLocalStorage";


let Servis = null

switch (DATA_SOURCE ){
  
  case 'memorija': 
    
    Servis =AutiServicesMemorija

    break
  
  case 'localStorage' :
    
    Servis = AutiServicesLocalStorage

    break
  
  default:
    
    Servis = null
}

const PrazanServis = {

  get: async () => ({ data: [] }),
  dodaj: async (auto) => { console.log('Smjer nije implementiran') },
  getByID: async (id) => ({ data: {} }),
  promijeni: async (id, auti) => { console.error('Servis nije  implmentiran') },
  obrisi: async (id) => {console.error('Servis nije  implementiran')}
}

const AktivniServis = Servis || PrazanServis

export default {

  get: () => AktivniServis.get(),
  getByID: (id)=> AktivniServis.getByID(id),
  dodaj: (auto) => AktivniServis.dodaj(auto), 
  promijeni: (id, auto )=> AktivniServis.promijeni(id, auto),
  obrisi: (id) => AktivniServis.obrisi(id)
}
// export {KategorijeServicesMemorija}