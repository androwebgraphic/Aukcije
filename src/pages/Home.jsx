import { Container } from "react-bootstrap";
import { APP_NAME } from "../constants";
import MenHighFive from '../assets/lottiefiles/Men High Five.json';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import {Player}  from "@lottiefiles/react-lottie-player"
import ControlledCarousel from "../components/ControlledCarousel";
import Heading from "../components/UI/Heading";


export default function Home() {
  return (
    <>
        <ControlledCarousel></ControlledCarousel>
      <Container>
       
        <Heading as='h1' className='display-1'>Dobro došli na {APP_NAME}</Heading>
     <Heading as='h1' className="display-4"> O nama</Heading> 
                <p>Ova aplikacija "{APP_NAME}" je namijenjena kolekcionarima  koji nešto žele kupiti ili prodati</p>

          <p className='warn'><strong>Pažljivo pročitajte Uvjete korištenja i potvrdite <cite>"Prihvaćam</cite> kako ne bi došlo do neželjenih komplikacija</strong></p>
      
          <p className='warn'>Isključivo je zabranjen bilo kakav oblik vrijeđanja na rasnoj, vjerskoj i nacionalnoj osnovi.<br></br>
            Svatko tko se ne bude pridžavao "Uvjeta korištenja" bit će mu blokiran a potom i uklonjen račun s Aukcija.
          </p>
        <p>Sretno svima 😀</p>
<DotLottieReact
        data={MenHighFive}
        loop
        autoplay
        style={{ width: '300px', height: '300px' }}
      />
  </Container>
  </>
)
}