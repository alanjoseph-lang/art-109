

let currentkey = '1';
let bgc ;
let gkcount;
let strokeStartX, strokeStartY;
let isDrawing = false;

function setup() {
    createCanvas(1200, 800);
    noStroke();
    background(255);
    smooth();
    bgc = color(255);
    gkcount = 20;
}


function draw() {
   
    if( keyIsPressed) {
      clear_print();
    }

    if(mouseIsPressed) {
     drawChoice();
    }
}

function mousePressed() {
  strokeStartX = mouseX;
  strokeStartY = mouseY;
  isDrawing = true;
}

function mouseReleased() {
  isDrawing = false;
}

function drawChoice() {



  let currentkey = key;

switch(currentkey) {

case '1':
  console.log("Simple line");
  simpleLineBrush(mouseX, mouseY, pmouseX, pmouseY);
  break;

case '2':
  console.log("Pixel Squares");  
  ajbrushPixelSquares(gkcount, mouseX, mouseY, pmouseX, pmouseY);
  if (gkcount > 50 ) {
        gkcount = 5;
    } else {
       gkcount += .5;
    }
  break;

case '3':
  console.log("Halftone");  
  ajbrushHalftone(gkcount, mouseX, mouseY, pmouseX, pmouseY);
  if (gkcount > 50 ) {
        gkcount = 5;
    } else {
       gkcount += .5;
    }
  break;

case '4':
  console.log("Hatch Halftone");  
  ajbrushHatchHalftone(gkcount, mouseX, mouseY, pmouseX, pmouseY);
  break;

case '5':
  console.log("Cross Hatch Halftone");  
  ajbrushCrossHatchHalftone(gkcount, mouseX, mouseY, pmouseX, pmouseY);
  break;

case '6':
    console.log("Screentone");  
  ajbrushScreentone(gkcount, mouseX, mouseY, pmouseX, pmouseY);
  break;

 case '7':
  console.log("Radial");  
  ajbrushRadial(gkcount, mouseX, mouseY, pmouseX, pmouseY);
  break;

 case 'z':
  console.log("eraser");  
  eraser(bgc,mouseX, mouseY,25);
  default:             
  console.log("None");   
  break;
}

}

function simpleLineBrush(lx, ly, px, py) {
  stroke(0);         
  strokeWeight(10);   
  line(px, py, lx, ly);
}

function ajbrushPixelSquares(k, lx, ly, px, py) {
  noStroke();
  let count = int(random(5, 15)); 
  for (let i = 0; i < count; i++) {
    let ox = random(-k, k);
    let oy = random(-k, k);
    let sz = random(5, 10); 
    fill(random(255), random(255), random(255));
    rect(lx + ox, ly + oy, sz, sz);
  }
}

function ajbrushHalftone(k, lx, ly, px, py) {
  noStroke();
  let spacing = 10; 
  let dotSize;

  for (let x = -k; x <= k; x += spacing) {
    for (let y = -k; y <= k; y += spacing) {
      let d = dist(0, 0, x, y);
      dotSize = map(d, 0, k, spacing, 2); 

      fill(random(0, 50), random(0, 60), random(0, 70)); 
      ellipse(lx + x, ly + y, dotSize, dotSize);
    }
  }
}


function ajbrushHatchHalftone(k, lx, ly, px, py) {
  stroke(0);
  strokeWeight(1);

  let spacing = 8; 
  for (let x = -k; x <= k; x += spacing) {
    for (let y = -k; y <= k; y += spacing) {
      let d = dist(0, 0, x, y);
      let len = map(d, 0, k, spacing, 2); 

      push();
      translate(lx + x, ly + y);
      rotate(radians(45)); 
      line(-len / 2, 0, len / 2, 0);
      pop();
    }
  }
}

function ajbrushCrossHatchHalftone(k, lx, ly, px, py) {
  stroke(0);
  strokeWeight(1);

  let spacing = 6; 
  for (let x = -k; x <= k; x += spacing) {
    for (let y = -k; y <= k; y += spacing) {
      let d = dist(0, 0, x, y);
      let len = map(d, 0, k, spacing * 2.5, 4);

      push();
      translate(lx + x, ly + y);

      rotate(radians(45));
      line(-len, 0, len, 0);

      rotate(radians(90));
      line(-len, 0, len, 0);

      pop();
    }
  }
}

function ajbrushScreentone(k, lx, ly, px, py) {
  noStroke();
  let spacing = 12;   
  let baseSize = 10;  

  for (let x = -k; x <= k; x += spacing) {
    for (let y = -k; y <= k; y += spacing) {
      let d = dist(0, 0, x, y);
      let sz = map(d, 0, k, baseSize * 1.5, 2); 
      fill(0); 
      ellipse(lx + x, ly + y, sz, sz);
    }
  }
}


function ajbrushRadial(k, lx, ly, px, py) {
  stroke(0);
  strokeWeight(2);

  let rays = 36; 
  let radius = k * 8; 

  for (let i = 0; i < rays; i++) {
    let angle = TWO_PI * (i / rays);
    let x2 = lx + cos(angle) * radius;
    let y2 = ly + sin(angle) * radius;
    line(lx, ly, x2, y2);
  }
}


function eraser( k, lx, ly, sz) {
  fill(k);
  stroke(k);
  ellipse(lx, ly, sz,sz);
}

function clear_print() {

  if (key == 'x' || key == 'X') {
    background(255);
  } else if (key == 'p' || key == 'P') {
    saveFrames('image-0', 'png', 1, 1);
    key = '';  
  }

}