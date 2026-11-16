import { z } from 'zod';

export const SchemaLogin = z.object({
  email: z.string()
    .trim()
    .min(1, "Email je obavezan")
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, "Email nije ispravnog formata"),

  lozinka: z.string()
    .min(1, "Lozinka je obavezna")
    .min(6, "Lozinka mora imati najmanje 6 znakova"),
});
