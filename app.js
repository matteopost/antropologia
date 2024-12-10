import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getFirestore, doc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { getDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

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

document.addEventListener("DOMContentLoaded", () => {
    const userNameElement = document.querySelector(".hover\\:text-blue-500");

    // Verifica se l'elemento è presente
    if (userNameElement) {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    const userDocRef = doc(db, "users", user.uid);
                    const userDoc = await getDoc(userDocRef);
                    if (userDoc.exists()) {
                        const userName = userDoc.data().nome;
                        userNameElement.textContent = userName || "Utente";
                    } else {
                        console.warn("Utente non trovato nel database");
                        userNameElement.textContent = "Utente Sconosciuto";
                    }
                } catch (error) {
                    console.error("Errore durante il fetch:", error);
                    userNameElement.textContent = "Errore";
                }
            } else {
                console.warn("Nessun utente autenticato");
                userNameElement.textContent = "Guest";
            }
        });
    } else {
        console.warn("Elemento per il nome utente non trovato");
    }

    // Event listeners per i form
    document.getElementById("logout-button")?.addEventListener("click", logoutUser);
});

document.addEventListener("DOMContentLoaded", function () {
    // Gestione del form di login
    const loginForm = document.getElementById("login-form");
    if (loginForm) {
        loginForm.addEventListener("submit", function (e) {
            e.preventDefault();
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            // Chiama la funzione di login
            loginUser(email, password);
        });
    }
});

// Funzione di login utente
async function loginUser(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Aggiorna il documento con l'ultimo accesso
        const userRef = doc(db, "users", user.uid);
        await setDoc(userRef, { lastLogin: serverTimestamp() }, { merge: true });

        // Redirige l'utente alla home page dopo il login
        window.location.href = "index.html";
    } catch (error) {
        console.error("Errore durante il login:", error);
        alert("Errore: " + error.message);
    }
}

document.getElementById("register-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const nome = document.getElementById("nome").value;
    const cognome = document.getElementById("cognome").value;
    const dataNascita = document.getElementById("dataNascita").value;

    // Chiama la funzione di registrazione con i dati
    registerUser(email, password, nome, cognome, dataNascita);
});

// Funzione di registrazione utente
export async function registerUser(email, password, nome, cognome, dataNascita) {
    try {
        // Controlla se l'utente è maggiorenne
        const birthDate = new Date(dataNascita);
        const currentDate = new Date();
        const age = currentDate.getFullYear() - birthDate.getFullYear();
        const isMinor = (age < 18) || (age === 18 && currentDate < new Date(birthDate.setFullYear(birthDate.getFullYear() + 18)));
        
        if (isMinor) {
            alert("Devi essere maggiorenne per registrarti.");
            return;
        }

        // Crea l'utente con email e password
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Ottieni il riferimento del documento dell'utente nel Firestore
        const userRef = doc(db, "users", user.uid);

        // Salva i dettagli dell'utente (nome, cognome, data di nascita, etc.)
        await setDoc(userRef, {
            email: user.email,
            nome: nome,
            cognome: cognome,
            dataNascita: dataNascita,
            createdAt: serverTimestamp(),  // Timestamp di creazione
            lastLogin: serverTimestamp()   // Timestamp dell'ultimo login (inizialmente quando viene creato)
        }, { merge: true });

        window.location.href = "login.html";
    } catch (error) {
        console.error("Errore durante la registrazione:", error);
        alert("Errore: " + error.message);
    }
}

// Funzione per aggiornare l'avatar con le iniziali
document.addEventListener("DOMContentLoaded", () => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDocRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userDocRef);
  
          if (userDoc.exists()) {
            const userName = userDoc.data().nome;
            const userSurname = userDoc.data().cognome;
            const initials = (userName[0] + userSurname[0]).toUpperCase();
  
            const avatarElement = document.getElementById("user-avatar");
            avatarElement.querySelector("p").textContent = initials; // Aggiorna le iniziali
          }
        } catch (error) {
          console.error("Errore nel recuperare i dati utente:", error);
        }
      } else {
        document.getElementById("user-avatar").textContent = "??";
      }
    });
  });
  
  

// Funzione di logout utente
function logoutUser() {
    signOut(auth).then(() => {
        window.location.href = "login.html";
    }).catch((error) => {
        console.error("Errore durante il logout:", error);
        alert("Errore durante il logout: " + error.message);
    });
}

// Aggiungi il listener di logout quando il DOM è pronto
document.addEventListener("DOMContentLoaded", () => {
    const logoutButton = document.getElementById("logout-button");
    if (logoutButton) {
        logoutButton.addEventListener("click", logoutUser);
    } else {
        console.warn("Logout button not found!");
    }
});

async function saveResponses() {
    const user = auth.currentUser;
    if (!user) {
        alert("Devi essere autenticato per inviare le risposte.");
        return;
    }

    const responses = {};
    for (let i = 1; i <= 8; i++) {
        const value = document.querySelector(`input[name="density${i}"]:checked`);
        responses[`density${i}`] = value ? parseInt(value.value) : null;
    }

    const p5Params = {
        score: score,  // Assicurati che 'score' sia definito altrove nel codice
        red: red,      // Stessa cosa per le altre variabili
        green: green,
        blue: blue,
        redMold: redMold,
        greenMold: greenMold,
        blueMold: blueMold,
        timestamp: serverTimestamp()
    };

    try {
        await setDoc(doc(db, "responses", user.uid), {
            answers: responses,
            p5Params: p5Params
        });
    } catch (error) {
        console.error("Errore nel salvataggio delle risposte:", error);
        alert("Errore: " + error.message);
    }
}

document.getElementById("finish-form")?.addEventListener("click", saveResponses);

