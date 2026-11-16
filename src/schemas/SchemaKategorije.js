import { z } from "zod"

export const SchemaKategorije = z.object({
  naziv: z.string()
    .trim()
    .min(1, "Naziv je obavezan i ne smije sadržavati samo razmake")
    .min(3, "Naziv predmeta mora imati najmanje 3 znaka")
    .max(30, "Naziv predmeta ne smije imati više od 30 znakova"),
  

  
  opis: z.string()
    .trim()
    .min(1, "Opis je obavezan i ne smije sadržavati samo razmake")
    .min(10, "Opis predmeta mora imati najmanje 10 znakova")
    .max(300, "Opis predmeta ne smije imati više od 300 znakova"),
})

