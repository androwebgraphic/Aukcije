import { DATA_SOURCE } from "../../constants";
import ViniliServicesMemorija  from './ViniliServicesMemorija'
import ViniliServicesLocalStorage from "./ViniliServicesLocalStorage";


let Servis = null

switch (DATA_SOURCE ){
  
  case 'memorija': 
    
    Servis =ViniliServicesMemorija

    break
  
  case 'localStorage' :
    
    Servis = ViniliServicesLocalStorage

    break
  
  default:
    
    Servis = null
}

const PrazanServis = {

  get: async () => ({ data: [] }),
  dodaj: async (vinil) => { console.log('Smjer nije implementiran') },
  getByID: async (id) => ({ data: {} }),
  promijeni: async (id, vinil) => { console.error('Servis nije  implmentiran') },
  obrisi: async (id) => {console.error('Servis nije  implementiran')}
}

const AktivniServis = Servis || PrazanServis

export default {

  // get: () => AktivniServis.get(),
  // getByID: (id)=> AktivniServis.getByID(id),
  // dodaj: (vinil) => AktivniServis.dodaj(vinil),
  // promijeni: (id, vinil )=> AktivniServis.promijeni(id, vinil),
  // obrisi: (id) => AktivniServis.obrisi(id)
  


  get: async () => {
    
    try {

      const rez = await AktivniServis.get()

      if (rez && rez.data !== undefined) {
        // Ako servis vrati objekt koji ima .data, ali je undefined, ili ako vrati čist niz/objekt
        return rez
      }
      // Ako pod-servis vraća direktno niz (npr. iz localStorage-a), ovdje ga automatski umotavamo u { data: ... } format
      return { data: Array.isArray(rez) ? rez : (rez ? [rez] : [])}
    }
    catch (e) {
      console.error("Greska u Servisu", e)
      return {data:[]}

    }


  },

  getByID: (id) => AktivniServis.getByID(id),
  dodaj: (vinil) => AktivniServis.dodaj(vinil),
  promijeni: (id, vinil) => AktivniServis.promijeni(id, vinil),
  obrisi: (id) => AktivniServis.obrisi(id)


}
// export {KategorijeServicesMemorija}