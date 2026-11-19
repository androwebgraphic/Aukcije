export const APP_NAME = "Aukcije ";

export const RouteNames = {



	//kategorije

	HOME: "/",
	KATEGORIJE: "/kategorije",
	KATEGORIJE_PROMJENA: "/kategorije/:id",
	KATEGORIJA_NOVA: "/kategorije/dodajkategoriju",

	//auth
	REGISTRACIJA: "/registracija/",
	LOGIRANJE: "/logiranje",

	//Predmeti

	PREDMETI_PROMJENA: "/predmeti/promijeni/:id",
	PREDMETI: "/predmeti",
	PREDMETI_KATEGORIJA: "/predmeti/kategorija/:id",
	PREDMET_NOVI: "/predmeti/dodajpredmet",
  PREDMETI_OMILJENI:"/predmet/omiljeni",
  


	UVJETI: "/uvjeti",

	//korisnici

  KORISNIK_PROMJENA: "/korisnici/:id",
  KORISNIK_PROMJENA_LOZINKE: '/korisnici/:id/lozinka',
	KORISNIK_NOVI: "/korisnici/dodajkorisnika",
	KORISNICI: "/korisnici",

	//generiranje. podataka
	GENERIRANJE_PODATAKA: "/generiraj-podatke",

	//oznake

	OZNAKE_PROMJENA: "/oznake/:id",
	OZNAKA_NOVA: "/dodajoznaku",
  OZNAKE: "/oznake",
  
  //nadzorna ploca
  NADZORNA_PLOCA:"/nadzorna-ploca"
};

//memorija, localStorage, firebase
export const DATA_SOURCE = "localStorage";
  // Računi za testiranje / prijavu.
  // VAŽNO: lozinke moraju odgovarati DEMO_LOZINKA u
  // src/services/korisnici/KorisniciData.js jer kartice "Klikni za
  // Admina/Korisnika" na prijavi upisuju upravo taj podatak.
export const ADMIN_EMAIL = "admin@aukcije.hr";
export const ADMIN_LOZINKA = "Aukcije1234!";
export const KORISNIK_EMAIL = "korisnik@aukcije.hr";
export const KORISNIK_LOZINKA = "Aukcije1234!";
export const TESTNA_LOZINKA = "Aukcije1234!";

export const PrefixStorage = {

  PREDMETI: 'e4.predmeti',
  KATEGORIJE: 'e4.kategorije',
  OZNAKE: 'e4.oznake',
  KORISNICI: 'e4.korisnici'
}