import { auti } from "../../services/kategorije/AutiData";

// READ (Svi auti)
async function get() {
  return { data: [...auti] };
}

// READ (Jedan auto po ID-u) - OVO JE NEDOSTAJALO!
async function getByID(id) {
  const auto = auti.find((a) => a.id == id);
  return { data: auto };
}

// CREATE
async function dodaj(auto) {
  if (auti.length === 0) {
    auto.id = 1; // Ispravljeno veliko 'I' u malo 'i'
  } else {
    auto.id = auti[auti.length - 1].id + 1;
  }

  auti.push(auto);
  return { data: auto };
}

// UPDATE
async function promijeni(id, auto) {
  const index = nadiIndex(id);
  if (index !== -1) {
    auti[index] = { ...auti[index], ...auto };
  }
  return { data: auti[index] };
}

// Pomoćna funkcija za pronalazak indeksa
function nadiIndex(id) {
  // findIndex traži funkciju (a => a.id == id)
  return auti.findIndex((a) => a.id == id);
}

// Eksportiraj sve funkcije uključujući i getByID
export default {
  get,
  getByID,
  dodaj,
  promijeni,
};