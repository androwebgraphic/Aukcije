import bcrypt from 'bcryptjs'
import { korisnici as pocetniKorisnici, DEMO_LOZINKA } from './KorisniciData.js'

const STORAGE_KEY = 'korisnici' // ključ pod kojim se čuvaju podaci u local storage-u
const STORAGE_VERZIJA_KEY = 'korisnici-verzija'
// Povećaj kad se mijenja logika sjemenja/popravka.
const STORAGE_VERZIJA = 3
// Token sadrži i hash demo lozinke, pa promjena DEMO_LOZINKA u KorisniciData.js
// sama pokreće popravak demo računa - nema ručnog dizanja verzije.
const SJEME_TOKEN = `${STORAGE_VERZIJA}:${pocetniKorisnici[0]?.lozinka ?? ''}`

// Pomoćna funkcija za dohvaćanje podataka iz local storage-a.
//
// VAŽNO: local storage se sam ne puni. Ako ga nitko ne inicijalizira, lista je
// trajno prazna pa svaka prijava završava s "Email i lozinka ne odgovaraju".
// Zato pri prvom čitanju (ili pri promjeni STORAGE_VERZIJA) upisujemo demo
// korisnike iz KorisniciData.js. Verzija se pamti zato da se obrisani demo
// računi ne vraćaju pri svakom čitanju.
function dohvatiSveIzStorage() {
    const podaci = localStorage.getItem(STORAGE_KEY)
    const lista = podaci !== null ? JSON.parse(podaci) : []

    const spremljenaVerzija = localStorage.getItem(STORAGE_VERZIJA_KEY)
    if (spremljenaVerzija === SJEME_TOKEN) {
        return lista
    }

    const dopunjeno = dopuniPocetnimKorisnicima(lista)
    spremiUStorage(dopunjeno)
    localStorage.setItem(STORAGE_VERZIJA_KEY, SJEME_TOKEN)
    return dopunjeno
}

// Dodaje demo korisnike koji još ne postoje (po emailu) i popravlja one koje
// postoje, ali im lozinka nije DEMO_LOZINKA. Potonje je važno jer je u
// local storage-u mogao ostati račun s istim emailom i drugom lozinkom (npr.
// ranije kreiran kroz registraciju) pa kartice "Klikni za Admina/Korisnika"
// na formi za prijavu ne bi radile.
// Id-evi postojećih zapisa se ne diraju, a novi dobivaju slobodan id.
function dopuniPocetnimKorisnicima(lista) {
    const rezultat = lista.map(korisnik => ({ ...korisnik }))
    let najveciId = rezultat.reduce(
        (najveci, korisnik) => Math.max(najveci, parseInt(korisnik.id, 10) || 0),
        0
    )

    for (const pocetni of pocetniKorisnici) {
        const postojeci = rezultat.find(korisnik => korisnik.email === pocetni.email)

        if (!postojeci) {
            rezultat.push({ ...pocetni, id: String(++najveciId) })
            continue
        }

        if (!lozinkaOdgovara(DEMO_LOZINKA, postojeci.lozinka)) {
            postojeci.lozinka = pocetni.lozinka
        }
    }

    return rezultat
}

// bcrypt.compareSync baca izuzetak ako zapis nije ispravan bcrypt hash,
// pa to tretiramo kao "lozinka ne odgovara".
function lozinkaOdgovara(lozinka, hash) {
    if (typeof hash !== 'string' || hash.length !== 60) {
        return false
    }
    try {
        return bcrypt.compareSync(lozinka, hash)
    } catch {
        return false
    }
}

// Pomoćna funkcija za spremanje podataka
function spremiUStorage(podaci) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(podaci))
}

// 1/4 Read - dohvati sve
async function get() {
    const korisnici = dohvatiSveIzStorage()
    // Ne vraćamo lozinke u listi
    const korisniciBezcLozinki = korisnici.map(op => ({
        id: op.id,
        email: op.email,
        uloga: op.uloga
    }))
    return {success: true, data: [...korisniciBezcLozinki]}
}

