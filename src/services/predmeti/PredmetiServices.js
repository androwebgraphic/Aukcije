import { DATA_SOURCE } from "../../constants";
import PredmetiServicesMemorija  from './PredmetiServicesMemorija'
import PredmetiServicesLocalStorage from "./PredmetiServicesLocalStorage";


let Servis = null

switch (DATA_SOURCE ){
  
  case 'memorija': 
    
    Servis =PredmetiServicesMemorija

    break
  
  case 'localStorage' :
    
    Servis = PredmetiServicesLocalStorage

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
  dodaj: (predmet) => AktivniServis.dodaj(predmet), 
  promijeni: (id, predmet )=> AktivniServis.promijeni(id,predmet),
  obrisi: (id) => AktivniServis.obrisi(id)
}
// export {KategorijeServicesMemorija}