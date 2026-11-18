import { createContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RouteNames } from '../constants';
import KorisniciService from '../services/korisnici/KorisniciService';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authUser, setAuthUser] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    const korisnik = localStorage.getItem('korisnik');

    if (korisnik) {
      setAuthUser(JSON.parse(korisnik));
      setIsLoggedIn(korisnik);
    } else {
      navigate(RouteNames.HOME);
    }
  }, []);

  async function login(email, lozinka) {
    const odgovor = await KorisniciService.prijava(email, lozinka);
    if (odgovor.success) {
      localStorage.setItem('korisnik', JSON.stringify(odgovor.data));
      setAuthUser(odgovor.data);
      setIsLoggedIn(true);
      navigate(RouteNames.NADZORNA_PLOCA);
    } else {
      alert(odgovor.message);
      localStorage.setItem('korisnik', '');
      setAuthUser('');
      setIsLoggedIn(false);
    }
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
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}