import { korisnici } from './KorisniciData.js'


//1/4 cRud READ
async function get() {
  
  return {data: [...korisnici]}
}

async function getByID(id) {
  
  return { data: korisnici.find( s => s.id === Number(id))}

}
//2/4  Crud CREATE

async function dodaj(korisnik) {
 
  if (korisnici.length === 0) {
    
    korisnik.id = 1
  } else {
    
    korisnik.id = korisnici[korisnici.length-1].id +1
  }
korisnici.push(korisnik)
}
//3/4 crUd UPDATE

async function promijeni(id, korisnik) {
  
  const index = nadiIndex(id)
  korisnici[index] = {...korisnici[index], ...korisnik}
}

function nadiIndex(id) {
  
  return korisnici.findIndex(s => s.id===Number(id))
}

async function obrisi(id) {
  
  const index = nadiIndex(id)
  korisnici.splice(index,1)
}

//4/4 cruD DELETE
export default {

  get,
  dodaj,
  getByID,
  promijeni,
  obrisi

}
