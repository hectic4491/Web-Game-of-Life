/**javascript file to control the movement of the 'grid'
 * element. We listen for the left, right, up, and down arrow keys.*/ 

const moveUi = {
  gridFrame: document.getElementById('gridFrame'),
  grid: document.getElementById('grid'),
  gridPosition: { top: 0, left: 0 },
  listeningMoveKeys: {},

  upArrow: document.getElementById('upArrowButton'),
  leftArrow: document.getElementById('leftArrowButton'),
  downArrow: document.getElementById('downArrowButton'),
  rightArrow: document.getElementById('rightArrowButton'),
}

// Document Event listeners (for keybroad presses to move grid)
document.addEventListener('keydown', function(event) {
  // console.log("Hello from move-grid.js");
  moveUi.listeningMoveKeys[event.key] = true;
  handleMoveKeyPresses();
});

document.addEventListener('keyup', function(event) {
  moveUi.listeningMoveKeys[event.key] = false;
  if (event.key == 'ArrowUp') {
    moveUi.upArrow.classList.remove('active');
  }
  if (event.key == 'ArrowLeft') {
    moveUi.leftArrow.classList.remove('active');
  }
  if (event.key == 'ArrowDown') {
    moveUi.downArrow.classList.remove('active');
  }
  if (event.key == 'ArrowRight') {
    moveUi.rightArrow.classList.remove('active');
  }
  handleMoveKeyPresses();
});


function handleMoveKeyPresses() {
  if (moveUi.listeningMoveKeys['ArrowLeft'] && moveUi.listeningMoveKeys['ArrowUp']) {
      moveUi.leftArrow.classList.add('active');
      moveUi.upArrow.classList.add('active');
      panGrid(16, 16);
  } else if (moveUi.listeningMoveKeys['ArrowLeft'] && moveUi.listeningMoveKeys['ArrowDown']) {
      moveUi.leftArrow.classList.add('active');
      moveUi.downArrow.classList.add('active');
      panGrid(16, -16);
  } else if (moveUi.listeningMoveKeys['ArrowRight'] && moveUi.listeningMoveKeys['ArrowUp']) {
      moveUi.rightArrow.classList.add('active');
      moveUi.upArrow.classList.add('active');
      panGrid(-16, 16);
  } else if (moveUi.listeningMoveKeys['ArrowRight'] && moveUi.listeningMoveKeys['ArrowDown']) {
      moveUi.rightArrow.classList.add('active');
      moveUi.downArrow.classList.add('active');
      panGrid(-16, -16);
  } else if (moveUi.listeningMoveKeys['ArrowLeft']) {
      moveUi.leftArrow.classList.add('active');
      panGrid(16, 0);
  } else if (moveUi.listeningMoveKeys['ArrowRight']) {
      moveUi.rightArrow.classList.add('active');
      panGrid(-16, 0);
  } else if (moveUi.listeningMoveKeys['ArrowUp']) {
      moveUi.upArrow.classList.add('active');
      panGrid(0, 16);
  } else if (moveUi.listeningMoveKeys['ArrowDown']) {
      moveUi.downArrow.classList.add('active');
      panGrid(0, -16);
  }
}


function isOverflowing() {
  // Check if the grid is overflowing the grid frame
  return moveUi.grid.clientWidth > moveUi.gridFrame.clientWidth || moveUi.grid.clientHeight > moveUi.gridFrame.clientHeight;
}


function panGrid(dx, dy) {
  if (!isOverflowing()) {
    return;
  }
  // the panning functionality.
  let newLeft = moveUi.gridPosition.left + dx;
  let newTop = moveUi.gridPosition.top + dy;
  
  // Get the border width of the grid
  const borderWidth = parseInt(window.getComputedStyle(moveUi.grid).borderWidth);

  // Boundary Checks
  const maxLeft = 0;
  const maxTop = 0;
  const minLeft = moveUi.gridFrame.clientWidth - moveUi.grid.clientWidth - (2 * borderWidth);
  const minTop = moveUi.gridFrame.clientHeight - moveUi.grid.clientHeight - (2 * borderWidth);
  
  // Ensure the new position is within boundaries
  if (newLeft > maxLeft) {
    if (Math.abs(newLeft - maxLeft) >= 16) {
      newLeft = maxLeft
    } else {newLeft = moveUi.gridPosition.left};
  };

  if (newTop > maxTop) {
    if (Math.abs(newTop - maxTop) >= 16) {
      newTop = maxTop
    } else {newTop = moveUi.gridPosition.top};
  };

  if (newLeft < minLeft) {
    if (Math.abs(newLeft - minLeft) >= 16) {
      newLeft = minLeft
    } else {newLeft = moveUi.gridPosition.left};
  };

  if (newTop < minTop) {
    if (Math.abs(newTop - minTop) >= 16) {
      newTop = minTop
    } else {newTop = moveUi.gridPosition.top};
  };

  // Update the grid position
  moveUi.gridPosition.left = newLeft;
  moveUi.gridPosition.top = newTop;

  // Apply the new position
  moveUi.grid.style.transform = `translate(${moveUi.gridPosition.left}px, ${moveUi.gridPosition.top}px)`;
}

/* On screen button helper functions */

let holdInterval;

function startPanning(x, y) {
  panGrid(x, y);
  holdInterval = setInterval(() => panGrid(x, y), 30); 
}

function stopPanning() {
  if (holdInterval) {
    clearInterval(holdInterval);
    holdInterval = null; 
  }
} 

// Accessing buttons and giving them event listeners.
$('#leftArrowButton').mousedown(function() {
  startPanning(16, 0)
});
$('#leftArrowButton').mouseup(stopPanning);
$('#leftArrowButton').mouseleave(stopPanning);

$('#rightArrowButton').mousedown(function() {
  startPanning(-16, 0)
});
$('#rightArrowButton').mouseup(stopPanning);
$('#rightArrowButton').mouseleave(stopPanning);

$('#upArrowButton').mousedown(function() {
  startPanning(0, 16)
});
$('#upArrowButton').mouseup(stopPanning);
$('#upArrowButton').mouseleave(stopPanning);

$('#downArrowButton').mousedown(function() {
  startPanning(0, -16)
});
$('#downArrowButton').mouseup(stopPanning);
$('#downArrowButton').mouseleave(stopPanning);