import { APP_NAME, RouteNames } from "../constants";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import ScrollToTopButton from "./ScrollToTopButton";

function Footer() {
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  return (
 <footer>
      <p className="copy">&copy; {APP_NAME} Sva prava pridržana {currentYear}.</p>
      
<>
      {/* onMouseLeave je sada na cijelom Navbaru */}


          <Nav>
              <Nav.Link onClick={() => { navigate(RouteNames.UVJETI); }}>
                 Uvjeti korištenja
             
                </Nav.Link>
          </Nav>

      </>
             <ScrollToTopButton></ScrollToTopButton>
    </footer >
  
  );
}

export default Footer;