import bcrypt from 'bcryptjs';


export const saveAdminData = (adminPodatci) => {
  const hashedPassword = bcrypt.hashSync(adminPodatci.password, 10);
}
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