import { DATA_SOURCE,APP_NAME, RouteNames } from "../constants";
import { useNavigate } from "react-router-dom";
import Nav from 'react-bootstrap/Nav';

import ScrollToTopButton from "../components/ScrollToTopButton";


function Footer() {
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();


  return (
    <>
      <footer >
         <ScrollToTopButton />
          <Nav aria-label="Navigacija podnožja">
              <Nav.Link onClick={() => { navigate(RouteNames.UVJETI); }}>
                 Uvjeti korištenja
             
                </Nav.Link>
          </Nav>
      <p className="copy">&copy; {APP_NAME} Sva prava pridržana {currentYear} <strong style={{color:"orange"}}>({DATA_SOURCE})</strong>.</p>
      


     

       
      </footer >
     
  </>
  );
}

export default Footer;