import { predmeti as pocetniPredmeti } from './predmetiData'; // Pretpostavka putanje do vaše datoteke s početnim podacima

// Ovdje držimo podatke u radnoj memoriji (RAM-u) aplikacije
let memorijaPredmeta = [...pocetniPredmeti];

async function get() {
  return { data: [...memorijaPredmeta] };
}

async function getByID(id) {
  const predmet = memorijaPredmeta.find(c => NUmber(c.id) === parseInt(id));
  return { data: predmet };
}

async function dodaj(predmet) {
  if (memorijaPredmeta.length === 0) {
    predmet.id = 1;
  } else {
    const maxId = Math.max(...memorijaPredmeta.map(c => c.id));
    predmet.id = maxId + 1;
  }

  memorijaPredmeta.push(predmet);
}

async function promijeni(id, predmet) {
  const index = memorijaPredmeta.findIndex(c =>Number( c.id) === parseInt(id));

  if (index !== -1) {
    memorijaPredmeta[index] = { ...memorijaPredmeta[index], ...predmet };
  }
}

async function obrisi(id) {
  memorijaPredmeta = memorijaPredmeta.filter(c => Number(c.id) !== parseInt(id));
}

async function dohvatiStranicu(stranica = 1, velicinaStranice = 12) {
  const pocetniIndex = (stranica - 1) * velicinaStranice;
  const zavrsniIndex = pocetniIndex + velicinaStranice; 
  const stranicenjePodatci = memorijaPredmeta.slice(pocetniIndex, zavrsniIndex); 
  const ukupnoStavki = memorijaPredmeta.length;
  const ukupnoStranica = Math.ceil(ukupnoStavki / velicinaStranice);
  
  return {
    data: stranicenjePodatci,
    ukupnoStranica: ukupnoStranica,
    ukupnoStavki: ukupnoStavki,
  };
}

export default {
  get,
  dodaj,
  getByID,
  promijeni,
  obrisi,
  dohvatiStranicu,
};