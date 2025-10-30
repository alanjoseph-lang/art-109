

let visuals;          
let REC_DURATION_SEC = 10; 
let SLOW_MOTION = true;    

function setup() {
  createCanvas(1000, 500);      
  frameRate(30);                 
  colorMode(HSB, 360, 100, 100, 1);
  angleMode(DEGREES);
  visuals = new AjTimelapseVisuals();
  visuals.ajLogAJ("Setup complete (HD 1920x1080 @ 30 fps)");
}

function draw() {
  
  background(random(20, 40), 50, 20, 0.1);
  translate(width / 2, height / 2);
  visuals.routeActsAJ();
}

function keyPressed() {
  if (key === 'r' || key === 'R') {
    visuals.recMode = true;
    visuals.ajLogAJ("Starting timelapse capture via saveFrames()...");
    saveFrames('aj_frames', 'png', REC_DURATION_SEC, 30, (frames) => {
      visuals.recMode = false;
      visuals.ajLogAJ(`Saved ${frames.length} frames at 30fps; timelapse capture finished.`);
    });
  }
}

class AjTimelapseVisuals {
  constructor() {
    this.t = 0;                
    this.theta = 0;             
    this.fadeAlpha = 0;        
    this.symmetry = 8;          
    this.angleStep = 360 / this.symmetry;

    this.spiralProgress = 0;    

    this.strobeColors = [
      color(0, 100, 100),   
      color(330, 80, 100),  
      color(280, 80, 100),  
      color(30, 100, 100),  
      color(0, 0, 100)     
    ];

    this.recMode = false;          
    this.stepScale = 1.0;         

    this.ACT_DURATION = 300;
    this.TRANSITION_FRAMES = 30;
  }

  ajLogAJ(msg) {
    const tag = '[AJ]';
    if (typeof console !== 'undefined' && console.log) {
      console.log(`${tag} f=${frameCount} :: ${msg}`);
    }
  }

  routeActsAJ() {
    const frameInAct = frameCount % this.ACT_DURATION;
    const actIndex = ceil(frameCount / this.ACT_DURATION);

    if (frameInAct < this.TRANSITION_FRAMES) {
      this.fadeAlpha = map(frameInAct, 0, this.TRANSITION_FRAMES, 0, 1);
    } else if (frameInAct > this.ACT_DURATION - this.TRANSITION_FRAMES) {
      this.fadeAlpha = map(frameInAct, this.ACT_DURATION - this.TRANSITION_FRAMES, this.ACT_DURATION, 1, 0);
    } else {
      this.fadeAlpha = 1;
    }

    this.stepScale = (this.recMode && SLOW_MOTION) ? 0.5 : 1.0;

    push();
    drawingContext.globalAlpha = this.fadeAlpha;

    if (frameCount <= 300) {
      if (frameCount === 1) this.ajLogAJ("Act 1 – JR Scope + Sine Wave");
      this.ajSineWaveAJ(12, 6, 150, 4);  
      this.ajStrobeAJ();
    } else if (frameCount <= 600) {
      if (frameCount === 301) this.ajLogAJ("Act 2 – Spiral forming + Kaleidoscope overlay");
      this.ajSpiralAJ();
      this.ajKaleidoscopeAJ();
    } else if (frameCount <= 900) {
      if (frameCount === 601) this.ajLogAJ("Act 3 – Spirograph + Colorful Sin Waves");
      this.drawSinWavesAJ();
      this.ajSquareSpirographAJ();
    }
    pop();
  }

  //Act 1: Strobe Effect
  ajStrobeAJ() {
    let col = random(this.strobeColors);
    let lineStartX = sin(this.t) * 200;
    let lineStartY = cos(this.t * 0.8) * 200;
    let lineEndX   = sin(this.t + 10) * 100;
    let lineEndY   = cos(this.t * 0.9 + 10) * 100;

    strokeWeight(2);
    noFill();

    for (let i = 0; i < this.symmetry; i++) {
      push();
      rotate(i * this.angleStep);
      this.glowEffectAJ(() => {
        line(lineStartX, lineStartY, lineEndX, lineEndY);
        scale(1, -1);
        line(lineStartX, lineStartY, lineEndX, lineEndY);
      }, col);
      pop();
    }
    this.t += 2 * this.stepScale;
  }

