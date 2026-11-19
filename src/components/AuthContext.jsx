import { createContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RouteNames } from '../constants';
import KorisniciService from '../services/korisnici/KorisniciService';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authUser, setAuthUser] = useState({});
  // Dok se sesija ne pročita iz localStorage, zaštita ruta ne smije
  // zaključiti da korisnik nije prijavljen (inače osvježavanje stranice
  // baci prijavljenog korisnika na /logiranje).
  const [spremno, setSpremno] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const korisnik = localStorage.getItem('korisnik');

    // Nema više navigate(RouteNames.HOME) u else-grani: ona je značila da te
    // svako osvježavanje stranice (npr. /logiranje ili /registracija) baci na
    // početnu. Preusmjeravanje pripada zaštiti ruta, a ne ovdje.
    if (korisnik) {
      try {
        setAuthUser(JSON.parse(korisnik));
        setIsLoggedIn(true);
      } catch {
        localStorage.removeItem('korisnik');
        setIsLoggedIn(false);
      }
    }

    setSpremno(true);
  }, []);

  // VAŽNO: prijava ovdje NE preusmjerava. Vraća rezultat, a preusmjeravanje
  // radi stranica koja je prijavu pokrenula (Logiranje.jsx).
  async function login(email, lozinka) {
    const odgovor = await KorisniciService.prijava(email, lozinka);

    if (!odgovor.success) {
      localStorage.setItem('korisnik', '');
      setAuthUser('');
      setIsLoggedIn(false);
      return {
        success: false,
        message: odgovor.message || 'Email i lozinka ne odgovaraju',
      };
    }

    localStorage.setItem('korisnik', JSON.stringify(odgovor.data));
    setAuthUser(odgovor.data);
    setIsLoggedIn(true);

    return { success: true, korisnik: odgovor.data };
  }

  function logout() {
    localStorage.removeItem('korisnik');
    setAuthUser('');
    setIsLoggedIn(false);
    navigate(RouteNames.HOME);
  }

  const value = {
    isLoggedIn,
    authUser,
    spremno,
    isAdmin: authUser?.uloga === 'admin',
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
