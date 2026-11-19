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
export const DATA_SOURCE = "memorija";
  // Računi za testiranje / prijavu
export const ADMIN_EMAIL = "admin@aukcije.hr";
export const ADMIN_LOZINKA = "Aukcije123!";
export const KORISNIK_EMAIL = "korisnik@aukcije.hr";
export const KORISNIK_LOZINKA = "Aukcije123!";
export const TESTNA_LOZINKA = "Aukcije123!";

export const PrefixStorage = {

  PREDMETI: 'e4.predmeti',
  KATEGORIJE: 'e4.kategorije',
  OZNAKE: 'e4.oznake',
  KORISNICI: 'e4.korisnici'
}