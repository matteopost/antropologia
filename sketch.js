let molds = [];
let d;
let p5Instance;
let currentScore = 0;

function setup() {
  p5Instance = this;
  window.p5Instance = this; 

  const canvasParent = document.querySelector('.canvas-container');
  createCanvas(250, 250).parent(canvasParent);

  angleMode(DEGREES);
  d = pixelDensity();
  
  currentScore = parseInt(document.getElementById("score").innerHTML, 10);
  initializeMolds(currentScore);
}

function draw() {
  const newScore = parseInt(document.getElementById("score").innerHTML, 10);
  if (newScore !== currentScore) {
    currentScore = newScore;
    initializeMolds(currentScore);
  }

  background(red, green, blue, 30);

  // c1 = color(red + 50, green + 50, blue + 50, 30);
  // c2 = color(red - 50, green - 50, blue - 50, 30);
  
  // for(let y=0; y<height; y++){
  //   n = map(y,0,height,0,1);
  //   let newc = lerpColor(c1,c2,n);
  //   stroke(newc);
  //   line(0,y,width, y);
  // }


  loadPixels();
  for (let i = 0; i < molds.length; i++) {
    molds[i].update();
    molds[i].display();
  }
}

function initializeMolds(num) {
  molds = [];
  for (let i = 0; i < num; i++) {
    molds.push(new Mold());
  }
}

class Mold {
  constructor() {
    // this.x = random(width / 2 - 20, width / 2 + 20);
    // this.y = random(height / 2 - 20, height / 2 + 20);
    this.x = random(width / 2 - 200, width / 2 + 200);
    this.y = random(height / 2 - 200, height / 2 + 200);
    this.r = random(0.3, 0.4);
    this.heading = random(360);
    this.vx = cos(this.heading);
    this.vy = sin(this.heading);
    this.rotAngle = random(40, 50);
    this.rSensorPos = createVector(0, 0);
    this.lSensorPos = createVector(0, 0);
    this.fSensorPos = createVector(0, 0);
    this.sensorAngle = random(35, 55);
    this.sensorDist = random(8, 12);
  }

  update() {
    this.vx = cos(this.heading);
    this.vy = sin(this.heading);
    this.x = (this.x + this.vx + width) % width;
    this.y = (this.y + this.vy + height) % height;
    this.getSensorPos(this.rSensorPos, this.heading + this.sensorAngle);
    this.getSensorPos(this.lSensorPos, this.heading - this.sensorAngle);
    this.getSensorPos(this.fSensorPos, this.heading);
    
    let index, l, r, f;
    index = 4 * (d * floor(this.rSensorPos.y)) * (d * width) + 4 * (d * floor(this.rSensorPos.x));
    r = pixels[index];
    index = 4 * (d * floor(this.lSensorPos.y)) * (d * width) + 4 * (d * floor(this.lSensorPos.x));
    l = pixels[index];
    index = 4 * (d * floor(this.fSensorPos.y)) * (d * width) + 4 * (d * floor(this.fSensorPos.x));
    f = pixels[index];
    
    if (f > l && f > r) {
      this.heading += 0;
    } else if (f < l && f < r) {
      if (random(1) < 0.5) {
        this.heading += this.rotAngle;
      } else {
        this.heading -= this.rotAngle;
      }
    } else if (l > r) {
      this.heading += -this.rotAngle;
    } else if (r > l) {
      this.heading += this.rotAngle;
    }
  }

  display() {
    noStroke();
    fill(redMold, greenMold, blueMold);
    ellipse(this.x, this.y, this.r * 2, this.r * 2);
  }

  getSensorPos(sensor, angle) {
    sensor.x = (this.x + this.sensorDist * cos(angle) + width) % width;
    sensor.y = (this.y + this.sensorDist * sin(angle) + height) % height;
  }
}

function getTodayDate() {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();
  return `${day}/${month}/${year}`;
}

document.addEventListener('DOMContentLoaded', () => {
  function saveFormResponses() {
    const responses = {};
    let foundInputs = 0;

    for (let i = 1; i <= 21; i++) {
      const selectedOption = document.querySelector(`input[name="density${i}"]:checked`);
      if (selectedOption) {
        responses[`density${i}`] = selectedOption.value;
        foundInputs++;
      }
    }

    console.log(`Risposte trovate: ${foundInputs}`);
    console.log(responses);

    // Ottieni l'ID utente autenticato
    const userId = firebase.auth().currentUser?.uid || "anonymous-user";

    // Cancella tutte le vecchie risposte e salva quelle nuove
    const docRef = db.collection("responses").doc(userId);

    // Procedura per resettare e salvare le risposte
    docRef
      .set({}, { merge: false }) // Resetta tutte le risposte per questo utente
      .then(() => {
        console.log("Vecchie risposte rimosse.");
        return docRef.set(responses, { merge: true }); // Salva le nuove risposte
      })
      .then(() => {
        console.log("Nuove risposte salvate correttamente.");
      })
      .catch((error) => {
        console.error("Errore durante l'aggiornamento delle risposte:", error);
      });
  }

  // Espone la funzione nel contesto globale
  window.saveFormResponses = saveFormResponses;
});



/*
function downloadCanvas() {
  const today = getTodayDate();

  let tempCanvas = createGraphics(width, height);

  // tempCanvas.background(255);
  // tempCanvas.fill(0);
  // tempCanvas.textSize(12);
  // tempCanvas.textAlign(CENTER, TOP);
  // tempCanvas.text(userID, width / 2, 10);

  tempCanvas.image(get(), 0, 50);

  save(tempCanvas, `AXIS - ${today} - ${userID}.png`);
}
  */
