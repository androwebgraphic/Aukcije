import { oznake } from './OznakeData'


//1/4 cRud READ
async function get() {
  
  return {data: [...oznake]}
}

async function getByID(id) {
  
  return { data: oznake.find( o => o.id === parseInt(id))}

}
//2/4  Crud CREATE

async function dodaj(oznaka) {
 
  if (oznake.length === 0) {
    
    oznaka.id = 1
  } else {
    
    oznaka.id = oznake[oznake.length-1].id +1
  }
oznake.push(oznaka)
}
//3/4 crUd UPDATE

async function promijeni(id, oznaka) {
  
  const index = nadiIndex(id)
  oznake[index] = {...oznake[index], ...oznaka}
}

function nadiIndex(id) {
  
  return oznake.findIndex(s => o.id===parseInt(id))
}

async function obrisi(id) {
  
  const index = nadiIndex(id)
  oznake.splice(index,1)
}

//4/4 cruD DELETE
export default {

  get,
  dodaj,
  getByID,
  promijeni,
  obrisi

}
