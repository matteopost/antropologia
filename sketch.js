let molds = [];
let num;
let d; 
let rating = 3; // Default rating, dynamically updated from input

function setup() {
  createCanvas(500, 500);
  angleMode(DEGREES);
  d = pixelDensity();
  updateMoldCount(); // Dynamically calculate number of molds based on rating
  initializeMolds();
}

function draw() {
  background(0, 5);
  loadPixels();
  
  for (let i = 0; i < num; i++) {
    molds[i].update();
    molds[i].display();
  }
}

// Dynamically update the number of molds
function updateMoldCount() {
  if (rating === 1) {
    num = 200;
  } else if (rating === 2) {
    num = 400;
  } else if (rating === 3) {
    num = 800;
  } else if (rating === 4) {
    num = 1200;
  } else if (rating === 5) {
    num = 3000;
  }
}

// Initialize molds based on updated count
function initializeMolds() {
  molds = []; // Clear the previous array
  for (let i = 0; i < num; i++) {
    molds[i] = new Mold();
  }
}

// Re-run setup when rating changes
function rerunSimulation(newRating) {
  rating = newRating; // Update rating dynamically
  updateMoldCount();
  initializeMolds();
  redraw();
}

class Mold {
  constructor() {
    this.x = random(width / 2 - 20, width / 2 + 20);
    this.y = random(height / 2 - 20, height / 2 + 20); 
    this.r = 0.5;
    
    this.heading = random(360);
    this.vx = cos(this.heading);
    this.vy = sin(this.heading);
    this.rotAngle = 45;
    
    this.rSensorPos = createVector(0, 0);
    this.lSensorPos = createVector(0, 0);
    this.fSensorPos = createVector(0, 0);
    this.sensorAngle = 45;
    this.sensorDist = 10;
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
