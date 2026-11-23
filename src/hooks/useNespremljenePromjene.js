import { useEffect } from 'react';

/*
 * hooks/useNespremljenePromjene.js
 *
 * Blokira reload / zatvaranje taba dok ima nespremljenih promjena
 * (nativni browser dijalog - jedino što preglednik dopušta bez korisničkog klika).
 *
 * VAŽNO: aplikacija koristi <BrowserRouter> + <Routes> (ne data router),
 * pa react-routerov useBlocker OVDJE NE RADI. Zato se navigacija unutar
 * aplikacije (gumb Odustani / Natrag) rješava preko potvrdi() iz useModal().
 *
 * Korištenje u formi:
 *   useNespremljenePromjene(imaPromjena)
 */
export default function useNespremljenePromjene(imaPromjena) {
  useEffect(() => {
    if (!imaPromjena) return undefined;

    function prijeZatvaranja(e) {
      e.preventDefault();
      e.returnValue = '';
    }

    window.addEventListener('beforeunload', prijeZatvaranja);
    return () => window.removeEventListener('beforeunload', prijeZatvaranja);
  }, [imaPromjena]);
}
