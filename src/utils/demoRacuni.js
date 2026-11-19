import KorisniciService from '../services/korisnici/KorisniciService';
import { korisnici as demoKorisnici, DEMO_LOZINKA } from '../services/korisnici/KorisniciData';

/*
 * Demo računi (admin@aukcije.hr / korisnik@aukcije.hr) postoje u memoriji
 * (KorisniciData) i u localStorageu (tamo ih sjeme upisuje samo), ali u
 * Firestoreu ih nitko ne stvara — zato se kartice "Klikni za Admina/Korisnika"
 * na prijavi nisu mogle prijaviti kad je DATA_SOURCE = 'firebase'.
 *
 * Ova funkcija ih osigurava u aktivnom izvoru: kreira ih ako ne postoje, a ako
 * postoje s pogrešnom lozinkom ili ulogom — popravlja ih. Lozinka je uvijek
 * DEMO_LOZINKA, ista koju kartice na prijavi upisuju u formu.
 */

export const DEMO_ADMIN = demoKorisnici.find((korisnik) => korisnik.uloga === 'admin');
export const DEMO_KORISNIK = demoKorisnici.find((korisnik) => korisnik.uloga === 'korisnik');

export { DEMO_LOZINKA };

const kljucNaziva = (vrijednost) => String(vrijednost ?? '').trim().toLowerCase();

const dohvatiListu = async (servis) => {
  const odgovor = await servis.get();
  const podaci = Array.isArray(odgovor) ? odgovor : odgovor?.data;
  return Array.isArray(podaci) ? podaci : [];
};

const jeNeuspjeh = (odgovor) => Boolean(odgovor && odgovor.success === false);

export async function osigurajDemoRacune() {
  const postojeci = await dohvatiListu(KorisniciService);
  const rezultat = { kreirano: [], popravljeno: [], uRedu: [] };

  for (const demo of demoKorisnici) {
    const postojeciKorisnik = postojeci.find(
      (korisnik) => kljucNaziva(korisnik?.email) === kljucNaziva(demo.email)
    );

    if (!postojeciKorisnik) {
      const odgovor = await KorisniciService.dodaj({
        email: demo.email,
        lozinka: DEMO_LOZINKA,
        uloga: demo.uloga,
        ime: demo.uloga === 'admin' ? 'Demo administrator' : 'Demo korisnik',
        dodano: new Date().toISOString(),
      });

      if (jeNeuspjeh(odgovor)) {
        throw new Error(
          `Demo račun ${demo.email} nije moguće spremiti: ${odgovor.message ?? 'nepoznata greška'}`
        );
      }

      rezultat.kreirano.push(demo.email);
      continue;
    }

    let popravljen = false;

    // Lozinku servis ne vraća, pa se provjerava prijavom.
    const prijava = await KorisniciService.prijava(demo.email, DEMO_LOZINKA);
    if (!prijava?.success) {
      const odgovor = await KorisniciService.promijeniLozinku(postojeciKorisnik.id, DEMO_LOZINKA);
      if (jeNeuspjeh(odgovor)) {
        throw new Error(
          `Lozinku demo računa ${demo.email} nije moguće popraviti: ${odgovor.message ?? 'nepoznata greška'}`
        );
      }
      popravljen = true;
    }

    if (postojeciKorisnik.uloga !== demo.uloga) {
      const odgovor = await KorisniciService.promijeni(postojeciKorisnik.id, {
        email: postojeciKorisnik.email,
        uloga: demo.uloga,
      });

      if (jeNeuspjeh(odgovor)) {
        throw new Error(
          `Ulogu demo računa ${demo.email} nije moguće popraviti: ${odgovor.message ?? 'nepoznata greška'}`
        );
      }
      popravljen = true;
    }

    if (popravljen) {
      rezultat.popravljeno.push(demo.email);
    } else {
      rezultat.uRedu.push(demo.email);
    }
  }

  return rezultat;
}

export const opisDemoRacuna = (rezultat) =>
  `Demo računi: ${rezultat.kreirano.length} kreirano` +
  (rezultat.popravljeno.length ? `, ${rezultat.popravljeno.length} popravljeno` : '') +
  (rezultat.uRedu.length ? `, ${rezultat.uRedu.length} već ispravno` : '') +
  `. Lozinka: ${DEMO_LOZINKA}`;
