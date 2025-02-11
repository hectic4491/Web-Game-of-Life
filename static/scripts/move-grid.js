/**javascript file to control the movement of the 'simulationField'
 * element. We listen for the left, right, up, and down arrow keys.*/ 

//TODO: work on maximum grid position to prevent infinite scrolling.
//FIXME: the grid should maybe move more smoothly.

const grid = document.getElementById('grid');

let gridPosition = { top: 0, left: 0 };
// grid position is initiated at 0, 0


function panGrid(dx, dy) {
  // the panning functionality.
  gridPosition.left += dx;
  gridPosition.top += dy;
  
  // the style attributes being modified.
  grid.style.left = `${gridPosition.left}px`;
  grid.style.top = `${gridPosition.top}px`;
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


//Notes**

/**
 * The gridPosition object is used to keep track of the grid's position.
 * We keep track of the top and left positions. When those are at 0, the
 * grid is at it's upper left most corner. To traverse down or right
 * across the grid, we add increments of 16px. 
 * 
 * Therefore, if the change in position should yield either a negative
 * top or left value, then if we wanted to prevent infinite moving into
 * that direction, we should prevent the grid from moving further left
 * or right. We need a max value of the positive left (right) and
 * positive top (down) to prevent infinite scrolling in the other
 * directions.*/