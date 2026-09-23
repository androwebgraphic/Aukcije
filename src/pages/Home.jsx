import { APP_NAME } from "../constants";



export default function Home() {
  return (
  <>
      <h1>Dobro došli na {APP_NAME}</h1>
      <h2>O nama </h2>
                <p>Ova aplikacija "{APP_NAME}" je namijenjena kolekcionarima  koji nešto žele kupiti ili prodati</p>

          <p className='warn'><strong>Pažljivo pročitajte Uvjete korištenja i potvrdite <cite>"Slažem se"</cite> kako ne bi došlo do neželjenih komplikacija</strong></p>
      
          <p className='warn'>Isključivo je zabranjen bilo kakav oblik vrijeđanja na rasnoj, vjerskoj i nacionalnoj osnovi<br></br>
            Svatko tko se ne bude pridžavao "Uvjeta korištenja" bit će mu blokiran a potom i uklonjen račun s Aukcija.
          </p>
          <p>Sretno svima 😀</p>
  
  </>
)
}