/**javascript file to control the movement of the 'simulationField'
 * element. We listen for the left, right, up, and down arrow keys.*/ 

//TODO: work on maximum grid position to prevent infinite scrolling.
//FIXME: the grid should maybe move more smoothly.

const gridFrame = document.getElementById('grid-frame');
const grid = document.getElementById('grid');

let gridPosition = { top: 0, left: 0 };
// grid position is initiated at 0, 0


function panGrid(dx, dy) {
  // the panning functionality.
  let newLeft = gridPosition.left + dx;
  let newTop = gridPosition.top + dy;
  
  // Get the border width of the grid
  const borderWidth = parseInt(window.getComputedStyle(grid).borderWidth);

  // Boundary Checks
  const maxLeft = 0;
  const maxTop = 0;
  const minLeft = gridFrame.clientWidth - grid.clientWidth - (2 * borderWidth);
  const minTop = gridFrame.clientHeight - grid.clientHeight - (2 * borderWidth);
  
  // Ensure the new position is within boundaries
  if (newLeft > maxLeft) {newLeft = maxLeft};
  if (newTop > maxTop) {newTop = maxTop};
  if (newLeft < minLeft) {newLeft = minLeft};
  if (newTop < minTop) {newTop = minTop};

  // Update the grid position
  gridPosition.left = newLeft;
  gridPosition.top = newTop;

  // Apply the new position
  grid.style.transform = `translate(${gridPosition.left}px, ${gridPosition.top}px)`;
}

// Accessing buttons and giving them event listeners.
// ### (We don't currently have clickable arrow button html elements.)
// document.getElementById('panLeft').addEventListener('click', () => panGrid(-10, 0));
// document.getElementById('panRight').addEventListener('click', () => panGrid(10, 0));
// document.getElementById('panUp').addEventListener('click', () => panGrid(0, -10));
// document.getElementById('panDown').addEventListener('click', () => panGrid(0, 10));

// Document Event listeners (for keybroad presses to move grid)
let listeningKeys = {};
//let directions = {'left': (), 'right': (), 'up': (), 'down': ()}

document.addEventListener('keydown', function(event) {
  listeningKeys[event.key] = true;
  handleKeyPresses();
});
document.addEventListener('keyup', function(event) {
  listeningKeys[event.key] = false;
  handleKeyPresses();
});

function handleKeyPresses() {
  if (listeningKeys['ArrowLeft'] && listeningKeys['ArrowUp']) {
      panGrid(16, 16);
  } else if (listeningKeys['ArrowLeft'] && listeningKeys['ArrowDown']) {
      panGrid(16, -16);
  } else if (listeningKeys['ArrowRight'] && listeningKeys['ArrowUp']) {
      panGrid(-16, 16);
  } else if (listeningKeys['ArrowRight'] && listeningKeys['ArrowDown']) {
      panGrid(-16, -16);
  } else if (listeningKeys['ArrowLeft']) {
      panGrid(16, 0);
  } else if (listeningKeys['ArrowRight']) {
      panGrid(-16, 0);
  } else if (listeningKeys['ArrowUp']) {
      panGrid(0, 16);
  } else if (listeningKeys['ArrowDown']) {
      panGrid(0, -16);
  }
}