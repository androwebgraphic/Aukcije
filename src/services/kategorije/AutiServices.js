import { auti } from "../../services/kategorije/AutiData";

// 1/4 READ od CRUD
async function get() {
  return { data: [...auti] };
}

// 2/4 CREATE od CRUD
async function dodaj(auto) {
  // 1. Izračun novog ID-a na temelju polja `cars`
  if (auti.length === 0) {
    auto.id = 1;
  } else {
    auto.id = auti[auti.length - 1].id + 1;
  }


  auti.push(auto);


  return { data: auto };
}

async function promijeni(id, auto) {
  
  const index = nadiIndex(id)
  auti[index] = {...auti[index], ...auto}
}

function nadiIndex(id) {
  
  return auti.findIndex(s => s.id===parseInt(id))
}

export default {
  get,
  dodaj,
  promijeni,
};