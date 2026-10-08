const STORAGE_KEY = 'kategorije'

function dohvatiSveIzStorage() {
  const podatci = localStorage.getItem(STORAGE_KEY)
  return podatci ? JSON.parse(podatci) : []
}

function spremiUStorage(podatci) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(podatci))
}

async function get() {
  const kategorije = dohvatiSveIzStorage()
  return { data: [...kategorije] }
}

async function getByID(id) {
  const kategorije = dohvatiSveIzStorage()
  const kategorija = kategorije.find(c=> c.id === parseInt(id))
  return { data: kategorija }
}

async function dodaj(kategorija) {
  const kategorije = dohvatiSveIzStorage()
  if (kategorije.length === 0) {
    kategorija.id = 1
  } else {
    const maxId = Math.max(...kategorije.map(c=> c.id))
    kategorija.id = maxId + 1
  }

  kategorije.push(kategorija)
  spremiUStorage(kategorije)
}

async function promijeni(id, kategorija) {
  const kategorije = dohvatiSveIzStorage()
  const index = kategorije.findIndex(c => c.id === parseInt(id))

  if (index !== -1) {
    kategorije[index] = { ...kategorije[index], ...kategorija }
    spremiUStorage(kategorije)
  }
}

async function obrisi(id) {
  let kategorije = dohvatiSveIzStorage()
  kategorije = kategorije.filter(c => c.id !== parseInt(id))
  spremiUStorage(kategorije)
}

export default {
  get,
  dodaj,
  getByID,
  promijeni,
  obrisi
}