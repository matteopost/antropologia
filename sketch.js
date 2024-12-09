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

function saveFormResponses() {
  const responses = {};
  // Esempio di raccolta delle risposte per ogni domanda
  for (let i = 1; i <= 8; i++) {
    const selectedOption = document.querySelector(`input[name="density${i}"]:checked`);
    if (selectedOption) {
      responses[`density${i}`] = selectedOption.value;
    }
  }
  console.log(responses);  // A questo punto puoi inviare questi dati al server o salvarli dove necessario
}

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

function downloadCanvas() {
  const today = getTodayDate();
  const title = "Welcome in Axis!"; // Aggiungi il titolo desiderato
  const borderSize = 20; // Dimensione del bordo bianco
  const cornerRadius = 10; // Raggio dei bordi arrotondati

  // Crea un canvas temporaneo con una risoluzione più alta
  let tempCanvas = createGraphics(width * 2, height * 2);

  // Disegna lo sfondo bianco generale
  tempCanvas.background(255);

  // Disegna il bordo bianco con angoli arrotondati
  tempCanvas.noFill();
  tempCanvas.stroke(255);
  tempCanvas.strokeWeight(borderSize * 2);
  tempCanvas.beginShape();
  tempCanvas.vertex(borderSize + cornerRadius, borderSize);
  tempCanvas.vertex(width * 2 - borderSize - cornerRadius, borderSize);
  tempCanvas.quadraticVertex(width * 2 - borderSize, borderSize, width * 2 - borderSize, borderSize + cornerRadius);
  tempCanvas.vertex(width * 2 - borderSize, height * 2 - borderSize - cornerRadius);
  tempCanvas.quadraticVertex(width * 2 - borderSize, height * 2 - borderSize, width * 2 - borderSize - cornerRadius, height * 2 - borderSize);
  tempCanvas.vertex(borderSize + cornerRadius, height * 2 - borderSize);
  tempCanvas.quadraticVertex(borderSize, height * 2 - borderSize, borderSize, height * 2 - borderSize - cornerRadius);
  tempCanvas.vertex(borderSize, borderSize + cornerRadius);
  tempCanvas.quadraticVertex(borderSize, borderSize, borderSize + cornerRadius, borderSize);
  tempCanvas.endShape(CLOSE);

  // Disegna l'immagine con bordi arrotondati
  tempCanvas.noStroke();
  tempCanvas.beginShape();
  tempCanvas.vertex(borderSize + cornerRadius, borderSize + 50);
  tempCanvas.vertex(width * 2 - borderSize - cornerRadius, borderSize + 50);
  tempCanvas.quadraticVertex(width * 2 - borderSize, borderSize + 50, width * 2 - borderSize, borderSize + cornerRadius + 50);
  tempCanvas.vertex(width * 2 - borderSize, height * 2 - borderSize - cornerRadius);
  tempCanvas.quadraticVertex(width * 2 - borderSize, height * 2 - borderSize, width * 2 - borderSize - cornerRadius, height * 2 - borderSize);
  tempCanvas.vertex(borderSize + cornerRadius, height * 2 - borderSize);
  tempCanvas.quadraticVertex(borderSize, height * 2 - borderSize, borderSize, height * 2 - borderSize - cornerRadius);
  tempCanvas.vertex(borderSize, borderSize + cornerRadius + 50);
  tempCanvas.quadraticVertex(borderSize, borderSize + 50, borderSize + cornerRadius, borderSize + 50);
  tempCanvas.endShape(CLOSE);

  // Disegna l'immagine
  tempCanvas.image(get(), borderSize, borderSize + 50, width * 2 - borderSize * 2, height * 2 - borderSize * 2 - 50);

  // Disegna il titolo sopra l'immagine
  tempCanvas.fill(0); // Testo nero
  tempCanvas.textSize(18); // Dimensione del testo
  tempCanvas.textAlign(CENTER, TOP); // Allineamento del testo
  tempCanvas.text(title, width, borderSize + 10); // Disegna il titolo

  // Salva il canvas con il titolo e l'immagine
  save(tempCanvas, `AXIS - ${today} - ${userID}.png`);
}
