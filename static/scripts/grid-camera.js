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


// For the css, I think the trick is to play around with the other
// elements 'overflow: hidden;' css property. The element that doesn't
// have this property is set to a transparent (invisible) color; i.e.:
// the display element in which we will see the underlying grid element.

// the grid is parallel to the simulation field, and the display is...
// one of my html elements. This should be straightforward.