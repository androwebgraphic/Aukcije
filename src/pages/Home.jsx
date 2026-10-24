import { Container } from "react-bootstrap";
import { APP_NAME } from "../constants";
import MenHighFive from '../assets/lottiefiles/Men High Five.json';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { Link } from "react-router-dom";
import Heading from "../components/UI/Heading";
import {Row,Col} from "react-bootstrap"
import {motion} from 'framer-motion'






export default function Home() {

  return (
    <>

        <Container >
     
          <Heading as='h1'> Dobro došli na {APP_NAME}</Heading>
          
  
          
         
        <Heading as='h2'> O nama</Heading>
                  <p>Ova aplikacija "{APP_NAME}" je namijenjena kolekcionarima  koji nešto žele kupiti ili prodati</p>
            <div className="upute">
              <p className='warn text-left'><strong>Pažljivo pročitajte <Link to="/Uvjeti"> Uvjete korištenja </Link> potvrdite <cite>"Prihvaćam</cite> kako ne bi došlo do neželjenih komplikacija</strong></p>
              <p className='warn text-left'>Isključivo je zabranjen bilo kakav oblik vrijeđanja na rasnoj, vjerskoj i nacionalnoj osnovi.<br></br>
                Svatko tko se ne bude pridžavao "Uvjeta korištenja" bit će mu blokiran a potom i uklonjen račun s Aukcija.
                      </p>
            </div>
        <Row>

          <Col xs={12} md={6}>
          
              <DotLottieReact
              data={MenHighFive}
              loop
              autoplay
              style={{ width: '13rem', height: '13rem', margin:'-5rem 0 0 30%', padding:"0", textAlign:"center"}}
              />
           
            
          </Col>
          <Col xs={12} md={6}>
            <p className="text-center" stylee={{margin:0}}>Sretno svima 😀</p>
          </Col>
</Row>
            </Container>
     

      
        
  </>
)
}