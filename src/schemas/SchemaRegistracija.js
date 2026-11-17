import { z } from 'zod';

export const SchemaRegistracija = z
  .object({
    ime: z.string()
      .trim()
      .min(3, "Ime mora imati najmanje 3 znaka")
      .max(50, "Ime ne smije imati više od 50 znakova"),

    email: z.string()
      .trim()
      .min(1, "Email je obavezan")
      .max(100, "Email ne smije imati više od 100 znakova")
      .regex(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, "Email nije ispravnog formata"),

    lozinka: z.string()
      .min(8, "Lozinka mora imati najmanje 8 znakova")
      .max(64, "Lozinka ne smije imati više od 64 znaka")
      .regex(/[A-Za-z]/, "Lozinka mora sadržavati barem jedno slovo")
      .regex(/\d/, "Lozinka mora sadržavati barem jedan broj"),

    potvrdaLozinke: z.string()
      .min(1, "Ponovi lozinku"),
  })
  .refine((podaci) => podaci.lozinka === podaci.potvrdaLozinke, {
    message: "Lozinke se ne podudaraju",
    path: ["potvrdaLozinke"],
  });
