import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { APP_NAME,RouteNames } from '../constants';
import { useNavigate } from 'react-router-dom';


function NavMain() {
  

  const navigate = useNavigate()
  
  return (
   
   
    <>
    <Navbar expand="lg" className="bg-body-tertiary">
     
        <Navbar.Brand>
          {APP_NAME}</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
              <Nav.Link 
                        onClick={()=>{navigate(RouteNames.HOME)}}
                        >Početna</Nav.Link>
           
            <NavDropdown title="Programi" id="basic-nav-dropdown">
              <NavDropdown.Item
                 onClick={()=>{navigate(RouteNames.KATEGORIJE)}}
              >Kategorije</NavDropdown.Item>
             
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
    
    </Navbar>
    
    </>


  )

}

export default NavMain