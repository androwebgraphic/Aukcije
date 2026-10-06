import 'bootstrap/dist/css/bootstrap.min.css';
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";

import './App.css';
import {  Container } from 'react-bootstrap';
import { RouteNames } from './constants.js';
import {Route, Routes } from 'react-router-dom';
import Home from './pages/Home.jsx';
import KategorijaList from './/pages/KategorijaList.jsx'
import Registracija from './pages/Registracija.jsx';
import Logiranje from './pages/Logiranje.jsx';
import KategorijaNova from './pages/kategorije/KategorijaNova.jsx';

import Uvjeti from './pages/Uvjeti.jsx';
import AutiList from './pages/kategorije/auti/AutiLista.jsx';
import AutoNovi from './pages/kategorije/auti/AutoNovi.jsx';
import AutiPromijena from './pages/kategorije/auti/AutiPromjena.jsx';

import { MdOutlineVerticalAlignTop } from "react-icons/md";
import KategorijePromijena from '././pages/kategorije/KategorijePromjena.jsx'







function App() {
  return (
  
    <>

      <Header/>


      <Container>

   
          
          <Routes>
            <Route path={RouteNames.HOME} element={<Home />} />
          <Route path={RouteNames.KATEGORIJE} element={<KategorijaList />} />
                  <Route path={RouteNames.KATEGORIJA_NOVA} element={<KategorijaNova />} />
            <Route path={RouteNames.REGISTRACIJA} element={<Registracija />} />
          <Route path={RouteNames.LOGIRANJE} element={<Logiranje />} />
          <Route path={RouteNames.AUTI} element={<AutiList />} />
          <Route path={RouteNames.AUTI_NOVI} element={<AutoNovi />} />
          <Route path={RouteNames.AUTI_PROMJENA} element={<AutiPromijena />} />
          <Route path={RouteNames.KATEGORIJE_PROMJENA} element={<KategorijePromijena />} />
  
          <Route path={RouteNames.UVJETI} element={<Uvjeti /> } />
          </Routes>

     
        {/* <Carousel></Carousel> */}
 
   
      </Container>
    
      <Footer>


      </Footer>
    </>
  )
}

export default App
