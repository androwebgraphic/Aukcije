import { auti } from './AutiData'


//1/4 cRud READ
async function get() {
  
  return {data: [...auti]}
}

async function getByID(id) {
  
  return { data: auti.find( s => s.id === parseInt(id))}

}
//2/4  Crud CREATE

async function dodaj(auto) {
 
  if (auti.length === 0) {
    
    auto.id = 1
  } else {
    
    auto.id = auti[auti.length-1].id +1
  }
auti.push(auto)
}
//3/4 crUd UPDATE

async function promijeni(id, auto) {
  
  const index = nadiIndex(id)
  auti[index] = {...auti[index], ...auto}
}

function nadiIndex(id) {
  
  return auti.findIndex(s => s.id===parseInt(id))
}

async function obrisi(id) {
  
  const index = nadiIndex(id)
  auti.splice(index,1)
}

//4/4 cruD DELETE
export default {

  get,
  dodaj,
  getByID,
  promijeni,
  obrisi

}
