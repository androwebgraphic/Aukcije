import 'bootstrap/dist/css/bootstrap.min.css';
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";

import './App.css';
import { Carousel, Container } from 'react-bootstrap';
import { RouteNames } from './constants.js';
import {Route, Routes } from 'react-router-dom';
import Home from './pages/Home.jsx';
import CategoriesList from './pages/CategoriesList.jsx';
import Register from './pages/Register.jsx';
import Login from './pages/Login.jsx';
import AddItem from './pages/AddItem.jsx';
import CategoryNew from './pages/categories/CategoryNew.jsx';
import ControlledCarousel from './components/ControlledCarousel.jsx';
import Uvjeti from './pages/Uvjeti.jsx';
import CarsList from './pages/categories/cars/CarsList.jsx';
import CarNew from './pages/categories/cars/CarNew.jsx';






function App() {
  return (
  
    <>

      <Header />


      <Container>

   
          
          <Routes>
            <Route path={RouteNames.HOME} element={<Home />} />
            <Route path={RouteNames.KATEGORIJE} element={<CategoriesList />} />
            <Route path={RouteNames.REGISTRACIJA} element={<Register />} />
          <Route path={RouteNames.LOGIRANJE} element={<Login />} />
          <Route path={RouteNames.CARS} element={<CarsList />} />
          <Route path={RouteNames.CAR_NEW} element={<CarNew />} />
          <Route path={RouteNames.CATEGORY_NEW} element={<CategoryNew />} />
  
          <Route path={RouteNames.UVJETI} element={<Uvjeti /> } />
          </Routes>

     
        {/* <Carousel></Carousel> */}
       
 

      </Container>
      <Footer />
    </>
  )
}

export default App
