
import { getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// https://console.firebase.google.com/project/edunovafd1/firestore/databases/-default-/security/rules

// Ovdje postavim origo.hr
// https://console.cloud.google.com/apis/credentials/key/c8b4e956-7aba-47e8-8e13-12cca4a880b1?project=edunovafd1

let baza = null;

// Firestore se stvara jednom. Prije se initializeApp() zvao pri svakom
// collection()/doc() pozivu, što je značilo ponovnu provjeru konfiguracije
// na svaku operaciju.
function kreirajBazu() {
    // mora biti VITE_ ili se to u vite config može promijeniti
    const firebaseConfig = {
        apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
        authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
        projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
        storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
        appId: import.meta.env.VITE_FIREBASE_APP_ID
    }

    const app = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);

    return getFirestore(app);
}

export default function getFirebaseDB() {
    if (!baza) baza = kreirajBazu();
    return baza;
}