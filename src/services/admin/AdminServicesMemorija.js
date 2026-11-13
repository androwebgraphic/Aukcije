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

