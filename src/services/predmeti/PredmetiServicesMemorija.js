import { predmeti } from './PredmetiData'


//1/4 cRud READ
async function get() {
  
  return {data: [...predmeti]}
}

async function getByID(id) {
  
  return { data: predmeti.find( s => s.id === parseInt(id))}

}
//2/4  Crud CREATE

async function dodaj(predmet) {
 
  if (predmeti.length === 0) {
    
    predmet.id = 1
  } else {
    
    predmet.id = predmeti[predmeti.length-1].id +1
  }
predmeti.push(predmet)
}
//3/4 crUd UPDATE

async function promijeni(id, predmet) {
  
  const index = nadiIndex(id)
  predmeti[index] = {...predmeti[index], ...predmet}
}

function nadiIndex(id) {
  
  return predmeti.findIndex(s => s.id===parseInt(id))
}

async function obrisi(id) {
  
  const index = nadiIndex(id)
  predmeti.splice(index,1)
}

//4/4 cruD DELETE
export default {

  get,
  dodaj,
  getByID,
  promijeni,
  obrisi

}
