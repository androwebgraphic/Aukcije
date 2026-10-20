import { useEffect, useState } from 'react';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { APP_NAME, RouteNames } from '../constants';
import { Link, useNavigate } from 'react-router-dom';
import { NavDropdown } from 'react-bootstrap';
import KategorijeServices from '../services/kategorije/KategorijeServices';

function NavMain() {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const [kategorije, setKategorije] = useState([])

  async function ucitajKategorije() {
    await KategorijeServices.get().then((o) => setKategorije(o.data))
  }

  useEffect(() => {
    ucitajKategorije()
  }, [])

  // Funkcija koja hvata odabir iz padajućeg izbornika
  const handleChange = (e) => {
    const selectedRoute = e.target.value;
    if (selectedRoute) {
      navigate(selectedRoute);
      setExpanded(false);
      e.target.value = ""; // Resetira odabir da se može ponovno kliknuti isto
    }
  };

  return (
    <>
      <Navbar expand="sm" data-bs-theme="dark" expanded={expanded} onToggle={(isOpen) => setExpanded(isOpen)}>
        <Navbar.Brand>{APP_NAME}</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto align-items-sm-center">
            <Nav.Link onClick={() => { navigate(RouteNames.HOME); setExpanded(false); }}>
              Početna
            </Nav.Link>


            <NavDropdown title="Programi" id="programi">
              <NavDropdown.Item href="#action/3.1">Kategorije</NavDropdown.Item>

              <NavDropdown title="Predmeti" id="predmeti">
                <NavDropdown.Item href={RouteNames.PREDMETI}>Svi</NavDropdown.Item>
                {kategorije && kategorije.map((k) => (
                  <NavDropdown.Item href={`/predmeti/kategorija/${k.id}`} key={k.id}>
                    {k.naziv}
                  </NavDropdown.Item>
                ))}

              </NavDropdown>

              
 <NavDropdown.Divider /><NavDropdown title="generiraj podatke">
                            <NavDropdown.Item
                                onClick={() => navigate(RouteNames.GENERIRANJE_PODATAKA)}
                            >Generiraj podatke</NavDropdown.Item>
                        </NavDropdown>



              <NavDropdown.Item href={RouteNames.KORISNICI}>Korisnici</NavDropdown.Item>
            </NavDropdown>
                  
            <Nav.Link onClick={() => { navigate(RouteNames.KORISNIK_NOVI); setExpanded(false); }}>
              Registracija
            </Nav.Link>
            <Nav.Link onClick={() => { navigate(RouteNames.LOGIRANJE); setExpanded(false); }}>
              Logiranje
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </>
  );
}

export default NavMain;