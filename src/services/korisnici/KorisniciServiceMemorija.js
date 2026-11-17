import { administratori } from './KorisniciData.js';
import bcrypt from 'bcryptjs';

async function get(){
    // Ne vraćamo lozinke u listi
    const administratoribezLozinke = administratori.map(op => ({
        id: op.id,
        email: op.email,
        uloga: op.uloga
    }))
    return {success: true, data: [...administratoribezLozinke]}
}

async function getById(id) {
  {
    const administrator = administratori.find(o => String(o.id) === String(id))
    if (!administrator) {
      return { success: false, data: null }
    }
    // Ne vraćamo lozinku
    return {
      success: true, data: {
        id: administrator.id,
        email: administrator.email,
        uloga: administrator.uloga
      }
    }
  }
}

// Sljedeći id = najveći postojeći + 1 (ne oslanja se na redoslijed u listi)
function sljedeciId() {
    const najveci = administratori.reduce((max, o) => Math.max(max, Number(o.id) || 0), 0)
    return String(najveci + 1)
}

async function dodaj(administrator){
    const email = String(administrator?.email ?? '').trim().toLowerCase()

    if (!email) {
        return { success: false, message: 'Email je obavezan' }
    }
    if (!administrator?.lozinka) {
        return { success: false, message: 'Lozinka je obavezna' }
    }

    // Provjera duplikata — isti email se ne smije registrirati dva puta
    const duplikat = administratori.some(
        (o) => String(o.email ?? '').trim().toLowerCase() === email
    )
    if (duplikat) {
        return { success: false, message: 'Korisnik s tim emailom već postoji' }
    }

    administrator.email = email
    administrator.id = sljedeciId()

    // Hashiraj lozinku prije spremanja
    administrator.lozinka = bcrypt.hashSync(administrator.lozinka, 10)

    administratori.push(administrator)
    return {success: true, data: {id: administrator.id, email: administrator.email}}
}
// 3/4 Update od CRUD
async function promijeni(id, administrator) {
    const index = nadiIndex(id)
    if (index === -1) {
        return {success: false, message: "Dministrator nije pronađen"}
    }
    
    // Ažuriraj email i ulogu, ne lozinku
    administratori[index] = {
        ...administratori[index], 
        email: administrator.email,
        uloga: administrator.uloga,
        id: id
    }
    
    return {success: true, data: {id: administratori[index].id, email: administratori[index].email, uloga: administratori[index].uloga}}
}
// Posebna funkcija za promjenu lozinke
async function promijeniLozinku(id, novaLozinka) {
    const index = nadiIndex(id)
    if (index === -1) {
        return {success: false, message: "Administrator nije pronađen"}
    }
    
    // Hashiraj novu lozinku
    administratori[index].lozinka = bcrypt.hashSync(novaLozinka, 10)
    
    return {success: true, message: "Lozinka uspješno promijenjena"}
}

function nadiIndex(id){
    return administratori.findIndex(o => String(o.id) === String(id))
}
  // 4/4 Delete od CRUD
async function obrisi(sifra) {
    const index = nadiIndex(sifra)
    if (index > -1) {
        administratori.splice(index, 1)
        return {success: true, message: "Administrator obrisan"}
    }
    return {success: false, message: "Administrator nije pronađen"}
}

// Funkcija za prijavu
async function prijava(email, lozinka) {
    const trazeniEmail = String(email ?? '').trim().toLowerCase()
    const administrator = administratori.find(
        (o) => String(o.email ?? '').trim().toLowerCase() === trazeniEmail
    )
    if (!administrator) {
        return {success: false, message: "Email i lozinka ne odgovaraju"} // iako bi ovdje mogli napisati i da email ne postoji ali to onda napadačima omogućuje da zna tko je a tko nije registriran
    }
    // Provjeri lozinku pomoću bcrypt
    const isMatch = bcrypt.compareSync(lozinka, administrator.lozinka)
    if (!isMatch) {
        return {success: false, message: "Email i lozinka ne odgovaraju"}
    }
    
    // Vrati administratora bez lozinke
    return {
        success: true, 
        data: {
            id: administrator.id,
            email: administrator.email,
            uloga: administrator.uloga
        }
    }
}

export default{
    get,
    dodaj,
    getById,
    promijeni,
    promijeniLozinku,
    obrisi,
    prijava
}
