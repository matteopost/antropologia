import { auth, db } from './firebase.js';
import { getDoc, doc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

async function getUserData(uid) {
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    console.log("No such document!");
    return null;
  }
}

async function downloadCanvas() {
  const today = getTodayDate();
  const user = auth.currentUser;

  if (user) {
    const uid = user.uid;
    const userData = await getUserData(uid);

    if (userData) {
      const nome = userData.nome || "Nome";
      const cognome = userData.cognome || "Cognome";
      const title = `Welcome ${nome} ${cognome} in Axis!`;
      const borderSize = 20;
      const cornerRadius = 10;

      let tempCanvas = createGraphics(width * 2, height * 2);

      tempCanvas.background(255);
      tempCanvas.image(get(), borderSize, borderSize + 50, width * 2 - borderSize * 2, height * 2 - borderSize * 2 - 50);

      tempCanvas.fill(0);
      tempCanvas.textSize(18);
      tempCanvas.textAlign(CENTER, TOP);
      tempCanvas.text(title, width, borderSize + 10);

      save(tempCanvas, `AXIS - ${today} - ${uid}.png`);
    } else {
      console.log("Failed to retrieve user data from Firebase.");
    }
  } else {
    console.log("No user is logged in.");
  }
}

function getTodayDate() {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();
  return `${day}/${month}/${year}`;
}

// Espone la funzione downloadCanvas nel contesto globale
window.downloadCanvas = downloadCanvas;
