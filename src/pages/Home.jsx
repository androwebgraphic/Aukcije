import { Container } from "react-bootstrap";
import { APP_NAME } from "../constants";
import MenHighFive from '../assets/lottiefiles/Men High Five.json';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { Link } from "react-router-dom";
import Heading from "../components/UI/Heading";
import {Row,Col} from "react-bootstrap"
import { useState, useEffect } from "react";
import { Card } from "react-bootstrap";

import  KategorijeServices  from "../services/kategorije/KategorijeServices"
import  PredmetiServices  from "../services/predmeti/PredmetiServices"
import KorisniciServices from "../services/korisnici/KorisniciServices"



// import {motion} from 'framer-motion'






export default function Home() {

  const [brojKategorija, setBrojKategorija] = useState(0)
  const [brojPredmeta, setBrojPredmeta] = useState(0)
  const [brojKorisnika, setBrojKorisnika] = useState(0)
  
  const [animatedKategorije, setAnimatedKategorie] = useState(0)
  const [animatedsPredmeti, setAnimatedPredmeti] = useState(0)
  const [animatedKorisnici, setAnimatedKorisnici] = useState(0)

  
  useEffect(() => {
    
    const fetchData = async () => {
      

      try {
        const kategorijeRezultat = await KategorijeServices.get()
        const predmetiRezultat = await PredmetiServices.get()
        const korisniciRezultat = await KorisniciServices.get()

        setBrojKategorija(kategorijeRezultat.data.length)
        setBrojPredmeta(predmetiRezultat.data.length)
        setBrojKorisnika(korisniciRezultat.data.length)
        


      } catch {
        
console.error("GHreška pri dohvaćanju podataka")

      }
    }
  
   
fetchData()

}, [])


  useEffect(() => {
   
    if (animatedKategorije < brojKategorija) {
      
      const timer = setTimeout(() => {
        setAnimatedKategorie(prev =>Math.min(prev + 1,brojKategorija))
      }, 200)
      return () => clearTimeout(timer)
    }
 }, [animatedKategorije, brojKategorija])


  useEffect(() => {
    
    if (animatedsPredmeti < brojPredmeta) {
      
      const timer = setTimeout(() => {

        setAnimatedPredmeti(prev => Math.min(prev + 1, brojPredmeta))
      }, 60)
      return () => clearTimeout(timer)
    }

  }, [animatedsPredmeti, brojPredmeta])


  useEffect(() => {
    
    if (animatedKorisnici < brojKorisnika) {
      const timer = setTimeout(() => {

        setAnimatedKorisnici(prev => Math.min(prev + 1,brojKorisnika))
      }, 100)
      return () => clearTimeout(timer)
      
    }
  }, [animatedKorisnici, brojKorisnika] )




  return (
    <>

  
         <Heading as='h1'> Dobro došli na {APP_NAME}</Heading>
            
            
                     
                    <Heading as='h2'> O nama</Heading>
          <Row>
     
          <Col xs={12} md={8}>
           
                    <p>Ova aplikacija "{APP_NAME}" je namijenjena kolekcionarima  koji nešto žele kupiti ili prodati</p>
              <div className="upute">
                <p className='warn text-left'><strong>Pažljivo pročitajte <Link to="/Uvjeti"> Uvjete korištenja </Link> potvrdite <cite>"Prihvaćam</cite> kako ne bi došlo do neželjenih komplikacija</strong></p>
                <p className='warn text-left'>Isključivo je zabranjen bilo kakav oblik vrijeđanja na rasnoj, vjerskoj i nacionalnoj osnovi.<br></br>
                  Svatko tko se ne bude pridžavao "Uvjeta korištenja" bit će mu blokiran a potom i uklonjen račun s Aukcija.
                        </p>
              </div>
          </Col>
          <Col  xs={12} md={3}>
 <Card className="mb-3 shadow-lg border-0 info" >

               <Heading as='h2'>Info</Heading>
                        <Card.Body className="text-center">
                       <Heading as='h3'>Kategorije</Heading>
                            <div className="entitet">
                                <p style={{borderBottom:".1rem solid #3561da"}}>{animatedKategorije}</p>
                            </div>

         

               
                     
                       <Heading as='h3'>Predmeti</Heading>
                            <div className="entitet">
                  <p style={{ borderBottom: ".1rem solid #3561da" }}>{animatedsPredmeti}</p>
               
                    <Heading as='h3'>Korisnici</Heading>
                            <div className="entitet">
                    <p style={{ borderBottom: ".1rem solid #3561da" }}>{animatedKorisnici}</p>
                            </div>
                </div>
            
                        </Card.Body>
            </Card>
            </Col>
          </Row>
          <Row>
       
          
              <DotLottieReact
              data={MenHighFive}
              loop
              autoplay
              style={{ width: '13rem', height: '13rem', margin:'-5.5rem 0 0 30%', padding:"0", textAlign:"center", zIndex:"9999"}}
              />
           
      
        
            <p className="text-center" stylee={{margin:"2rem"}}>Sretno svima 😀</p>
       

        
</Row>
          
     

      
        
  </>
)
}