import { collection, doc, updateDoc, getDoc, getDocs, addDoc, deleteDoc, Timestamp } from "firebase/firestore";
import getFirebaseDB from "../Firebase";
import { PrefixStorage } from "../../constants";

// 1/4 Read - dohvati sve
async function get() {
    try {
        const skupKategorija = collection(getFirebaseDB(), PrefixStorage.KATEGORIJE);
        const snapshot = await getDocs(skupKategorija);
        
        const data = snapshot.docs.map(doc => {
            const podaci = doc.data();
            // Ako grupa ima datumPočetka, pretvaramo ga u ISO string za frontend
            const d = podaci.datumPocetka ? podaci.datumPocetka.toDate() : new Date();
            
            return {
                id: doc.id,
                ...podaci,
                datumPocetka: d.toISOString()
            };
        });
        
        return { success: true, data: data };
    } catch (e) {
        console.error("Greška kod dohvaćanja kategorija: ", e);
        return { success: false, message: e.message };
    }
}

// Dohvati jednu po šifri
async function getByid(id) {
    try {
        const docRef = doc(getFirebaseDB(), PrefixStorage.KATEGORIJE, id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            const podaci = docSnap.data();
            const d = podaci.datumPocetka ? podaci.datumPocetka.toDate() : new Date();
            
            return {
                success: true,
                data: {
                    id: docSnap.id,
                    ...podaci,
                    datumPocetka: d.toISOString()
                }
            };
        } else {
            return { success: false, message: "Grupa s tom šifrom ne postoji." };
        }
    } catch (e) {
        return { success: false, message: e.message };
    }
}

// 2/4 Create - dodaj novu
async function dodaj(grupa) {
    try {
        // Pretvorba datuma u Firebase Timestamp prije spremanja
        if (grupa.datumPocetka) {
            grupa.datumPocetka = Timestamp.fromDate(new Date(grupa.datumPocetka));
        }

        const skupKategorija = collection(getFirebaseDB(), PrefixStorage.Kategorije);
        const docRef = await addDoc(skupKategorija, grupa);
        
        return {
            success: true,
            id: docRef.id // vraćamo id nove Kategorije
        };
    } catch (e) {
        console.error("Greška kod dodavanja Kategorije: ", e);
        return { success: false, message: e.message };
    }
}

// 3/4 Update - promjeni postojeću
async function promijeni(id,kategorija) {
    try {
        // Pretvorba datuma u Firebase Timestamp prije ažuriranja
        if (grupa.datumPocetka) {
            grupa.datumPocetka = Timestamp.fromDate(new Date(grupa.datumPocetka));
        }

        const docRef = doc(getFirebaseDB(), PrefixStorage.kategorija, id);
        await updateDoc(docRef, grupa);

        return { success: true };
    } catch (e) {
        console.error("Greška kod promjene Kategorije: ", e);
        return { success: false, message: e.message };
    }
}

// 4/4 Delete - obriši
async function obrisi(id) {
    try {
        const docRef = doc(getFirebaseDB(), PrefixStorage.kategorije, id);
        await deleteDoc(docRef);
        return {
            success: true,
            message: "Uspješno obrisano"
        };
    } catch (e) {
        console.error("Greška kod brisanja Kategorije: ", e);
        return { success: false, message: e.message };
    }
}

export default {
    get,
    dodaj,
    getByid,
    promijeni,
    obrisi
};