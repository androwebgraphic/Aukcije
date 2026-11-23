import { useEffect, useState } from 'react';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { APP_NAME, RouteNames } from '../constants';
import { Link, useNavigate } from 'react-router-dom';
import { NavDropdown, Badge,Col,Row} from 'react-bootstrap';
import KategorijeServices from '../services/kategorije/KategorijeServices';
import useAuth from '../hooks/useAuth';
import aukcijelogo from '../img/Aukcije logo.png'

function NavMain() {
  const navigate = useNavigate();
  const { isLoggedIn, isAdmin, authUser, logout } = useAuth();
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
      <Navbar expand="lg" data-bs-theme="dark" expanded={expanded} onToggle={(isOpen) => setExpanded(isOpen)}>
        <Navbar.Brand>
         <img className="logo" src={aukcijelogo} alt="Aukcije logo" />
          <Link style={{ textDecoration: "none" }} to="/">{APP_NAME}    </Link>
        </Navbar.Brand>
        <Navbar.Toggle
          aria-controls="basic-navbar-nav"
          aria-expanded={expanded}
          label={expanded ? 'Zatvori navigaciju' : 'Otvori navigaciju'}
          className="navbar-toggler-anim"
        >
          <span className="navbar-toggler-icon" aria-hidden="true">
            <span className="toggler-bar" />
            <span className="toggler-bar" />
            <span className="toggler-bar" />
          </span>
        </Navbar.Toggle>

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto align-items-sm-center" aria-label="Glavna navigacija">
            <Nav.Link onClick={() => { navigate(RouteNames.HOME); setExpanded(false); }}>
              Početna
            </Nav.Link>

            {/* Programi (kategorije, oznake, korisnici, generiranje) - samo admin */}
            {isAdmin && (
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
                </NavDropdown.Item >
                <Nav.Link style={{marginLeft:"5rem"}} onClick={() => { navigate(RouteNames.NADZORNA_PLOCA); setExpanded(false); }}>
                Nadzorna ploča
              </Nav.Link>
              </NavDropdown>
            )}

            {/* Predmeti - dostupno svima; dodavanje samo prijavljenima */}
            <NavDropdown title="Predmeti" id="predmeti-dropdown">
              <NavDropdown.Item as={Link} to={RouteNames.PREDMETI} onClick={() => setExpanded(false)}>
                Svi predmeti
              </NavDropdown.Item>

              {isLoggedIn && (
                <NavDropdown.Item as={Link} to={RouteNames.PREDMET_NOVI} onClick={() => setExpanded(false)}>
                  Novi predmet
                </NavDropdown.Item>
              )}

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

          <hr />

            {isLoggedIn ? (
              <>
          
            <NavDropdown title="Korisnik">
                    <NavDropdown.Item disabled aria-label="Prijavljeni korisnik" >
                      <Badge bg="success" >{authUser?.email}</Badge>
                      {isAdmin && <Badge bg="success" className="ms-2" >admin</Badge> ||  <Badge bg="warning" className="ms-2 ">korisnik</Badge>}
                    
                    </NavDropdown.Item>
              
            
                    <NavDropdown.Item onClick={() => { logout(); setExpanded(false); }} style={{marginLeft:"1rem"}}>
                      Odjava
                    </NavDropdown.Item>
           </NavDropdown>
          
              </>
            ) : (
              <>
                <Nav.Link onClick={() => { navigate(RouteNames.REGISTRACIJA); setExpanded(false); }}>
                  Registracija
                </Nav.Link>
                <Nav.Link onClick={() => { navigate(RouteNames.LOGIRANJE); setExpanded(false); }}>
                  Logiranje
                    </Nav.Link>
             
                </>
                
            )}
          </Nav>
          
        </Navbar.Collapse>



      </Navbar>
    </>
    
  );
}

export default NavMain;
