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
  dodaj: async (predmet) => { console.log('Smjer nije implementiran') },
  // Primjer kako getByID mora izgledati u PredmetiServicesLocalStorage.js
async getByID(id) {
  const predmeti = JSON.parse(localStorage.getItem("predmeti")) || [];
  // Pronađi predmet čiji id odgovara (pazi na tip podatka, zato koristimo == ili String())
  const predmet = predmeti.find(p => String(p.id) === String(id));
  return { data: predmet || null };
},
  promijeni: async (id, predmett) => { console.error('Servis nije  implmentiran') },
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