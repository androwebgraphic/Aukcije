const STORAGE_KEY = 'predmeti'

function dohvatiSveIzStorage() {
  const podatci = localStorage.getItem(STORAGE_KEY)
  return podatci ? JSON.parse(podatci) : []
}

function spremiUStorage(podatci) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(podatci))
}

async function get() {
  const predmeti = dohvatiSveIzStorage()
  return { data: [...predmeti] }
}

async function getByID(id) {
  const predmeti = dohvatiSveIzStorage()
  const predmet = predmeti.find(c=> Number(c.id) === parseInt(id))
  return { data: predmet }
}

async function dodaj(predmet) {
  const predmeti = dohvatiSveIzStorage()
  if (predmeti.length === 0) {
    predmet.id = 1
  } else {
    const maxId = Math.max(...predmeti.map(c=>Number( c.id)))
    predmet.id = maxId + 1
  }

  predmeti.push(predmet)
  spremiUStorage(predmeti)
}

async function promijeni(id, predmet) {
  let predmeti = dohvatiSveIzStorage();
  
  const azuriraniPredmeti = predmeti.map(c => {
    const trenutniId = String(c.id || c.sifra);
    const trazeniId = String(id);
    
    if (trenutniId === trazeniId) {
      return { ...c, ...predmet };
    }
    return c;
  });

  spremiUStorage(azuriraniPredmeti);
  return { data: azuriraniPredmeti }; // Vraćamo cijeli ažurirani niz!
}

async function obrisi(id) {
  let predmeti = dohvatiSveIzStorage()
  predmeti = predmeti.filter(c=> c.id !== parseInt(id))
  spremiUStorage(predmeti)
}

async function dohvatiStranicu(stranica = 1, velicinaStranice = 12) {
  const predmeti = dohvatiSveIzStorage()
  const pocetniIndex = (stranica - 1) * velicinaStranice
  const zavrsniIndex = pocetniIndex + velicinaStranice // Ispravljeno
  const stranicenjePodatci = predmeti.slice(pocetniIndex, zavrsniIndex) // Ispravljeno iz predmet u predmeti
  const ukupnoStavki = predmeti.length
  const ukupnoStranica = Math.ceil(ukupnoStavki / velicinaStranice)
  
  return {
    data: stranicenjePodatci,
    ukupnoStranica: ukupnoStranica,
    ukupnoStavki: ukupnoStavki,
  }
}

export default {
  get,
  dodaj,
  getByID,
  promijeni,
  obrisi,
  dohvatiStranicu,
}