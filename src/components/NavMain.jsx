import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { APP_NAME } from '../constants';

function NavMain() {
  
  return (
    
    <>
    <Navbar expand="lg" className="bg-body-tertiary">
     
        <Navbar.Brand href="#home">{APP_NAME}</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="#home">Početna</Nav.Link>
           
            <NavDropdown title="Kategorije" id="basic-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
             
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
    
    </Navbar>
    
    </>


  )

}

export default NavMain