// Pomoćne funkcije za provjeru ovlasti.
// Uloga dolazi iz prijavljenog korisnika (AuthContext.authUser).

export function jeAdmin(korisnik) {
  return korisnik?.uloga === "admin";
}

// Vlasnik predmeta je zapisan kao korisnikId (novi zapisi) ili korisnik
// (stariji zapisi / ponude), pa provjeravamo oba polja.
export function jeVlasnikPredmeta(predmet, korisnik) {
  if (!predmet || !korisnik) return false;

  const vlasnik = predmet.korisnikId ?? predmet.korisnik;
  if (vlasnik === undefined || vlasnik === null || vlasnik === "") return false;

  return String(vlasnik) === String(korisnik.id);
}

// Admin smije sve; običan korisnik samo svoje predmete.
export function smijeMijenjatiPredmet(predmet, korisnik) {
  return jeAdmin(korisnik) || jeVlasnikPredmeta(predmet, korisnik);
}
