import { collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc } from "firebase/firestore";
import getFirebaseDB from "../Firebase";
import { PrefixStorage } from "../../constants";

const kolekcijaPredmeta = () => collection(getFirebaseDB(), PrefixStorage.PREDMETI);
const referencaPredmeta = (id) => doc(getFirebaseDB(), PrefixStorage.PREDMETI, String(id));

// Firestore ne prihvaća undefined vrijednosti, a id je već u nazivu dokumenta
// pa ga ne želimo pisati i u sadržaj dokumenta.
function ocistiPredmet(predmet) {
    const { id, ...ostalo } = predmet || {};

    Object.keys(ostalo).forEach((kljuc) => {
        if (ostalo[kljuc] === undefined) {
            delete ostalo[kljuc];
        }
    });

    return ostalo;
}

// 1/4 Read - dohvati sve
async function get() {
    try {
        const snapshot = await getDocs(kolekcijaPredmeta());

        const data = snapshot.docs.map((dokument) => ({
            id: dokument.id,
            ...dokument.data()
        }));

        return { success: true, data: data };
    } catch (e) {
        console.error("Greška kod dohvaćanja predmeta: ", e);
        return { success: false, data: [], message: e.message };
    }
}

async function getByID(id) {
    if (id === undefined || id === null || id === "") {
        return { success: false, data: null, message: "Nedostaje id predmeta" };
    }

    try {
        const docSnap = await getDoc(referencaPredmeta(id));

        if (docSnap.exists()) {
            return {
                success: true,
                data: { id: docSnap.id, ...docSnap.data() }
            };
        }

        return { success: false, data: null, message: "Predmet nije pronađen" };
    } catch (e) {
        return { success: false, data: null, message: e.message };
    }
}

// 2/4 Create - dodaj novi predmet
async function dodaj(predmet) {
    try {
        const docRef = await addDoc(kolekcijaPredmeta(), ocistiPredmet(predmet));
        return {
            success: true,
            data: { id: docRef.id }
        };
    } catch (e) {
        return { success: false, message: e.message };
    }
}

// 3/4 Update - promjena predmeta
async function promijeni(id, predmet) {
    if (id === undefined || id === null || id === "") {
        return { success: false, message: "Nedostaje id predmeta" };
    }

    try {
        await updateDoc(referencaPredmeta(id), ocistiPredmet(predmet));
        return { success: true };
    } catch (e) {
        return { success: false, message: e.message };
    }
}

// 4/4 Delete
async function obrisi(id) {
    if (id === undefined || id === null || id === "") {
        return { success: false, message: "Nedostaje id predmeta" };
    }

    try {
        await deleteDoc(referencaPredmeta(id));
        return { success: true, message: "Predmet obrisan" };
    } catch (e) {
        return { success: false, message: e.message };
    }
}

// Straničenje: dohvatimo sve pa filtriramo i režemo lokalno. Tako se ponašanje
// poklapa s memorijskim i localStorage servisom (isti raspored i ukupni brojevi),
// a izbjegavamo potrebu za složenim indeksima u Firestoreu.
async function dohvatiStranicu(stranica = 1, velicinaStranice = 12, uvjetiPretrazivanja = '') {
    try {
        const odgovor = await get();
        if (!odgovor.success) {
            return { success: false, data: [], ukupnoStranica: 0, ukupnoStavki: 0, message: odgovor.message };
        }

        const pojmovi = String(uvjetiPretrazivanja ?? '').trim().toLowerCase();

        let predmeti = odgovor.data;

        if (pojmovi !== '') {
            predmeti = predmeti.filter((predmet) =>
                String(predmet.naziv ?? '').toLowerCase().includes(pojmovi) ||
                String(predmet.opis ?? '').toLowerCase().includes(pojmovi)
            );
        }

        // Stabilan raspored: najstarije dodano prvo, kao kod niza u memoriji.
        predmeti = [...predmeti].sort((a, b) => {
            const datumA = new Date(a.dodano ?? 0).getTime() || 0;
            const datumB = new Date(b.dodano ?? 0).getTime() || 0;
            if (datumA !== datumB) return datumA - datumB;
            return String(a.id).localeCompare(String(b.id));
        });

        const ukupnoStavki = predmeti.length;
        const velicina = Number(velicinaStranice) > 0 ? Number(velicinaStranice) : 12;
        const trenutnaStranica = Number(stranica) > 0 ? Number(stranica) : 1;
        const ukupnoStranica = Math.ceil(ukupnoStavki / velicina);

        const pocetniIndex = (trenutnaStranica - 1) * velicina;
        const stranicenjePodatci = predmeti.slice(pocetniIndex, pocetniIndex + velicina);

        return {
            success: true,
            data: stranicenjePodatci,
            ukupnoStranica: ukupnoStranica,
            ukupnoStavki: ukupnoStavki
        };
    } catch (e) {
        console.error("Greška kod dohvaćanja stranice predmeta: ", e);
        return { success: false, data: [], ukupnoStranica: 0, ukupnoStavki: 0, message: e.message };
    }
}

export default {
    get,
    dodaj,
    getByID,
    promijeni,
    obrisi,
    dohvatiStranicu
}