  //Act 1: Dotted Sine Wave with Glow
  ajSineWaveAJ(xspacing = 12, totalWaves = 6, amplitude = 150, dotSize = 4) {
    push();
    noStroke();

    const w = width;
    const period = w / totalWaves;         
    const dxDeg  = (360 / period) * xspacing; 
    this.theta += 2.5 * this.stepScale;
    let yvalues = [];
    for (let i = 0; i < w / xspacing; i++) {
      yvalues[i] = sin(this.theta + i * dxDeg) * amplitude;
    }

    let baseX = -w / 2;
    for (let i = 0; i < yvalues.length; i++) {
      let col = this.strobeColors[floor(random(this.strobeColors.length))];
      fill(col);
      this.glowEffectAJ(() => {
        ellipse(baseX + i * xspacing, yvalues[i], dotSize, dotSize);
      }, col);
    }
    pop();
  }

  // Act 2: Kaleidoscope Effect
  ajKaleidoscopeAJ() {
    push();
    this.symmetry = floor(random(6, 12));
    this.angleStep = 360 / this.symmetry;

    let col = random(this.strobeColors);
    stroke(hue(col), saturation(col), brightness(col), 0.8);
    strokeWeight(random(1, 3));

    let r = 200 + sin(this.t * 0.5) * 100;
    for (let i = 0; i < this.symmetry; i++) {
      push();
      rotate(i * this.angleStep + this.t * 0.2);
      this.glowEffectAJ(() => {
        line(0, 0, r * sin(this.t / 10), r * cos(this.t / 10));
      }, col);
      pop();
    }
    this.t += 2 * this.stepScale;
    pop();
  }

  // Act 2: Radial Dot
  ajSpiralAJ() {
    push();
    noFill();
    let col = random(this.strobeColors);
    strokeWeight(3);
    let totalPoints = 200;
    if (this.spiralProgress < totalPoints) {
      this.spiralProgress += 2 * this.stepScale;
    }

    for (let i = 0; i < this.spiralProgress; i += 3) {
      let ang = i * 15;
      let r = map(i, 0, totalPoints, 300, 20);
      let x = cos(ang) * r;
      let y = sin(ang) * r;
      this.glowEffectAJ(() => {
        point(x, y);
      }, col);
    }
    pop();
  }

  // Act 3: Colorful Sin Waves
  drawSinWavesAJ() {
    push();
    noFill();
    strokeWeight(2);

    let amp = 60;
    let waveLength = 0.05;
    let dashLength = 20;

    for (let x = -width / 2; x < width / 2; x += dashLength * 1.2) {
      let col = random(this.strobeColors);
      let fadeFactor = (sin((x / width) * 360 + this.t * 3) + 1) / 2;
      let y = -height / 3 + sin((x + this.t * 10) * waveLength) * amp;
      stroke(hue(col), saturation(col), brightness(col), fadeFactor);
      line(x, y,
           x + dashLength,
           -height / 3 + sin((x + dashLength + this.t * 10) * waveLength) * amp);
    }

    for (let x = width / 2; x > -width / 2; x -= dashLength * 1.2) {
      let col = random(this.strobeColors);
      let fadeFactor = (sin((x / width) * 360 - this.t * 3) + 1) / 2;
      let y = height / 3 + sin((x - this.t * 10) * waveLength) * amp;
      stroke(hue(col), saturation(col), brightness(col), fadeFactor);
      line(x, y,
           x - dashLength,
           height / 3 + sin((x - dashLength - this.t * 10) * waveLength) * amp);
    }
    pop();
  }

  // Act 3: Spirograph with Squares
  ajSquareSpirographAJ() {
    push();
    let layers = 4;
    for (let i = 0; i < layers; i++) {
      let col = random(this.strobeColors);
      let size = 150 - i * 25;
      let freq = 2 + i * 0.5;
      let angleOffset = this.t * freq;

      push();
      rotate(angleOffset);
      this.glowEffectAJ(() => {
        this.drawSquarePatternAJ(size, col);
      }, col);
      pop();
    }
    this.t += 1.5 * this.stepScale;
    pop();
  }

  drawSquarePatternAJ(size, col) {
    for (let i = 0; i < 360; i += 45) {
      push();
      rotate(i);
      rectMode(CENTER);
      noFill();
      stroke(col);
      strokeWeight(2);
      rect(cos(i + this.t) * size / 2,
           sin(i + this.t) * size / 2,
           size, size);
      pop();
    }
  }

  // Glow Effect Wrapper
  glowEffectAJ(drawFn, col) {
    push();
    drawingContext.shadowColor = color(hue(col), saturation(col), brightness(col));
    drawingContext.shadowBlur = 25;
    stroke(col);
    if (typeof drawFn === 'function') {
      drawFn();
    }
    pop();
  }
}
