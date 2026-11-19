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

            return {
                id: doc.id,
                ...podaci
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
            return {
                success: true,
                data: {
                    id: docSnap.id,
                    ...podaci
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
async function dodaj(kategorija) {
    try {
    
        const skupKategorija = collection(getFirebaseDB(), PrefixStorage.KATEGORIJE);
        const docRef = await addDoc(skupKategorija, kategorija);
        
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
 
        const docRef = doc(getFirebaseDB(), PrefixStorage.KATEGORIJE, id);
        await updateDoc(docRef, kategorija);

        return { success: true };
    } catch (e) {
        console.error("Greška kod promjene Kategorije: ", e);
        return { success: false, message: e.message };
    }
}

// 4/4 Delete - obriši
async function obrisi(id) {
    try {
        const docRef = doc(getFirebaseDB(), PrefixStorage.KATEGORIJE, id);
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
    // Dispečer i stranice (KategorijaPromjena.jsx) zovu getByID s velikim D
    getByID: getByid,
    promijeni,
    obrisi
};