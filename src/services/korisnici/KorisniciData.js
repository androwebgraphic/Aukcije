import bcrypt from 'bcryptjs';
import {
  ADMIN_EMAIL,
  ADMIN_LOZINKA,
  KORISNIK_EMAIL,
  KORISNIK_LOZINKA,
} from '../../constants';



  const hashedPassword = bcrypt.hashSync('andro1234', 10);

  export const administratori = [
    {
      id: 1,
      email: 'admin@example.com',
      lozinka: hashedPassword,
      uloga: 'admin'
    },
    {
      id: 2,
      email: 'andeassklizovic@gmail.com',
      lozinka: hashedPassword,
      uloga: 'korisnik'
    },
    // Demo računi s kojima se prijavljuje preko kartica na stranici Prijava.
    {
      id: 3,
      email: ADMIN_EMAIL,
      lozinka: bcrypt.hashSync(ADMIN_LOZINKA, 10),
      uloga: 'admin'
    },
    {
      id: 4,
      email: KORISNIK_EMAIL,
      lozinka: bcrypt.hashSync(KORISNIK_LOZINKA, 10),
      uloga: 'korisnik'
    }
  ]

  export default administratori;