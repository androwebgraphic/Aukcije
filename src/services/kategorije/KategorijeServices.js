import { kategorije } from './KategorijeData'


//1/4 READ od CRUD
async function get() {
  
  return {data: [...kategorije]}
}

async function getByID(id) {
  
  return {
    
    data: kategorije.find( s => s.id === parseInt(id))
  }

}
//2/4 CREATE od CRUD

async function dodaj(kategorija) {
  
  if (kategorije.length === 0) {
    
    kategorija.id = 1
  } else {
    
    kategorija.id = kategorija[kategorija.length-1].id +1
  }
kategorije.push(kategorija)
}
export default {

  get,
  dodaj,
  getByID,
}