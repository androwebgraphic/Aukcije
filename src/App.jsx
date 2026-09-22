import 'bootstrap/dist/css/bootstrap.min.css'
import Header from "./components/Header.jsx"
import  Footer from "./components/Footer.jsx"


import './App.css'
import { Container} from 'react-bootstrap'
import { APP_NAME, RouteNames } from './constants.js'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home.jsx'
import CategoriesList from './pages/categories/CategoriesList.jsx'

function App() {
 

  return (
    <> 
   
   <Header></Header>
  
    
      <Container>
        
        <div className="wrap">
          <h1>Dobro došli na {APP_NAME}</h1>
          <p className='warn'><strong>Pažljivo pročitajte Uvjete korištenja i potvrdite <cite>"Slažem se"</cite> kako ne bi došlo do neželjenih komplikacija</strong></p>
          <h2>O nama </h2>
          <p>Ova aplikacija {APP_NAME} je namijenjena kolekcionarima  koji nešto žele kupiti ili prodati</p>
          <p className='warn'>Isključivo je zabranjen bilo kakav oblik vrijeđanja na rasnoj, vjerskoj i nacionalnoj osnovi<br></br>
          Svatko tko se ne bude pridžavao "Uvjeta korištenja" bit će mu blokiran a potom i uklonjen račun s Aukcija.
          </p>
          <p>Sretno svima 😀</p>
          <Routes>
            <Route path={RouteNames.HOME} element={<Home />} />
            <Route path={RouteNames.KATEGORIJE} element={<CategoriesList /> } />
  

          </Routes>
         
        </div>


     
</Container>
      <Footer></Footer>
    </>
  )
}

export default App
