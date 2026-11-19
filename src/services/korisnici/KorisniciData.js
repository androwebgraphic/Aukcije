import bcrypt from 'bcryptjs';

// Lozinka demo računa. Izvezena je kako bi servis mogao provjeriti da demo
// računi u local storage-u stvarno imaju tu lozinku (i popraviti ih ako ne).
export const DEMO_LOZINKA = 'Aukcije1234!';

const hashedPassword = bcrypt.hashSync(DEMO_LOZINKA, 10);

export const korisnici = [
  {
    id: 1,
    email: 'admin@aukcije.hr',
    lozinka: hashedPassword,
    uloga: 'admin'
  },
  {
    id: 2,
    email: 'korisnik@aukcije.hr',
    lozinka: hashedPassword,
    uloga: 'korisnik'
  }
]

export default korisnici;
