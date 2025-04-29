let gridSize = 3;
let tileSize;
let correctTiles = [];
let selectedTiles = [];
let images = [];
let imgSources = [
  "assets/textures/no_truck_images/00.jpg",
  "assets/textures/no_truck_images/10.jpg",
  "assets/textures/no_truck_images/20.jpg",
  "assets/textures/no_truck_images/01.jpg",
  "assets/textures/no_truck_images/11.jpg",
  "assets/textures/no_truck_images/21.jpg",
  "assets/textures/no_truck_images/02.jpg",
  "assets/textures/no_truck_images/12.jpg",
  "assets/textures/no_truck_images/22.jpg",
];
let padding = 5;
let tileScales = Array(9).fill(1);

function preload() {
  for (let src of imgSources) {
    images.push(loadImage(src));
  }
}

let canvas;  // at the top with other globals

function setup() {
  let canvasSize = min(windowWidth, windowHeight - 180, 600) * 0.9;
  tileSize = (canvasSize / gridSize) - padding;
  canvas = createCanvas(canvasSize, canvasSize);  // <-- NO "let" here
  canvas.parent('sketch-holder');
  canvas.style('display', 'block');
  canvas.style('margin', '0 auto');
  canvas.mousePressed(canvasClicked);
  
  correctTiles = imgSources.map((src, index) => src.includes('correct'));
  selectedTiles = Array(9).fill(false);
}

function draw() {
  background(242, 242, 242); // Set canvas background to match the body background
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      let index = i * gridSize + j;
      let x = j * (tileSize + padding);  // Add padding
      let y = i * (tileSize + padding);  // Add padding
      
      // Move the origin to the center of each tile before scaling
      push();
      translate(x + tileSize / 2, y + tileSize / 2); // Translate to the center of the tile
      scale(tileScales[index]);  // Apply scaling effect
      image(images[index], -tileSize / 2, -tileSize / 2, tileSize, tileSize);  // Draw the image centered
      pop();

      if (selectedTiles[index]) {
        noFill();
        stroke(0, 200, 0);
        strokeWeight(4);
        rect(x, y, tileSize, tileSize);
      }
    }
  }
}

function canvasClicked() {
  let canvasBounds = canvas.elt.getBoundingClientRect(); // get canvas position
  let relX = mouseX * (canvasBounds.width / width);
  let relY = mouseY * (canvasBounds.height / height);

  let j = floor(relX / (tileSize + padding));
  let i = floor(relY / (tileSize + padding));
  
  if (i >= 0 && i < gridSize && j >= 0 && j < gridSize) {
    let index = i * gridSize + j;
    selectedTiles[index] = !selectedTiles[index];
    updateContinueButton();
    tileScales[index] = 0.85;

    setTimeout(() => {
      tileScales[index] = 1;
    }, 200);
  }
}

function windowResized() {
  setup();
}

function showNotification(message, color) {
  const notification = document.getElementById('notification');
  notification.textContent = message;
  notification.style.backgroundColor = color;
  notification.classList.add('show');
  setTimeout(() => {
      notification.classList.remove('show');
  }, 2000); // Hide after 2 seconds
}

// Button logic:
const ctn_btn = document.getElementById("continue-button");

function updateContinueButton() {
  const anySelected = selectedTiles.some(v => v === true);
  ctn_btn.textContent = anySelected ? "Continue" : "Skip";
}

ctn_btn.addEventListener("click", () => {
  const selectedIndexes = selectedTiles
    .map((v, i) => (v ? i : null))
    .filter(i => i !== null);

  const correctIndexes = correctTiles
    .map((v, i) => (v ? i : null))
    .filter(i => i !== null);

  const wrongSelection = selectedIndexes.filter(i => !correctIndexes.includes(i));
  const missedCorrect = correctIndexes.filter(i => !selectedIndexes.includes(i));

  if (wrongSelection.length > 0 || missedCorrect.length > 0) {
    showNotification("Incorrect!", "#e74c3c");
  } else {
    showNotification("Correct!", "#2ecc71");
    selectedTiles = Array(9).fill(false);
    setTimeout(() => {
      window.location.href = "cookies.html";
    }, 500);
  }
});