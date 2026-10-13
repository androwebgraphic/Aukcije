const STORAGE_KEY = 'vinili'

function dohvatiSveIzStorage() {
  const podatci = localStorage.getItem(STORAGE_KEY)
  return podatci ? JSON.parse(podatci) : []
}

function spremiUStorage(podatci) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(podatci))
}

async function get() {
  const vinili = dohvatiSveIzStorage()
  return { data: [...vinili] }
}

async function getByID(id) {
  const vinili = dohvatiSveIzStorage()
  const vinil = vinili.find(c=> c.id === parseInt(id))
  return { data: vinil }
}

async function dodaj(vinil) {
  const vinili = dohvatiSveIzStorage()
  if (vinili.length === 0) {
    vinil.id = 1
  } else {
    const maxId = Math.max(...vinili.map(c=> c.id))
    vinil.id = maxId + 1
  }

  vinili.push(vinil)
  spremiUStorage(vinili)
}

async function promijeni(id, vinil) {
  const vinili = dohvatiSveIzStorage()
  const index = vinili.findIndex(c => c.id === parseInt(id))

  if (index !== -1) {
    vinili[index] = { ...vinili[index], ...vinil }
    spremiUStorage(vinili)
  }
}

async function obrisi(id) {
  let vinili = dohvatiSveIzStorage()
  vinili = vinili.filter(c=> c.id !== parseInt(id))
  spremiUStorage(vinili)
}

export default {
  get,
  dodaj,
  getByID,
  promijeni,
  obrisi
}