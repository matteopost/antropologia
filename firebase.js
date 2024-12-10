import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// La tua configurazione Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBhYGRUm7zDnP6GNf-nUGTxgwRvdwApnH4",
    authDomain: "datacracy-16f27.firebaseapp.com",
    projectId: "datacracy-16f27",
    storageBucket: "datacrazia-16f27.appspot.com",
    messagingSenderId: "643675743445",
    appId: "1:643675743445:web:ada84b9922f1938eb0ee5c",
    measurementId: "G-VFQQ01LNZ4"
};

// Inizializza Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