// Dohvati jedan po šifri
async function getById(id) {
    const korisnici = dohvatiSveIzStorage()
    const korisnik = korisnici.find(o => o.id === id)
    if (!korisnik) {
        return {success: false, data: null}
    }
    // Ne vraćamo lozinku
    return {success: true, data: {
        id: korisnik.id,
        email: korisnik.email,
        uloga: korisnik.uloga
    }}
}

// 2/4 Create - dodaj novi
async function dodaj(korisnik) {
    const korisnici = dohvatiSveIzStorage()
    
    if (korisnici.length === 0) {
        korisnik.id = '1'
    } else {
        // Pronalaženje najveće šifre da izbjegnemo duplikate
        korisnik.id = String(parseInt(korisnici[korisnici.length - 1].id) + 1)
    }
    
    // Hashiraj lozinku prije spremanja
    korisnik.lozinka = bcrypt.hashSync(korisnik.lozinka, 10)
    
    korisnici.push(korisnik)
    spremiUStorage(korisnici)
    return {success: true, data: {id: korisnik.id, email: korisnik.email}}
}

// 3/4 Update - promijeni postojeći
async function promijeni(id, korisnik) {
    const korisnici = dohvatiSveIzStorage()
    const index = korisnici.findIndex(o => o.id === id)
    
    if (index === -1) {
        return {success: false, message: "korisnik nije pronađen"}
    }
    
    // Ažuriraj email i ulogu, ne lozinku
    korisnici[index] = {
        ...korisnici[index],
        email: korisnik.email,
        uloga: korisnik.uloga,
        id: id
    }
    spremiUStorage(korisnici)
    return {success: true, data: {id: korisnici[index].id, email: korisnici[index].email, uloga: korisnici[index].uloga}}
}

// Posebna funkcija za promjenu lozinke
async function promijeniLozinku(id, novaLozinka) {
    const korisnici = dohvatiSveIzStorage()
    const index = korisnici.findIndex(o => o.id === id)
    
    if (index === -1) {
        return {success: false, message: "korisnik nije pronađen"}
    }
    
    // Hashiraj novu lozinku
    korisnici[index].lozinka = bcrypt.hashSync(novaLozinka, 10)
    spremiUStorage(korisnici)
    
    return {success: true, message: "Lozinka uspješno promijenjena"}
}

// 4/4 Delete - obriši
async function obrisi(id) {
    let korisnici = dohvatiSveIzStorage()
    const initialLength = korisnici.length
    korisnici = korisnici.filter(o => o.id !== id)
    
    if (korisnici.length === initialLength) {
        return {success: false, message: "korisnik nije pronađen"}
    }
    
    spremiUStorage(korisnici)
    return {success: true, message: 'korisnik obrisan'}
}

// Funkcija za prijavu
async function prijava(email, lozinka) {
    const korisnici = dohvatiSveIzStorage()
    const korisnik = korisnici.find(o => o.email === email)
    if (!korisnik) {
        return {success: false, message: "Email i lozinka ne odgovaraju"} // iako bi ovdje mogli napisati i da email ne postoji ali to onda napadačima omogućuje da zna tko je a tko nije registriran
    }
    
    // Provjeri lozinku pomoću bcrypt
    const isMatch = bcrypt.compareSync(lozinka, korisnik.lozinka)
    if (!isMatch) {
        return {success: false, message: "Email i lozinka ne odgovaraju"}
    }
    
    // Vrati korisnika bez lozinke
    return {
        success: true, 
        data: {
            id: korisnik.id,
            email: korisnik.email,
            uloga: korisnik.uloga
        }
    }
}

export default {
    get,
    dodaj,
    getById,
    promijeni,
    promijeniLozinku,
    obrisi,
    prijava
}
