import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { APP_NAME, RouteNames } from '../constants';
import { useNavigate } from 'react-router-dom';

function NavMain() {
  
  const loggedInn = true // This can be replaced with your actual auth state
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
           
            <NavDropdown title="Kategorije" id="basic-nav-dropdown" onClick={() => { navigate(RouteNames.KATEGORIJE) }}>
           
            </NavDropdown>

            {/* Only show Login and Register if the user is NOT logged in */}
       
                <Nav.Link onClick={() => { navigate(RouteNames.REGISTRACIJA) }}>
                  Registracija
            </Nav.Link>
                 {!loggedInn && (
              <>
                <Nav.Link onClick={() => { navigate(RouteNames.LOGIRANJE) }}>
                  Logiranje
                </Nav.Link>
              </>
            )}

            {/* Only show "Dodaj predmet" if the user IS logged in */}
            {loggedInn && (
              <Nav.Link onClick={() => { navigate(RouteNames.ADDITEM) }}>
                Dodaj predmet
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </>
  );
}

export default NavMain;