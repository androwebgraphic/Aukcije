import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import KorisniciService from "../../services/korisnici/KorisniciService"
import { Form, Button, Row, Col, Card } from "react-bootstrap"
import { RouteNames } from "../../constants"
import {z} from "zod"

export default function KorisniciPromijena() {

  const navigate = useNavigate()
  const params = useParams()
  const [korisnik, setKorisnik] = useState({})
  const [errors, setErros] = useState({})
  
 const ShemaEmailUloga = z.object({
        email: z.string()
            .trim()
            .min(1, "Email je obavezan!")
            .email("Unesite ispravan email format!"),
        uloga: z.enum(['admin', 'korisnik'], {
            errorMap: () => ({ message: "Uloga mora biti 'admin' ili 'korisnik'!" })
        })
    })

  useEffect(() => {
    
    ucitajKorisnika()
  },[])

  async function ucitajKorisnika() {
  
    const odgovor = await KorisniciService.getById(params.id)

    if (!odgovor.success) {
      
      alert('Korisnik nije pronadjen')
      navigate(RouteNames.KORISNICI)
      return
    }
    setKorisnik(odgovor.data)
  
  }

  async function promijeniKorisnika() {
    
    const rezultat = await KorisniciService.promijeni(params.id, korisnik)

    if (!rezultat.success) {
      
      navigate(RouteNames.KORISNICI)
    } else {
      
      alert(rezultat.message || 'Greska pri promijeni Korisnika')
    }
  }

  function handleSubmit(e) {
    
    e.preventDefault()

    const podatci = new FormData(e.target)

    setErrors({})

    const objektPodataka = Object.fromEntries(podatci)

    const rezultat = SchemaUlogeEmail.safeParse(objektPodataka)

    if (!rezultat.success) {
      
      const noveGresks = {}

      rezultat.error.issues.forEach((issue) => {
        
        const kljuc = issue.path[0]
        if (!noveGreske[kljuc]) {
          
          noveGreske[kljuc] = issue.message
        }
      })
      setErrors(noveGreske)
      return
    }
    promijeni(
      {
      
        email: podatci.get('email'),
        uloga: podatci.get('uloga')
    })
}
  
  const ocistiGresku = (nazivPolja) => {
    
    if (errors[nazivPolja]) {
      
      const noveGreske = { ...errors }
      delete noveGreske[nazivPolja]
      setErrors(noveGreske)
    }
  }






  
}