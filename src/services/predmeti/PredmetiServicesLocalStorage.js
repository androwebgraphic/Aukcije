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
  const predmet = predmeti.find(c=> c.id === parseInt(id))
  return { data: predmet }
}

async function dodaj(predmet) {
  const predmeti = dohvatiSveIzStorage()
  if (predmeti.length === 0) {
    predmet.id = 1
  } else {
    const maxId = Math.max(...predmeti.map(c=> c.id))
    predmet.id = maxId + 1
  }

  predmeti.push(predmet)
  spremiUStorage(predmeti)
}

async function promijeni(id, predmet) {
  const predmeti = dohvatiSveIzStorage()
  const index = predmeti.findIndex(c => c.id === parseInt(id))

  if (index !== -1) {
    predmeti[index] = { ...predmeti[index], ...predmet }
    spremiUStorage(predmeti)
  }
}

async function obrisi(id) {
  let predmeti = dohvatiSveIzStorage()
  predmeti = predmeti.filter(c=> c.id !== parseInt(id))
  spremiUStorage(predmeti)
}

export default {
  get,
  dodaj,
  getByID,
  promijeni,
  obrisi
}