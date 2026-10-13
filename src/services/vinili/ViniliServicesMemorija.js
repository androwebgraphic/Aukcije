import vinili from './ViniliData'


//1/4 cRud READ
async function get() {
  
  return {data: [...vinili]}
}

async function getByID(id) {
  
  return { data: vinili.find( s => s.id === parseInt(id))}

}
//2/4  Crud CREATE

async function dodaj(vinil) {
 
  if (vinili.length === 0) {
    
    vinil.id = 1
  } else {
    
    vinil.id = vinili[vinili.length-1].id +1
  }
vinili.push(vinil)
}
//3/4 crUd UPDATE

async function promijeni(id, vinil) {
  
  const index = nadiIndex(id)
  vinili[index] = {...vinili[index], ...vinil}
}

function nadiIndex(id) {
  
  return vinili.findIndex(s => s.id===parseInt(id))
}

async function obrisi(id) {
  
  const index = nadiIndex(id)
  vinili.splice(index,1)
}

//4/4 cruD DELETE
export default {

  get,
  dodaj,
  getByID,
  promijeni,
  obrisi

}
