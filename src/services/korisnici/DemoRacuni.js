import {
  ADMIN_EMAIL,
  ADMIN_LOZINKA,
  KORISNIK_EMAIL,
  KORISNIK_LOZINKA,
} from "../../constants";
import KorisniciService from "./KorisniciService";

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
    const postoji = postojeci.some((korisnik) => korisnik.email === racun.email);
    if (postoji) continue;

    await KorisniciService.dodaj(racun);
  }
}

// Poziva se pri pokretanju aplikacije: ako u localStorage-u nema NIJEDNOG
// korisnika, stvara demo račune. Bez toga na praznom pregledniku ne postoji
// administrator, pa se nitko ne može prijaviti.
export async function osigurajPocetneRacune() {
  const rezultat = await KorisniciService.get();
  const postojeci = rezultat.data ?? [];

  if (postojeci.length > 0) return;

  await osigurajDemoRacune();
}
