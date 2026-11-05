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
  const [kategorije, setKategorije] = useState([]);

  async function ucitajKategorije() {
    try {
      const response = await KategorijeServices.get();
      setKategorije(response.data);
    } catch (error) {
      console.error("Greška kod učitavanja kategorija:", error);
    }
  }

  useEffect(() => {
    ucitajKategorije();
  }, []);

  return (
    <>
      <Navbar expand="sm" data-bs-theme="dark" expanded={expanded} onToggle={(isOpen) => setExpanded(isOpen)}>
        <Navbar.Brand>
          <Link style={{ textDecoration: "none" }} to="/">{APP_NAME}</Link>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto align-items-sm-center">
            <Nav.Link onClick={() => { navigate(RouteNames.HOME); setExpanded(false); }}>
              Početna
            </Nav.Link>

            {/* Glavni izbornik Programi */}
            <NavDropdown title="Programi" id="programi-dropdown">
              <NavDropdown.Item as={Link} to={RouteNames.KATEGORIJE} onClick={() => setExpanded(false)}>
                Kategorije
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to={RouteNames.OZNAKE} onClick={() => setExpanded(false)}>
                Oznake
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to={RouteNames.KORISNICI} onClick={() => setExpanded(false)}>
                Korisnici
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={() => { navigate(RouteNames.GENERIRANJE_PODATAKA); setExpanded(false); }}>
                Generiraj podatke
              </NavDropdown.Item>
            </NavDropdown>

            {/* Zaseban dropdown za Predmete i njihove kategorije da se izbjegne ugniježđivanje */}
            <NavDropdown title="Predmeti" id="predmeti-dropdown">
              <NavDropdown.Item as={Link} to={RouteNames.PREDMETI} onClick={() => setExpanded(false)}>
                Svi predmeti
              </NavDropdown.Item>
              
              {kategorije && kategorije.length > 0 && <NavDropdown.Divider />}

              {kategorije && kategorije.map((k) => (
                <NavDropdown.Item 
                  key={k.id} 
                  as={Link} 
                  to={`/predmeti/kategorija/${k.id}`}
                  onClick={() => setExpanded(false)}
                >
                  {k.naziv}
                </NavDropdown.Item>
              ))}
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