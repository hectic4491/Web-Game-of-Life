const grid = document.getElementById('grid');
// grid is the entire simulation field.

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
document.getElementById('panLeft').addEventListener('click', () => panGrid(-10, 0));
document.getElementById('panRight').addEventListener('click', () => panGrid(10, 0));
document.getElementById('panUp').addEventListener('click', () => panGrid(0, -10));
document.getElementById('panDown').addEventListener('click', () => panGrid(0, 10));

// Document Event listeners (for keybroad presses to move grid)
let listeningKeys = {};

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
      console.log('ArrowLeft & ArrowUp pressed -> moving grid left-up.');
      panGrid(-10, -10);
  } else if (listeningKeys['ArrowLeft'] && listeningKeys['ArrowDown']) {
      console.log('ArrowLeft & ArrowDown pressed -> moving grid left-down.');
      panGrid(-10, 10);
  } else if (listeningKeys['ArrowRight'] && listeningKeys['ArrowUp']) {
      console.log('ArrowRight & ArrowUp pressed -> moving grid right-up.');
      panGrid(10, -10);
  } else if (listeningKeys['ArrowRight'] && listeningKeys['ArrowDown']) {
      console.log('ArrowRight & ArrowDown pressed -> moving grid right-down.');
      panGrid(10, 10);
  } else if (listeningKeys['ArrowLeft']) {
      console.log('ArrowLeft pressed -> moving grid left.');
      panGrid(-10, 0);
  } else if (listeningKeys['ArrowRight']) {
      console.log('ArrowRight pressed -> moving grid right.');
      panGrid(10, 0);
  } else if (listeningKeys['ArrowUp']) {
      console.log('ArrowUp pressed -> moving grid up.');
      panGrid(0, -10);
  } else if (listeningKeys['ArrowDown']) {
      console.log('ArrowDown pressed -> moving grid down.');
      panGrid(0, 10);
  }
}

// For the css, I think the trick is to play around with the other
// elements 'overflow: hidden;' css property. The element that doesn't
// have this property is set to a transparent (invisible) color; i.e.:
// the display element in which we will see the underlying grid element.

// the grid is parallel to the simulation field, and the display is...
// one of my html elements. This should be straightforward.