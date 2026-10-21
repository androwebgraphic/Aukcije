export const APP_NAME = 'Aukcije '

export const RouteNames = {
  //kategorije

  HOME: '/',
  KATEGORIJE: '/kategorije',
  KATEGORIJE_PROMJENA: '/kategorije/:id',
  KATEGORIJA_NOVA: '/kategorije/dodajkategoriju',

//auth
  REGISTRACIJA: '/registracija',
  LOGIRANJE: '/logiranje',

  //Predmeti

    PREDMETI_PROMJENA: '/predmeti/:id',
  PREDMETI:'/predmeti',
  PREDMETI_KATEGORIJA:'/predmeti/kategorija/:id',
  PREDMET_NOVI: '/predmeti/dodajpredmet',


  // Vinili


  UVJETI: '/uvjeti',


  

  //korisnici

  KORISNIK_PROMJENA: '/korisnici/:id',
  KORISNIK_NOVI: '/korisnici/dodajkorisnika',
  KORISNICI: '/korisnici',
  

  //generiranje. podataka
   GENERIRANJE_PODATAKA: '/generiraj-podatke'
   
}

//memorija, localStorage, firebase
export const DATA_SOURCE = 'localStorage'
