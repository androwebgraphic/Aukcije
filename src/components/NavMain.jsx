import  { useState } from 'react';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { APP_NAME, RouteNames } from '../constants';
import { useNavigate } from 'react-router-dom';


function NavMain() {

  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      {/* onMouseLeave je sada na cijelom Navbaru */}
      <Navbar 
        expand="sm" 
        data-bs-theme="dark"
        expanded={expanded}
        onToggle={(isOpen) => setExpanded(isOpen)}
        onMouseLeave={() => setExpanded(false)} 
      >
        <Navbar.Brand>{APP_NAME}</Navbar.Brand> 
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link onClick={() => { navigate(RouteNames.HOME); setExpanded(false); }}>
              Početna
            </Nav.Link>
           
            <NavDropdown title="Programi" id="basic-nav-dropdown">
               <NavDropdown.Item onClick={() => { navigate(RouteNames.KATEGORIJE); setExpanded(false); }}>
                Kategorije
         
          
              </NavDropdown.Item>
              <NavDropdown.Item onClick={() => { navigate(RouteNames.AUTI); setExpanded(false); }}>
             Auti</NavDropdown.Item>
            </NavDropdown>

          
                <>
                <Nav.Link onClick={() => { navigate(RouteNames.REGISTRACIJA); setExpanded(false); }}>
                  Registracija
                </Nav.Link>
                <Nav.Link onClick={() => { navigate(RouteNames.LOGIRANJE); setExpanded(false); }}>
                  Logiranje
             
                </Nav.Link>
              </>
      

    
           
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </>
  );
}

export default NavMain;