import bcrypt from 'bcryptjs';



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
    }
  ]

  export default administratori;