import { useState } from 'react';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { APP_NAME, RouteNames } from '../constants';
import { useNavigate } from 'react-router-dom';

function NavMain() {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

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
           
            {/* Nativni padajući izbornik - uvijek radi u svakom pregledniku */}
            <div className="nav-item px-2">
              <select 
                aria-label="Programi izbornik"
                onChange={handleChange}
                defaultValue=""
                style={{
                  // backgroundColor: '#212529',
                  color: '#dee2e6',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  padding: '0.375rem 0.75rem',
                  borderRadius: '0.375rem',
                  cursor: 'pointer',
                  outline: 'none',
                  fontSize: '1rem'
                }}
              >
                <option value="" disabled>Programi ▼</option>
                <option value={RouteNames.KATEGORIJE}>Kategorije</option>
                <option value={RouteNames.PREDMETI}>Predmeti</option>
                <option value={RouteNames.PREDMETI}>&nbsp;&nbsp;&nbsp;&nbsp;- Auti</option>
                <option value={RouteNames.PREDMETI}>&nbsp;&nbsp;&nbsp;&nbsp;- Lp</option>
                <option value={RouteNames.PREDMETI}>&nbsp;&nbsp;&nbsp;&nbsp;- Nakit</option>
                <option value={RouteNames.KORISNICI}>Korisnici</option>
              </select>
            </div>

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