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

    AUTI_PROMJENA: 'kategorije/auti/:id',
  AUTI:'/kategorije/auti',
  AUTI_NOVI: '/kategorije/auti/dodajauto',


  // Vinili


  UVJETI: '/uvjeti',

  VINILI_PROMJENA: '/kategorije/vinil/:id',
  VINIL_NOVI: '/kategorije/vinili/dodajvinil',
  VINILI: '/kategorije/vinili/',
  

  //korisnici

  KORISNIK_PROMJENA: '/korisnici/:id',
  KORISNIK_NOVI: '/korisnici/dodajkorisnika',
  KORISNICI:'/korisnici'
   
}

//memorija, localStorage, firebase
export const  DATA_SOURCE = 'localStorage'
