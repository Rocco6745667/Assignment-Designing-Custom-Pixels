//Assignment: Designing Custom Pixels
//Rocco Ali
//218008847
//10/09/2024

let cam;
let useImage = true;  // Flag to toggle between image and webcam mode
let tileSize = 20;    // Size of each tile
let jitter = 5;       // Irregularity for lattice
let img;              // Static image   

function preload() {
  img = loadImage('data/art.jpeg');  // Load the static image
}

function setup() {
  createCanvas(600, 600);
  img.resize(width, height);  // Resize image to fit the canvas

  // Initialize webcam
  cam = createCapture(VIDEO);
  cam.size(width, height);
  cam.hide();
}

function draw() {
  if (useImage) {
    renderStaticImage();  // Render static image with custom hexagon pixels
  } else {
    renderWebcam();       // Render live webcam feed with hexagon pixels and motion effects
  }
}

// Static Image Mode
function renderStaticImage() {
  background(255);
  img.loadPixels();

  for (let y = 0; y < img.height; y += tileSize) {
    for (let x = 0; x < img.width; x += tileSize) {
      let i = (y * img.width + x) * 4;
      let r = img.pixels[i];
      let g = img.pixels[i + 1];
      let b = img.pixels[i + 2];

      let brightness = (r + g + b) / 3;
      let hexSize = map(brightness, 0, 255, tileSize / 2, tileSize);

      let jitterX = random(-jitter, jitter);
      let jitterY = random(-jitter, jitter);

      drawHexagon(x + jitterX, y + jitterY, hexSize, color(r, g, b));
    }
  }
}

// Webcam Mode with Motion Blur
function renderWebcam() {
  background(255, 10);  // Semi-transparent background for motion trails
  cam.loadPixels();

  for (let i = 0; i < 100; i++) {  // Draw 100 random hexagons per frame
    let x = random(cam.width);
    let y = random(cam.height);

    let camX = floor(x);
    let camY = floor(y);
    let index = (camY * cam.width + camX) * 4;

    let r = cam.pixels[index];
    let g = cam.pixels[index + 1];
    let b = cam.pixels[index + 2];

    let brightness = (r + g + b) / 3;
    let hexSize = map(brightness, 0, 255, 5, tileSize);  // Size based on brightness

    drawHexagon(x, y, hexSize, color(r, g, b));
  }
}

// Draw hexagon function
function drawHexagon(x, y, size, c) {
  push();
  translate(x, y);
  fill(c);
  stroke(0);
  beginShape();
  for (let i = 0; i < 6; i++) {
    let angle = TWO_PI / 6 * i;
    let x_off = cos(angle) * size;
    let y_off = sin(angle) * size;
    vertex(x_off, y_off);
  }
  endShape(CLOSE);
  pop();
}

// Switch between static image and webcam mode
function keyPressed() {
  if (key == ' ') {
    useImage = !useImage;
    if (!useImage) {
      cam.loop();  // Activate webcam
    }
  }
}
