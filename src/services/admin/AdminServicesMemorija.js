import { administratori } from './AdminData.js';
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
    const administrator = administratori.find(o => o.id === id)
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

async function dodaj(administrator){
    if(administratori.length===0){
        administrator.id='1'
    }else{
        administrator.id = String(parseInt(administratori[administratori.length - 1].id) + 1)
    }
    
    // Hashiraj lozinku prije spremanja
    administrator.lozinka = bcrypt.hashSync(administrator.lozinka, 10)
    
    administratori.push(administrator)
    return {success: true, data: {id: administrator.id, email: administrator.email}}
}
// 3/4 Update od CRUD
async function promjeni(id, administrator) {
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
async function promjeniLozinku(id) {
    const index = nadiIndex(id)
    if (index === -1) {
        return {success: false, message: "Administrator nije pronađen"}
    }
    
    // Hashiraj novu lozinku
    administratori[index].lozinka = bcrypt.hashSync(novaLozinka, 10)
    
    return {success: true, message: "Lozinka uspješno promijenjena"}
}

function nadiIndex(id){
    return administratori.findIndex(o=>o.id  === id)
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
    const administrator = administratori.find(o => o.email === email)
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
    promjeni,
    promjeniLozinku,
    obrisi,
    prijava
}
