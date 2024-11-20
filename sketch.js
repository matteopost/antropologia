let molds = [];
let d;
let p5Instance;
let currentScore = 0;

function setup() {
  p5Instance = this;
  window.p5Instance = this; 

  const canvasParent = document.querySelector('.canvas-container');
  createCanvas(400, 400).parent(canvasParent);

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

  background(0, 5);
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
    this.x = random(width / 2 - 20, width / 2 + 20);
    this.y = random(height / 2 - 20, height / 2 + 20);
    this.r = random(0.1, 0.7);
    this.heading = random(360);
    this.vx = cos(this.heading);
    this.vy = sin(this.heading);
    this.rotAngle = random(30, 60);
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
    fill(255);
    ellipse(this.x, this.y, this.r * 2, this.r * 2);
  }

  getSensorPos(sensor, angle) {
    sensor.x = (this.x + this.sensorDist * cos(angle) + width) % width;
    sensor.y = (this.y + this.sensorDist * sin(angle) + height) % height;
  }
}