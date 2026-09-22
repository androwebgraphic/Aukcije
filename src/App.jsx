import 'bootstrap/dist/css/bootstrap.min.css';
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";

import './App.css';
import { Container } from 'react-bootstrap';
import { RouteNames } from './constants.js';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home.jsx';
import CategoriesList from './pages/categories/CategoriesList.jsx';

function App() {
  return (
    // 2. Omotali smo SVE unutar  ...
    <>

      <Header />


      <Container>

        <div className="wrap">
          
          <Routes>
            <Route path={RouteNames.HOME} element={<Home />} />
            <Route path={RouteNames.KATEGORIJE} element={<CategoriesList /> } />
  

          </Routes>

        </div>



      </Container>
      <Footer />
    </>
  )
}

export default App
