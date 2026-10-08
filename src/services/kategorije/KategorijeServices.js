import { DATA_SOURCE } from "../../constants";
import  KategorijeServicesLocalStorage  from '../kategorije/KategorijeServicesLocalStorage'
import KategorijeServicesMemorija  from '../kategorije/KategorijeServicesMemorija'


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
  getByID: ()=> AktivniServis.getByID(),
  dodaj: (kategorije) => AktivniServis.dodaj(kategorije), 
  promijeni: (id, kategorije) => AktivniServis.promijeni(id, kategorije),
  obrisi: (id) => AktivniServis.obrisi(id)
}
// export {KategorijeServicesMemorija}