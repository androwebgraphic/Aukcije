import { z } from 'zod';

// Regex za validaciju lozinke: min 8 znakova, velika i mala slova, brojevi i interpunkcijski znak
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/;

// Email: prvo trim, pa provjera formata. Redoslijed je bitan - z.email().trim()
// bi praznine provjerio PRIJE trimanja pa bi "  a@b.hr  " pao kao neispravan.
const emailPolje = z
  .string()
  .trim()
  .pipe(
    z.email({
      error: (issue) =>
        !issue.input || (typeof issue.input === 'string' && issue.input.trim() === '')
          ? "Email je obavezan!"
          : "Unesite ispravan email format!"
    })
  );

export const ShemaKorisnik = z.object({
  email: emailPolje,

  lozinka: z.string()
    .min(8, "Lozinka mora imati najmanje 8 znakova!")
    .regex(passwordRegex, "Lozinka mora sadržavati: veliko slovo, malo slovo, broj i interpunkcijski znak!"),

  uloga: z.enum(['admin', 'korisnik'], {
    error: "Uloga mora biti 'admin' ili 'korisnik'!"
  })
});

export default ShemaKorisnik;

// Shema za registraciju: ista pravila kao ShemaKorisnik + ime, koje forma
// registracije traži (promjena korisnika imena nema, pa se ShemaKorisnik ne
// mijenja). Trim ide prije provjere dužine, inače bi "  A  " prošao kao 6 znakova.
const imePolje = z
  .string()
  .trim()
  .pipe(
    z.string()
      .min(2, "Ime mora imati najmanje 2 znaka!")
      .max(50, "Ime može imati najviše 50 znakova!")
  );

export const ShemaRegistracija = ShemaKorisnik.extend({
  ime: imePolje
});

// Shema za login (samo email i lozinka)
export const ShemaLogin = z.object({
  email: emailPolje,

  // Na prijavi se NE provjerava složenost lozinke: postojeći korisnici mogu
  // imati lozinku koja ne zadovoljava pravila registracije (npr. demo računi
  // "andro1234!" nemaju veliko slovo). Provjerava se samo da polje nije prazno,
  // a stvarnu provjeru radi servis (KorisniciService.prijava).
  lozinka: z.string().min(1, "Lozinka je obavezna!")
});

// Shema za promjenu lozinke (zahtijeva potvrdu)
export const ShemaPromjenaLozinke = z.object({
  novaLozinka: z.string()
    .min(8, "Lozinka mora imati najmanje 8 znakova!")
    .regex(passwordRegex, "Lozinka mora sadržavati: veliko slovo, malo slovo, broj i interpunkcijski znak!"),

  potvrdaLozinke: z.string()
    .min(1, "Potvrda lozinke je obavezna!")
}).refine((data) => data.novaLozinka === data.potvrdaLozinke, {
  error: "Lozinke se ne podudaraju!",
  path: ["potvrdaLozinke"]
});
