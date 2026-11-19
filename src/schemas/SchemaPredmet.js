import { z } from 'zod';

export const ShemaPredmet = z.object({
  naziv: z.string()
    .trim()
    .min(1, "Naziv je obavezan i ne smije sadržavati samo razmake")
    .min(3, "Naziv predmeta mora imati najmanje 3 znaka")
    .max(30, "Naziv predmeta ne smije imati više od 30 znakova"),
  
  // Kategorija je broj (memorija/localStorage) ili string (Firestore auto-id).
  kategorija: z.union(
    [
      z.coerce.number().min(1, "Morate odabrati kategoriju"),
      z.string().trim().min(1, "Morate odabrati kategoriju")
    ],
    {
      error: (issue) =>
        issue.input === null || issue.input === undefined || issue.input === ""
          ? "Kategorija je obavezna"
          : "Kategorija mora biti broj ili id kategorije"
    }
  ),
  
  opis: z.string()
    .trim()
    .min(1, "Opis je obavezan i ne smije sadržavati samo razmake")
    .min(10, "Opis predmeta mora imati najmanje 10 znakova")
    .max(300, "Opis predmeta ne smije imati više od 300 znakova"),

  pocetnaCijena: z.number({
    invalid_type_error: "Početna cijena mora biti broj"
  })
    .min(1, "Početna cijena mora biti veća od 0")
    .max(100000, "Početna cijena ne smije biti veća od 100000"),
      

});