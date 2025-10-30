let jellyGroup = [];
let rotationStage = 0; 

function setup() {
  createCanvas(600, 600);
  colorMode(HSB, 360, 100, 100, 255);
  noStroke();
  for (let i = 0; i < 15; i++) {
    jellyGroup.push(new AJjellyfish(random(width), random(height)));
  }

  for (let j of jellyGroup) j.setRotationStage(rotationStage);
}

function draw() {
  background(210, 80, 12); 
  for (let j of jellyGroup) {
    j.update();
    j.display();
  }
}


function keyPressed() {
  if (key === 'r' || key === 'R') {
    rotationStage = (rotationStage + 1) % 3;
    for (let j of jellyGroup) j.setRotationStage(rotationStage);
  }
}


function mousePressed() {
  const pushRadius = 150;
  for (let j of jellyGroup) {
    j.reactToClick(mouseX, mouseY, pushRadius);
  }
}


class AJjellyfish {
  constructor(x, y) {
    
    this.x = x;
    this.y = y;
    this.speedX = random(-1, 1);
    this.speedY = random(-1, 1);
    this.baseSize = random(60, 110);
    this.size = this.baseSize;
    this.scaleFactor = random(0.8, 1.4);
    this.rotation = random(TWO_PI);
    this.rotationSpeeds = [0.003, 0.015, 0.06];
    this.baseDirection = random([-1, 1]);
    this.rotationSpeed = 0; 
    this.tentacleCount = int(random(7, 11));
    this.tentacle1BaseLength = random(80, 140);
    this.colorHue = random(160, 300);
    this.pulseTimer = 0;
    this.pulseDuration = 25;
    this.friction = 0.97;
  }

  setRotationStage(stage) {
    let mag = this.rotationSpeeds[constrain(stage, 0, this.rotationSpeeds.length - 1)];
    this.rotationSpeed = mag * this.baseDirection;
    this.pulseTimer = this.pulseDuration;
  }

  reactToClick(mx, my, radius) {
    let d = dist(mx, my, this.x, this.y);
    if (d < radius) {
      let angle = atan2(this.y - my, this.x - mx);
      let strength = map(d, 0, radius, 6, 1.5); 
      this.speedX += cos(angle) * strength;
      this.speedY += sin(angle) * strength;
      this.pulseTimer = this.pulseDuration;
    }
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.rotation += this.rotationSpeed;

    if (this.x < 0 || this.x > width) {
      this.speedX *= -1;
      this.x = constrain(this.x, 0, width);
    }
    if (this.y < 0 || this.y > height) {
      this.speedY *= -1;
      this.y = constrain(this.y, 0, height);
    }

    this.speedX *= this.friction;
    this.speedY *= this.friction;

    if (this.pulseTimer > 0) this.pulseTimer--;
  }

  display() {
    push();
    translate(this.x, this.y);
    rotate(this.rotation);
    scale(this.scaleFactor);
    this.displayChildren();
    this.displayParent();
    this.displayPulseOverlay();
    pop();
  }

  displayChildren() {
    this.drawGlow();
    this.drawTentacles();
  }

  drawGlow() {
    noStroke();
    for (let i = 0; i < 5; i++) {
      let pulseBoost = (this.pulseTimer > 0)
        ? map(this.pulseTimer, 0, this.pulseDuration, 40, 0)
        : 0;
      let alpha = constrain(26 - i * 4 + pulseBoost, 8, 255);
      fill((this.colorHue + i * 5) % 360, 80, 100, alpha);
      ellipse(0, 22, this.size * (1.4 - i * 0.12), this.size * (1.9 - i * 0.12));
    }
  }

  drawTentacles() {
    stroke(this.colorHue, 80, 100, 160);
    strokeWeight(5);
    noFill();

    let spacing = this.size / (this.tentacleCount + 1);
    let startY = this.size * 0.27;
    let startX = -this.size / 2.2;
    let tLen = this.tentacle1BaseLength;

    for (let i = 0; i < this.tentacleCount; i++) {
      let xOffset = startX + i * spacing;
      beginShape();
      for (let j = 0; j < tLen; j += 6) {
        let wave = sin(xOffset * 0.12 + j * 0.045 + frameCount * 0.04) * 4;
        vertex(xOffset + wave, startY + j);
      }
      endShape();
    }
  }

  displayParent() {
    noStroke();
    fill(this.colorHue, 75, 96, 150);
    beginShape();
    const bodyW = this.size;
    const bodyH = this.size * 0.58;

    for (let a = -PI, step = PI / 22; a <= 0; a += step) {
      let x = cos(a) * bodyW / 2;
      let y = sin(a) * bodyH;
      vertex(x, y);
    }
    for (let a = 0; a <= PI; a += PI / 12) {
      let x = cos(a) * (bodyW / 2.25);
      let y = bodyH * 0.42 + sin(a) * 6;
      vertex(x, y);
    }
    endShape(CLOSE);

    stroke(this.colorHue, 85, 100, 170);
    strokeWeight(12);
    noFill();
    beginShape();
    for (let x = -bodyW / 2; x <= bodyW / 2; x += 8) {
      let y = bodyH * 0.4 + sin(x * 0.04 + frameCount * 0.02) * 2;;
      vertex(x, y);
    }
    endShape();
  }

  displayPulseOverlay() {
    if (this.pulseTimer > 0) {
      let ringCount = 5; 
      let maxRadius = this.size * 1.5;
      for (let i = 0; i < ringCount; i++) {
        let t = map(i, 0, ringCount - 1, 0, 1);
        let ringAlpha = map(this.pulseTimer, 0, this.pulseDuration, 0, 80 - t * 40);
        let ringHue = (this.colorHue + i * 8) % 360;
        let radius = this.size + t * (maxRadius - this.size) * 0.5;

        noStroke();
        fill(ringHue, 80, 100, ringAlpha); 
        ellipse(0, this.size * 0.18, radius, radius * 0.8); 
      }
    }
  }
}