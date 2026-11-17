import {
  ADMIN_EMAIL,
  ADMIN_LOZINKA,
  KORISNIK_EMAIL,
  KORISNIK_LOZINKA,
} from "../../constants";
import KorisniciService from "./KorisniciService";

const jeAdmin = (korisnik) =>
  String(korisnik?.uloga ?? "").trim().toLowerCase() === "admin";

const jeEmail = (korisnik, email) =>
  String(korisnik?.email ?? "").trim().toLowerCase() === email.trim().toLowerCase();

// Stvara demo račune koji nedostaju (admin i obični korisnik).
// Postojeće račune ne dira, pa se lozinke ne mijenjaju.
export async function osigurajDemoRacune() {
  const rezultat = await KorisniciService.get();
  const postojeci = rezultat.data ?? [];

  const demoRacuni = [
    { email: ADMIN_EMAIL, lozinka: ADMIN_LOZINKA, uloga: "admin" },
    { email: KORISNIK_EMAIL, lozinka: KORISNIK_LOZINKA, uloga: "korisnik" },
  ];

  for (const racun of demoRacuni) {
    const postoji = postojeci.some((korisnik) => jeEmail(korisnik, racun.email));
    if (postoji) continue;

    await KorisniciService.dodaj(racun);
  }
}

// Poziva se pri pokretanju aplikacije:
//  1. ako u pohrani nema NIJEDNOG korisnika -> stvori demo račune
//  2. ako nema NIJEDNOG administratora -> vrati admin ulogu demo računu
// Bez ovoga bi aplikacija mogla ostati zaključana (nitko ne može u admin dio).
export async function osigurajPocetneRacune() {
  const rezultat = await KorisniciService.get();
  const postojeci = rezultat.data ?? [];

  if (postojeci.length === 0) {
    await osigurajDemoRacune();
    return;
  }

  if (postojeci.some(jeAdmin)) return;

  // Nema admina — osiguraj da demo račun postoji i vrati mu admin ulogu.
  await osigurajDemoRacune();

  const osvjezeni = (await KorisniciService.get()).data ?? [];
  const demoAdmin = osvjezeni.find((korisnik) => jeEmail(korisnik, ADMIN_EMAIL));

  if (demoAdmin && !jeAdmin(demoAdmin)) {
    await KorisniciService.promijeni(demoAdmin.id, {
      email: demoAdmin.email,
      uloga: "admin",
    });
  }
}
