import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getFirestore, doc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Configura Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBhYGRUm7zDnP6GNf-nUGTxgwRvdwApnH4",
    authDomain: "datacracy-16f27.firebaseapp.com",
    projectId: "datacracy-16f27",
    storageBucket: "datacrazia-16f27.appspot.com",
    messagingSenderId: "643675743445",
    appId: "1:643675743445:web:ada84b9922f1938eb0ee5c",
    measurementId: "G-VFQQ01LNZ4"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();


// Funzione di registrazione utente
export async function registerUser(email, password, nome, cognome, dataNascita) {
    try {
        const birthDate = new Date(dataNascita);
        const currentDate = new Date();
        const age = currentDate.getFullYear() - birthDate.getFullYear();
        const isMinor = (age < 18) || (age === 18 && currentDate < new Date(birthDate.setFullYear(birthDate.getFullYear() + 18)));
        
        if (isMinor) {
            alert("Devi essere maggiorenne per registrarti.");
            return;
        }

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        const userRef = doc(db, "users", user.uid);
        await setDoc(userRef, {
            email: user.email,
            nome: nome,
            cognome: cognome,
            dataNascita: dataNascita,
            createdAt: serverTimestamp(),
            lastLogin: serverTimestamp()
        }, { merge: true });

        alert("Registrazione avvenuta con successo! Ora effettua il login.");
        window.location.href = "login.html";
    } catch (error) {
        console.error("Errore durante la registrazione:", error);
        alert("Errore: " + error.message);
    }
}

// Funzione di login utente
export async function loginUser(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        const userRef = doc(db, "users", user.uid);
        await setDoc(userRef, { lastLogin: serverTimestamp() }, { merge: true });

        window.location.href = "index.html";
    } catch (error) {
        console.error("Errore durante il login:", error);
        alert("Errore: " + error.message);
    }
}

// Funzione di logout utente
function logoutUser() {
    signOut(auth).then(() => {
        window.location.href = "login.html";
    }).catch((error) => {
        console.error("Errore durante il logout:", error);
        alert("Errore durante il logout: " + error.message);
    });
}

document.getElementById("logout-button")?.addEventListener("click", logoutUser);

// Controllo dello stato di autenticazione
onAuthStateChanged(auth, (user) => {
    const currentPath = window.location.pathname;
    if (user) {
        if (currentPath.includes("login.html") || currentPath.includes("register.html")) {
            window.location.href = "index.html";
        }
    } else {
        if (!currentPath.includes("login.html") && !currentPath.includes("register.html")) {
            window.location.href = "login.html";
        }
    }
});

// Gestione del form di registrazione
document.getElementById("register-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const nome = document.getElementById("nome").value;
    const cognome = document.getElementById("cognome").value;
    const dataNascita = document.getElementById("dataNascita").value;

    registerUser(email, password, nome, cognome, dataNascita);
});

// Gestione del form di login
document.getElementById("login-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    loginUser(email, password);
});

// Modale dei Termini e Condizioni
document.getElementById("terms-link")?.addEventListener("click", function (e) {
    e.preventDefault();
    document.getElementById("terms-modal").style.display = "flex";
});

document.getElementById("close-modal")?.addEventListener("click", function () {
    document.getElementById("terms-modal").style.display = "none";
});

document.getElementById("accept-terms")?.addEventListener("click", function () {
    document.getElementById("terms-modal").style.display = "none";
    document.getElementById("terms-checkbox").checked = true;
    document.getElementById("register-button").disabled = false;
});

document.getElementById("terms-checkbox")?.addEventListener("change", function () {
    document.getElementById("register-button").disabled = !this.checked;
});


async function saveResponses() {
    const user = auth.currentUser;
    if (!user) {
        alert("Devi essere autenticato per inviare le risposte.");
        return;
    }

    // Ottieni le risposte dal form
    const responses = {};
    for (let i = 1; i <= 8; i++) {
        const value = document.querySelector(`input[name="density${i}"]:checked`);
        responses[`density${i}`] = value ? parseInt(value.value) : null;
    }

    // Aggiungi i parametri di p5.js
    const p5Params = {
        score: score,
        red: red,
        green: green,
        blue: blue,
        redMold: redMold,
        greenMold: greenMold,
        blueMold: blueMold,
        timestamp: serverTimestamp()
    };

    try {
        // Salva nel Firestore, unendo risposte e parametri di p5.js
        await setDoc(doc(db, "responses", user.uid), {
            answers: responses,
            p5Params: p5Params  // Aggiungi i parametri di p5.js
        });
        alert("Risposte e parametri salvati con successo!");
    } catch (error) {
        console.error("Errore nel salvataggio delle risposte:", error);
        alert("Errore: " + error.message);
    }
}

// Aggiungi il listener al bottone
document.getElementById("finish-form").addEventListener("click", saveResponses);


