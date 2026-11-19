import { korisnici } from './KorisniciData.js';
import bcrypt from 'bcryptjs';

async function get(){
    // Ne vraćamo lozinke u listi
    const korisniciBezLozinke = korisnici.map(op => ({
        id: op.id,
        email: op.email,
        uloga: op.uloga
    }))
    return {success: true, data: [...korisniciBezLozinke]}
}

async function getById(id) {
  {
    const korisnik = korisnici.find(o => o.id === id)
    if (!korisnik) {
      return { success: false, data: null }
    }
    // Ne vraćamo lozinku
    return {
      success: true, data: {
        id: korisnik.id,
        email: korisnik.email,
        uloga: korisnik.uloga
      }
    }
  }
}

async function dodaj(korisnik){
    if(korisnici.length===0){
        korisnik.id='1'
    }else{
        korisnik.id = String(parseInt(korisnici[korisnici.length - 1].id) + 1)
    }
    
    // Hashiraj lozinku prije spremanja
    korisnik.lozinka = bcrypt.hashSync(korisnik.lozinka, 10)
    
    korisnici.push(korisnik)
    return {success: true, data: {id: korisnik.id, email: korisnik.email}}
}
// 3/4 Update od CRUD
async function promijeni(id, korisnik) {
    const index = nadiIndex(id)
    if (index === -1) {
        return {success: false, message: "Dministrator nije pronađen"}
    }
    
    // Ažuriraj email i ulogu, ne lozinku
    korisnici[index] = {
        ...korisnici[index], 
        email: korisnik.email,
        uloga: korisnik.uloga,
        id: id
    }
    
    return {success: true, data: {id: korisnici[index].id, email: korisnici[index].email, uloga: korisnici[index].uloga}}
}
// Posebna funkcija za promjenu lozinke
async function promijeniLozinku(id, novaLozinka) {
    const index = nadiIndex(id)
    if (index === -1) {
        return {success: false, message: "korisnik nije pronađen"}
    }
    
    // Hashiraj novu lozinku
    korisnici[index].lozinka = bcrypt.hashSync(novaLozinka, 10)
    
    return {success: true, message: "Lozinka uspješno promijenjena"}
}

function nadiIndex(id){
    return korisnici.findIndex(o=>o.id  === id)
}
  // 4/4 Delete od CRUD
async function obrisi(id) {
    const index = nadiIndex(id)
    if (index > -1) {
        korisnici.splice(index, 1)
        return {success: true, message: "korisnik obrisan"}
    }
    return {success: false, message: "korisnik nije pronađen"}
}

// Funkcija za prijavu
async function prijava(email, lozinka) {
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

export default{
    get,
    dodaj,
    getById,
    promijeni,
    promijeniLozinku,
    obrisi,
    prijava
}
