import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
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
  // Tolerantno na "Admin", " admin ", "ADMIN"…
  const isAdmin = String(authUser?.uloga ?? "").trim().toLowerCase() === "admin";

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

  // Ponovno učitavanje sesije iz localStorage — koristi se npr. kad korisnik
  // sam sebi promijeni ulogu u stranici Korisnici.
  const osvjeziSesiju = useCallback(() => {
    setAuthUser(ucitajSpremljenogKorisnika());
  }, []);

  // Pri pokretanju uskladi sesiju sa stvarnim podacima o korisniku.
  // Bez ovoga bi npr. promjena uloge u listi korisnika ostala nevidljiva
  // u navigaciji sve do ponovne prijave.
  useEffect(() => {
    if (!authUser?.id) return;

    let otkazano = false;

    (async () => {
      try {
        const odgovor = await KorisniciService.get();
        const svjez = (odgovor.data ?? []).find(
          (korisnik) => String(korisnik.id) === String(authUser.id)
        );

        if (otkazano) return;

        if (!svjez) {
          // Račun je obrisan — sesija više nije valjana.
          localStorage.removeItem(KLJUC_POHRANE);
          setAuthUser(null);
          return;
        }

        const sePromijenio =
          String(svjez.email ?? '') !== String(authUser.email ?? '') ||
          String(svjez.uloga ?? '') !== String(authUser.uloga ?? '');

        if (sePromijenio) {
          const novi = { ...authUser, email: svjez.email, uloga: svjez.uloga };
          localStorage.setItem(KLJUC_POHRANE, JSON.stringify(novi));
          setAuthUser(novi);
        }
      } catch (greska) {
        console.warn('Sesiju nije moguće uskladiti s podacima o korisnicima:', greska);
      }
    })();

    return () => {
      otkazano = true;
    };
    // Namjerno samo id: promjena emaila/uloge ne smije ponovno pokretati efekt.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authUser?.id]);

  const value = useMemo(
    () => ({ isLoggedIn, isAdmin, authUser, login, logout, osvjeziSesiju }),
    [isLoggedIn, isAdmin, authUser, login, logout, osvjeziSesiju]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
