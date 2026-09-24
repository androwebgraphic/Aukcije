import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { APP_NAME, RouteNames } from '../constants';
import { useNavigate } from 'react-router-dom';
import Badge from 'react-bootstrap/Badge';

function NavMain() {
  
  const loggedInn = false // This can be replaced with your actual auth state
  const navigate = useNavigate();
  
  return (
    <>
      <Navbar expand="sm" >
        <Navbar.Brand>{APP_NAME}</Navbar.Brand> 
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link onClick={() => { navigate(RouteNames.HOME) }}>
              Početna
            </Nav.Link>
           
            <NavDropdown title="Programi" id="basic-nav-dropdown">

               <NavDropdown.Item
                            onClick={() => { navigate(RouteNames.KATEGORIJE) }}
                            >Kategorije</NavDropdown.Item>
         


            </NavDropdown>

            {/* Only show Login and Register if the user is NOT logged in */}
            {!loggedInn && (
                <>
                <Nav.Link onClick={() => { navigate(RouteNames.REGISTRACIJA) }}>
                  Registracija
            </Nav.Link>
               
            
                <Nav.Link onClick={() => { navigate(RouteNames.LOGIRANJE) }}>
                  Logiranje
                  <span className='Off'><Badge bg="danger">andreas je Odjavljen</Badge></span>
                </Nav.Link>
              </>
            )}

            {/* Only show "Dodaj predmet" if the user IS logged in */}
            {loggedInn && (
              <Nav.Link onClick={() => { navigate(RouteNames.ADDITEM) }}>
                Dodaj predmet
                <span className='On'><Badge bg="success">andreas je  prijavljen</Badge></span>
              </Nav.Link>

            )}
          </Nav>
        </Navbar.Collapse>
        
      </Navbar>
    </>
  );
}

export default NavMain;