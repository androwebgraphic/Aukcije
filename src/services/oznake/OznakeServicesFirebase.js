import { collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc } from "firebase/firestore";
import getFirebaseDB from "../Firebase";
import { PrefixStorage } from "../../constants";

const kolekcijaOznaka = () => collection(getFirebaseDB(), PrefixStorage.OZNAKE);
const referencaOznake = (id) => doc(getFirebaseDB(), PrefixStorage.OZNAKE, String(id));

// Firestore ne prihvaća undefined vrijednosti, a id je već u nazivu dokumenta.
function ocistiOznaku(oznaka) {
    const { id, ...ostalo } = oznaka || {};

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
        const snapshot = await getDocs(kolekcijaOznaka());

        const data = snapshot.docs.map((dokument) => ({
            id: dokument.id,
            ...dokument.data()
        }));

        return { success: true, data: data };
    } catch (e) {
        console.error("Greška kod dohvaćanja oznaka: ", e);
        return { success: false, data: [], message: e.message };
    }
}

async function getByID(id) {
    if (id === undefined || id === null || id === "") {
        return { success: false, data: null, message: "Nedostaje id oznake" };
    }

    try {
        const docSnap = await getDoc(referencaOznake(id));

        if (docSnap.exists()) {
            return {
                success: true,
                data: { id: docSnap.id, ...docSnap.data() }
            };
        }

        return { success: false, data: null, message: "Oznaka nije pronađena" };
    } catch (e) {
        return { success: false, data: null, message: e.message };
    }
}

// 2/4 Create - dodaj novu oznaku
async function dodaj(oznaka) {
    try {
        const docRef = await addDoc(kolekcijaOznaka(), ocistiOznaku(oznaka));
        return {
            success: true,
            data: { id: docRef.id }
        };
    } catch (e) {
        return { success: false, message: e.message };
    }
}

// 3/4 Update - promjena oznake
async function promijeni(id, oznaka) {
    if (id === undefined || id === null || id === "") {
        return { success: false, message: "Nedostaje id oznake" };
    }

    try {
        await updateDoc(referencaOznake(id), ocistiOznaku(oznaka));
        return { success: true };
    } catch (e) {
        return { success: false, message: e.message };
    }
}

// 4/4 Delete
async function obrisi(id) {
    if (id === undefined || id === null || id === "") {
        return { success: false, message: "Nedostaje id oznake" };
    }

    try {
        await deleteDoc(referencaOznake(id));
        return { success: true, message: "Oznaka obrisana" };
    } catch (e) {
        return { success: false, message: e.message };
    }
}

export default {
    get,
    dodaj,
    getByID,
    promijeni,
    obrisi
}
