const STORAGE_KEY = 'auti'

function dohvatiSveIzStorage() {
  const podatci = localStorage.getItem(STORAGE_KEY)
  return podatci ? JSON.parse(podatci) : []
}

function spremiUStorage(podatci) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(podatci))
}

async function get() {
  const auti = dohvatiSveIzStorage()
  return { data: [...auti] }
}

async function getByID(id) {
  const auti = dohvatiSveIzStorage()
  const auto = auti.find(c=> c.id === parseInt(id))
  return { data: auto }
}

async function dodaj(auto) {
  const auti = dohvatiSveIzStorage()
  if (auti.length === 0) {
    auto.id = 1
  } else {
    const maxId = Math.max(...auti.map(c=> c.id))
    auti.id = maxId + 1
  }

  auti.push(auto)
  spremiUStorage(auti)
}

async function promijeni(id, auto) {
  const auti = dohvatiSveIzStorage()
  const index = auti.findIndex(c => c.id === parseInt(id))

  if (index !== -1) {
    auti[index] = { ...auti[index], ...auto }
    spremiUStorage(auti)
  }
}

async function obrisi(id) {
  let auti = dohvatiSveIzStorage()
  auti = auti.filter(c => c.id !== parseInt(id))
  spremiUStorage(auti)
}

export default {
  get,
  dodaj,
  getByID,
  promijeni,
  obrisi
}