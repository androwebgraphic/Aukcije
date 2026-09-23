import 'bootstrap/dist/css/bootstrap.min.css';
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";

import './App.css';
import { Container } from 'react-bootstrap';
import { RouteNames } from './constants.js';
import {Route, Routes } from 'react-router-dom';
import Home from './pages/Home.jsx';
import CategoriesList from './pages/CategoriesList.jsx';
import Register from './pages/Register.jsx';
import Login from './pages/Login.jsx';
import AddItem from './pages/AddItem.jsx';

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
          <Route path={RouteNames.ADDITEM} element={<AddItem />}/>
  

          </Routes>

       



      </Container>
      <Footer />
    </>
  )
}

export default App
