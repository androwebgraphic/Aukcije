const STORAGE_KEY = 'korisnici'

function dohvatiSveIzStorage() {
  const podatci = localStorage.getItem(STORAGE_KEY)
  return podatci ? JSON.parse(podatci) : []
}

function spremiUStorage(podatci) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(podatci))
}

async function get() {
  const korisnici = dohvatiSveIzStorage()
  return { data: [...korisnici] }
}

async function getByID(id) {
  const korisnici = dohvatiSveIzStorage()
  const korisnik = korisnici.find(c=> c.id ===Number(id))
  return { data: korisnik }
}

async function dodaj(korisnik) {
  const korisnici = dohvatiSveIzStorage()
  if (korisnici.length === 0) {
    korisnik.id = 1
  } else {
    const maxId = Math.max(...korisnici.map(c=> Number(c.id)))
    korisnik.id = maxId + 1
  }

  korisnici.push(korisnik)
  spremiUStorage(korisnici)
}

async function promijeni(id, korisnik) {
  const korisnici = dohvatiSveIzStorage()
  const index = korisnici.findIndex(c => c.id === parseInt(id))

  if (index !== -1) {
    korisnici[index] = { ...korisnici[index], ...korisnik }
    spremiUStorage(korisnici)
  }
}

async function obrisi(id) {
  let korisnici = dohvatiSveIzStorage()
  korisnici = korisnici.filter(c=> c.id !== parseInt(id))
  spremiUStorage(korisnici)
}

export default {
  get,
  dodaj,
  getByID,
  promijeni,
  obrisi
}