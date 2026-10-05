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

  // 2. Dodavanje novog objekta `car` u polje `cars`
  auti.push(auto);

  // 3. Vraćanje odgovora
  return { data: auto };
}

export default {
  get,
  dodaj,
};