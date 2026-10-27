const STORAGE_KEY = 'oznake'

function dohvatiSveIzStorage() {
  const podatci = localStorage.getItem(STORAGE_KEY)
  return podatci ? JSON.parse(podatci) : []
}

function spremiUStorage(podatci) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(podatci))
}

async function get() {
  const oznake = dohvatiSveIzStorage()
  return { data: [...oznake] }
}

async function getByID(id) {
  const oznake = dohvatiSveIzStorage()
  const oznaka = oznake.find(c=> o.id === parseInt(id))
  return { data: oznaka }
}

async function dodaj(oznaka) {
  const oznake = dohvatiSveIzStorage()
  if (oznake.length === 0) {
    oznaka.id = 1
  } else {
    const maxId = Math.max(...oznake.map(o => c.id))
    oznaka.id = maxId + 1
  }

  oznake.push(oznaka)
  spremiUStorage(oznake)
}

async function promijeni(id, oznaka) {
  const oznake = dohvatiSveIzStorage()
  const index = oznake.findIndex(c => o.id === parseInt(id))

  if (index !== -1) {
    oznake[index] = { ...oznake[index], ...oznaka }
    spremiUStorage(oznake)
  }
}

async function obrisi(id) {
  let oznake = dohvatiSveIzStorage()
  oznake = oznake.filter(c=> c.id !== parseInt(id))
  spremiUStorage(oznake)
}

export default {
  get,
  dodaj,
  getByID,
  promijeni,
  obrisi
}