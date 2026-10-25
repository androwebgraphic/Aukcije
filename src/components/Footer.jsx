import { DATA_SOURCE,APP_NAME, RouteNames } from "../constants";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Nav from 'react-bootstrap/Nav';




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
      

 <p className="storage"><span>Koristi se:</span>{DATA_SOURCE}</p> 
     

       
    </footer >
  </>
  );
}

export default Footer;