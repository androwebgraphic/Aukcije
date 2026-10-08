import { kategorije } from './KategorijeData'


//1/4 cRud READ
async function get() {
  
  return {data: [...kategorije]}
}

async function getByID(id) {
  
  return { data: kategorije.find( s => s.id === parseInt(id))}

}
//2/4  Crud CREATE

async function dodaj(kategorija) {
 
  if (kategorije.length === 0) {
    
    kategorija.id = 1
  } else {
    
    kategorija.id = kategorije[kategorije.length-1].id +1
  }
kategorije.push(kategorija)
}
//3/4 crUd UPDATE

async function promijeni(id, kategorija) {
  
  const index = nadiIndex(id)
  kategorije[index] = {...kategorije[index], ...kategorija}
}

function nadiIndex(id) {
  
  return kategorije.findIndex(s => s.id===parseInt(id))
}

async function obrisi(id) {
  
  const index = nadiIndex(id)
  kategorije.splice(index,1)
}

//4/4 cruD DELETE
export default {

  get,
  dodaj,
  getByID,
  promijeni,
  obrisi

}
