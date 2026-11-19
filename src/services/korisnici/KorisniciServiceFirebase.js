import { collection, doc, updateDoc, getDoc, getDocs, addDoc, deleteDoc, query, where, limit } from "firebase/firestore";
import getFirebaseDB from "../Firebase";
import { PrefixStorage } from "../../constants";
import bcrypt from 'bcryptjs';

// Firestore ne prihvaća undefined vrijednosti, a id je već u nazivu dokumenta.
// Ostala polja (npr. ime, dodano iz Registracija.jsx) se čuvaju - prije su se
// gubila jer je dodaj pisao samo email/uloga/lozinka.
function ocistiKorisnika(korisnik) {
    const { id, ...ostalo } = korisnik || {};

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
        const skupKorisnika = collection(getFirebaseDB(), PrefixStorage.KORISNICI);
        const snapshot = await getDocs(skupKorisnika);

        const data = snapshot.docs.map(doc => {
            const korisnik = doc.data();
            return {
                id: doc.id,
                email: korisnik.email,
                uloga: korisnik.uloga
            };
        });

        return { success: true, data: data };
    } catch (e) {
        console.error("Greška kod dohvaćanja korisnika: ", e);
        return { success: false, message: e.message };
    }
}

async function getById(id) {
    try {
        const docRef = doc(getFirebaseDB(), PrefixStorage.KORISNICI, String(id));
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            return {
                success: true,
                data: {
                    id: docSnap.id,
                    email: data.email,
                    uloga: data.uloga
                }
            };
        }
        return { success: false, message: "Korisnik nije pronađen" };
    } catch (e) {
        return { success: false, message: e.message };
    }
}

// 2/4 Create - dodaj novog korisnika s hashiranom lozinkom
async function dodaj(korisnik) {
    try {
        const noviKorisnik = {
            ...ocistiKorisnika(korisnik),
            lozinka: bcrypt.hashSync(korisnik.lozinka, 10)
        };
        const skupKorisnika = collection(getFirebaseDB(), PrefixStorage.KORISNICI);
        const docRef = await addDoc(skupKorisnika, noviKorisnik);
        return {
            success: true,
            data: { id: docRef.id, email: korisnik.email }
        };
    } catch (e) {
        return { success: false, message: e.message };
    }
}

// Isti kao dodaj, ali lozinku ostavlja u čitljivom obliku (samo za generiranje testnih podataka)
async function dodajBezHash(korisnik) {
    try {
        const noviKorisnik = ocistiKorisnika(korisnik);
        const skupKorisnika = collection(getFirebaseDB(), PrefixStorage.KORISNICI);
        const docRef = await addDoc(skupKorisnika, noviKorisnik);
        return {
            success: true,
            data: { id: docRef.id, email: korisnik.email }
        };
    } catch (e) {
        return { success: false, message: e.message };
    }
}

// 3/4 Update - promjena podataka i lozinke
async function promijeni(id, korisnik) {
    try {
        const docRef = doc(getFirebaseDB(), PrefixStorage.KORISNICI, String(id));
        await updateDoc(docRef, {
            email: korisnik.email,
            uloga: korisnik.uloga
        });

        return { success: true };
    } catch (e) {
        return { success: false, message: e.message };
    }
}

async function promijeniLozinku(id, novaLozinka) {
    try {
        const hashiranaLozinka = bcrypt.hashSync(novaLozinka, 10);
        const docRef = doc(getFirebaseDB(), PrefixStorage.KORISNICI, String(id));

        await updateDoc(docRef, {
            lozinka: hashiranaLozinka
        });

        return { success: true, message: "Lozinka uspješno promijenjena" };
    } catch (e) {
        return { success: false, message: e.message };
    }
}

// 4/4 Delete
async function obrisi(id) {
    try {
        const docRef = doc(getFirebaseDB(), PrefixStorage.KORISNICI, String(id));
        await deleteDoc(docRef);
        return { success: true, message: "Korisnik obrisan" };
    } catch (e) {
        return { success: false, message: e.message };
    }
}

async function prijava(email, lozinka) {
    try {
        const skupKorisnika = collection(getFirebaseDB(), PrefixStorage.KORISNICI);

        const q = query(skupKorisnika, where("email", "==", email), limit(1));
        const querySnapshot = await getDocs(q);

        // Ako korisnik s tim emailom ne postoji, ne smijemo pristupati docs[0]
        const korisnikDoc = querySnapshot.docs[0];
        if (!korisnikDoc) {
            return { success: false, message: "Email i lozinka ne odgovaraju" };
        }

        const korisnikPodaci = korisnikDoc.data();

        // Stariji zapisi mogu imati lozinku u čitljivom obliku ili bez nje;
        // bcrypt.compareSync bi na takav podatak bacio izuzetak.
        if (typeof korisnikPodaci.lozinka !== 'string') {
            return { success: false, message: "Email i lozinka ne odgovaraju" };
        }

        const isMatch = bcrypt.compareSync(lozinka, korisnikPodaci.lozinka);
        if (!isMatch) {
            return { success: false, message: "Email i lozinka ne odgovaraju" };
        }

        return {
            success: true,
            data: {
                id: korisnikDoc.id,
                email: korisnikPodaci.email,
                uloga: korisnikPodaci.uloga
            }
        };
    } catch (e) {
        return { success: false, message: "Greška kod prijave: " + e.message };
    }
}

export default {
    get,
    dodaj,
    dodajBezHash,
    getById,
    promijeni,
    promijeniLozinku,
    obrisi,
    prijava
}
