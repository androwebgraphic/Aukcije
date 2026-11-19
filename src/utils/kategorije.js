// Id kategorije dolazi kao broj (memorija, localStorage) ili kao string
// (Firestore auto-id, npr. "Xk39fQ2m..."). Vrijednost čuvamo onakvom kakva je
// došla iz izvora: broj ako je numerički string, inače string. Time ista
// vrijednost prolazi i kroz Zod shemu i kroz filtre koji uspoređuju String(id).
export function normalizirajKategorijuId(vrijednost) {
  if (vrijednost === null || vrijednost === undefined || vrijednost === '') return null;

  const broj = Number(vrijednost);
  return Number.isNaN(broj) ? String(vrijednost) : broj;
}

export default normalizirajKategorijuId;
