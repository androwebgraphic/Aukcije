// Ključ u localStorage po korisniku: e4.omiljeni.<id>
export function kljucOmiljenih(korisnik) {
  const id = korisnik?.id ?? korisnik?.email;

  if (id === undefined || id === null || id === "") return null;

  return `e4.omiljeni.${String(id)}`;
}

export function dohvatiOmiljene(korisnik) {
  const kljuc = kljucOmiljenih(korisnik);
  if (!kljuc) return [];

  try {
    const sirovo = localStorage.getItem(kljuc);
    if (!sirovo) return [];

    const podaci = JSON.parse(sirovo);
    if (!Array.isArray(podaci)) return [];

    // očisti smeće i sve pretvori u string (Firestore id-evi su stringovi,
    // demo id-evi su brojevi) te ukloni duplikate
    return [
      ...new Set(
        podaci
          .filter((v) => v !== null && v !== undefined && v !== "")
          .map(String)
      ),
    ];
  } catch (greska) {
    console.warn("Neispravan zapis omiljenih u localStorage:", greska);
    return [];
  }
}

export function spremiOmiljene(korisnik, ids) {
  const kljuc = kljucOmiljenih(korisnik);
  if (!kljuc) return; // gost nema svoju listu

  const ocisceno = Array.isArray(ids)
    ? [
        ...new Set(
          ids
            .filter((v) => v !== null && v !== undefined && v !== "")
            .map(String)
        ),
      ]
    : [];

  try {
    localStorage.setItem(kljuc, JSON.stringify(ocisceno));
  } catch (greska) {
    console.warn("Spremanje omiljenih nije uspjelo:", greska);
  }
}

export function jeOmiljen(ids, predmetId) {
  if (!Array.isArray(ids)) return false;
  if (predmetId === undefined || predmetId === null || predmetId === "") return false;

  return ids.includes(String(predmetId));
}