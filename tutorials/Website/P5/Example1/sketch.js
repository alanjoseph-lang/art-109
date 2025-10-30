
let lxo = -5;
let lyo = 100;
let leftEyeX = -60;
let leftEyeY = -30;
let rightEyeX = 60;
let rightEyeY = -30;

let headX, headY; 
let offsetX, offsetY;
let dragging = false;

let bg;


function setup() {
  createCanvas(600,600);
  noStroke();
  colorMode(HSB, 360, 100, 100);
  
  headX = width / 2;
  headY = height / 2;
  
  bg = createGraphics(600, 600);
  bg.noStroke();
  bg.colorMode(HSB, 360, 100, 100);

  bg.background(120, 60, 30); 
  for (let i = 0; i < 600; i += 33) {
    for (let j = 0; j < 600; j += 33) {
      let hue = random(100, 140);   
      let sat = random(40, 80);    
      let bri = random(40, 90);     
      bg.fill(hue, sat, bri);
      bg.ellipse(i + 5, j + 5, 10, 10);
    }
  }
}

function draw() {

  image(bg, 0, 0);       

  push();
  translate(headX, headY);

  noStroke();

  // Ears and Neck
  fill("#5C2F1C");
  ellipse(-150, -50, 150, 200);
  ellipse(150, -50, 150, 200);

  fill("#c3ab94ff");
  ellipse(-150, -50, 110, 160);
  ellipse(150, -50, 110, 160);

  fill("#5C2F1C");
  rect(-50, 50, 100, 100, 20);

  // Head
  fill("#7B3D23");
  beginShape();
  vertex(-130, -120); 
  vertex(-75,-150);
  vertex(0,-170);
  vertex(75,-150);
  vertex(130, -120);  
  vertex(140, -70);  
  vertex(140, 30);   
  vertex(90, 75);   
  vertex(0, 105);    
  vertex(-90, 75);  
  vertex(-140, 20); 
  vertex(-140, -50); 
  endShape(CLOSE); 

  // Face
  fill("peachpuff");
  beginShape();
  vertex(-110, -100); 
  vertex(-55,-130);
  vertex(0,-70);
  vertex(55,-130);
  vertex(110, -100);  
  vertex(120, -50);  
  vertex(120, 20);   
  vertex(90, 70);   
  vertex(0, 100);    
  vertex(-90, 70);  
  vertex(-120, 20); 
  vertex(-120, -50); 
  endShape(CLOSE); 

  // Eyes
  fill("white");
  ellipse(-60, -30, 50,60);
  ellipse(60, -30, 50,60);

  // Pupils
   fill("black");
    let pupilRangeX = 5; 
    let pupilRangeY = 10; 

    let leftPupilX = leftEyeX + map(mouseX, 0, width, -pupilRangeX, pupilRangeX);
    let leftPupilY = leftEyeY + map(mouseY, 0, height, -pupilRangeY, pupilRangeY);

    let rightPupilX = rightEyeX + map(mouseX, 0, width, -pupilRangeX, pupilRangeX);
    let rightPupilY = rightEyeY + map(mouseY, 0, height, -pupilRangeY, pupilRangeY);

    ellipse(leftPupilX, leftPupilY, 20, 30);
    ellipse(rightPupilX, rightPupilY, 20, 30);

  // Nose
  fill("#A87B64");
    noStroke();
    ellipse(0, 10, 30,20);

  // Eyebrows
  fill("#A87B64")
    rect(-95, -80, 50, 10, 20);
    rect(45, -80, 50, 10, 20);

  // Mouth
  fill("#A87B64")
  rect(-25, 40, 50, 10, 20);


   
  pop();

}

// --- mouse interaction ---
function mousePressed() {
  // check if clicking near head
  if (dist(mouseX, mouseY, headX, headY) < 200) {
    dragging = true;
    offsetX = headX - mouseX;
    offsetY = headY - mouseY;
  }
}

function mouseDragged() {
  if (dragging) {
    headX = mouseX + offsetX;
    headY = mouseY + offsetY;
  }
}

function mouseReleased() {
  dragging = false;
}
