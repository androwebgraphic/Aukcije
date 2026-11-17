import { createContext, useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RouteNames } from '../constants';
import KorisniciService from '../services/korisnici/KorisniciService';

export const AuthContext = createContext(null);

const KLJUC_POHRANE = 'korisnik';

// Prijavljeni korisnik se čita iz localStorage-a odmah pri prvom renderu,
// pa se nakon osvježavanja stranice ne gubi sesija.
function ucitajSpremljenogKorisnika() {
  try {
    const zapis = localStorage.getItem(KLJUC_POHRANE);
    return zapis ? JSON.parse(zapis) : null;
  } catch {
    localStorage.removeItem(KLJUC_POHRANE);
    return null;
  }
}

export function AuthProvider({ children }) {
  const [authUser, setAuthUser] = useState(ucitajSpremljenogKorisnika);
  const navigate = useNavigate();

  const isLoggedIn = authUser !== null;
  const isAdmin = authUser?.uloga === "admin";

  const login = useCallback(
    async (email, lozinka) => {
      const odgovor = await KorisniciService.prijava(email, lozinka);

      if (!odgovor.success) {
        return {
          success: false,
          message: odgovor.message || 'Email i lozinka ne odgovaraju',
        };
      }

      localStorage.setItem(KLJUC_POHRANE, JSON.stringify(odgovor.data));
      setAuthUser(odgovor.data);
      navigate(RouteNames.HOME);

      return { success: true, message: '' };
    },
    [navigate]
  );

  const logout = useCallback(() => {
    localStorage.removeItem(KLJUC_POHRANE);
    setAuthUser(null);
    navigate(RouteNames.HOME);
  }, [navigate]);

  const value = useMemo(
    () => ({ isLoggedIn, isAdmin, authUser, login, logout }),
    [isLoggedIn, isAdmin, authUser, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
