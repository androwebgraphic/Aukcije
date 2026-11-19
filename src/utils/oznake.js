// Pomoćne funkcije za oznake na formama predmeta.
//
// Id oznake u memoriji/localStorageu je broj, a u Firestoreu string (auto-id,
// npr. "Xk39fQ2m..."). Ranije se id forsirao u broj (Number(id)), pa su svi
// string id-evi postali NaN: popis oznaka je bio prazan, a dodavanje nove
// oznake je javljalo da je "ne mogu povezati s ID-jem".

const KLJUCEVI_NAZIVA = ["naziv", "Naziv", "name", "Name", "oznaka", "Oznaka", "tekst", "Tekst", "title", "Title", "label", "Label"];
const KLJUCEVI_ID = ["id", "ID", "Id", "oznakaId", "OznakaId"];

export const jeIspravanId = (id) => id !== null && id !== undefined && id !== "";

export function izvuciNaziv(oznaka) {
  for (const kljuc of KLJUCEVI_NAZIVA) {
    const vrijednost = oznaka[kljuc];
    if (vrijednost !== null && vrijednost !== undefined && String(vrijednost).trim() !== "") {
      return String(vrijednost).trim();
    }
  }

  // Rezervna varijanta: ako objekt ima svega par polja (tipično ID + naziv pod
  // neočekivanim imenom), uzmi prvo tekstualno polje koje nije ID.
  const polja = Object.entries(oznaka);
  if (polja.length > 3) return null;

  for (const [kljuc, vrijednost] of polja) {
    if (KLJUCEVI_ID.includes(kljuc)) continue;
    if (vrijednost !== null && vrijednost !== undefined && typeof vrijednost !== "object" && String(vrijednost).trim() !== "") {
      return String(vrijednost).trim();
    }
  }

  return null;
}

// Vraća { id, naziv } ili null. Id ostaje onakav kakav je došao (broj ili string).
export function normalizirajOznaku(oznaka) {
  if (oznaka === null || oznaka === undefined) return null;

  if (typeof oznaka === "object") {
    const id = oznaka.id ?? oznaka.ID ?? oznaka.Id ?? oznaka.oznakaId ?? oznaka.OznakaId;
    if (!jeIspravanId(id)) return null;
    return { id, naziv: izvuciNaziv(oznaka) || `Oznaka ${id}` };
  }

  if (!jeIspravanId(oznaka)) return null;
  return { id: oznaka, naziv: `Oznaka ${oznaka}` };
}

// Id iz odgovora servisa ({ data: { id } } već je razmotan prije poziva).
export function izvuciIdIzOdgovora(podaci) {
  if (podaci === null || podaci === undefined || podaci === "") return null;

  const kandidat = typeof podaci === "object"
    ? (podaci.id ?? podaci.ID ?? podaci.Id ?? podaci.oznakaId ?? podaci.OznakaId)
    : podaci;

  return jeIspravanId(kandidat) ? kandidat : null;
}
