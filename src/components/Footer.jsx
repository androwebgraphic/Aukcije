import { DATA_SOURCE,APP_NAME, RouteNames } from "../constants";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Nav from 'react-bootstrap/Nav';


import ScrollToTopButton from "./ScrollToTopButton";

function Footer() {
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();


  return (
    <>
    <footer>
          <Nav>
              <Nav.Link onClick={() => { navigate(RouteNames.UVJETI); }}>
                 Uvjeti korištenja
             
                </Nav.Link>
          </Nav>
      <p className="copy">&copy; {APP_NAME} Sva prava pridržana {currentYear}.</p>
      

 <p className="storage">{DATA_SOURCE}</p> 
      <ScrollToTopButton></ScrollToTopButton>

       
    </footer >
  </>
  );
}

export default Footer;