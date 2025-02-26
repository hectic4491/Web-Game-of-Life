//## Main Objects to pass around the program.

//FIXME: The naming convention is not consistent
//FIXME: The use of the sim and ui object's is not consistent.
//       The functions should be able to take in the objects as arguments.


// ###
// Objects
const sim = {
  // This object will hold the data for our simulation.
  height: 50, // TODO: Make this a user input
  width: 90, // TODO: Make this a user input
  fps: 100, // Milliseconds; i.e.: 10fps
  patternData: undefined, // Where we store the fetched data from the server.
  currentIndex: 0,
  pattern: "Random",
  drawnPattern: undefined,
  drawing: false,
  fetching: false,


  resetAnimation: function() {
    console.log(`sim.resetAnimation() called.`);
    this.patternData = undefined; // We want to reset this.
    this.currentIndex = 0; // We want to rest this.
  }
}


const ui = {
  /* This object relates its properties to elements on index.html and
  provides the starting state of buttons and other elements.
  */
  // Main Container (Home Page)
  mainContainer: document.getElementById("mainContainer"),
  // Header
  pageHeader: document.getElementById("mainHeader"),
  // Button Sections 
  simControlSection: document.getElementById("simControlSection"),
  otherSection: document.getElementById("otherSection"),
  // Buttons
  playBtn: document.getElementById("playButton"),
  backwardBtn: document.getElementById("stepBackwards"),
  forwardBtn: document.getElementById("stepForwards"),
  resetBtn: document.getElementById("resetButton"),
  newBtn: document.getElementById("newButton"),
  jumpToBtn: document.getElementById("jumpToButton"),
  selectBtn: document.getElementById("selectButton"),
  drawBtn: document.getElementById("drawButton"),
  // Button Toggles
  playToggle: false,
  selectToggle: false,
  drawToggle: false,
  // Keydown Booleans
  heldDownKeys: {},
  // Input Fields and Values
  jumpToField: document.getElementById("jumpToField"),
  // ###FIXME### typeContainer still uses the old naming convention.
  // typeContainer should refer to the dialog element 'selectMenu'.
  typeContainer: document.getElementById("typeContainer"),
  // Simulation display
  grid: document.getElementById("grid"),
  // Simulation Info
  patternName: document.getElementById("simulationType"),
  population: document.getElementById("population"),
  generation: document.getElementById("generation"),
  // Menus
  selectMenu: document.getElementById("selectMenu"), // Settings Menu
  

  initialize: function() {
    // Initialize button to disabled.
    this.playBtn.disabled = true;
    this.newBtn.disabled = true;
    this.selectBtn.disabled = true;
    this.drawBtn.disabled = true;
    this.patternName.innerText = `${sim.pattern}`;
    this.generation.innerText = `Gen: 0` ;
    this.population.innerText = `Pop: 0`
  }
}


// ###
// Main
ui.initialize();
fetchSimulation();
generateGrid();


// ##
// Document event listeners.
// Handle down key events.
document.addEventListener('keydown', function(event) {
  // ' ' (space bar) prevent this key from doing it's default function in
  // the browser.
  if (event.key === ' ') {
    event.preventDefault();
    console.log('Space bar pressed - default behavior prevented.');
  }
  // 'p' to play and pause the simulation.
  if (event.key === "p" && !ui.heldDownKeys['p'] && !sim.drawing && !sim.fetching) {
    ui.heldDownKeys['p'] = true;
    ui.playBtn.classList.add('active');

    ui.playBtn.click();

    setTimeout(function() {
      ui.playBtn.classList.remove('active');
    }, 150);
  }
  // 's' to open the select menu.
  if (event.key == "s" && !ui.heldDownKeys['s'] && !sim.drawing && !sim.fetching && !ui.playToggle) {
    ui.heldDownKeys['s'] = true;
    ui.selectBtn.classList.add('active');

    if (!ui.selectMenu.open) {
      selectActionNew();
    } else {
      ui.mainContainer.style.display = "flex";
      ui.selectMenu.close();
    }

    setTimeout(function() {
      ui.selectBtn.classList.remove('active');
    }, 150);
  }
  // '.' (>) to move to the next frame.
  if (event.key == "." && !ui.playToggle && !sim.fetching) {
    ui.forwardBtn.classList.add('active');
    ui.forwardBtn.click();
  }
  // ',' (<) to move to the previous frame.
  if (event.key == "," && !ui.playToggle && !sim.fetching) {
    ui.backwardBtn.classList.add('active');
    ui.backwardBtn.click();
  }
  // 'r' to reset the simulation.) {
  if (event.key == "r" && !ui.heldDownKeys['r'] && !ui.playToggle && !sim.fetching) {
    ui.heldDownKeys['r'] = true;
    ui.resetBtn.classList.add('active');

    ui.resetBtn.click();

    setTimeout(function() {
      ui.resetBtn.classList.remove('active');
    }, 150);
  }
  // 'n' to fetch a new simulation.
  if (event.key == "n" && !ui.heldDownKeys['n'] && !ui.playToggle && !sim.drawing && !sim.fetching) {
    ui.heldDownKeys['n'] = true;
    ui.newBtn.classList.add('active');

    ui.newBtn.click();

    setTimeout(function() {
      ui.newBtn.classList.remove('active');
    }, 150);
  }
  // 'j' to fetch a new simulation.
  if (event.key == "j" && !ui.heldDownKeys['j'] && !ui.playToggle && !sim.drawing && !sim.fetching) {
    ui.heldDownKeys['j'] = true;
    ui.jumpToBtn.classList.add('active');

    ui.jumpToBtn.click();

    setTimeout(function() {
      ui.jumpToBtn.classList.remove('active');
    }, 150);
  }
  // 'd' to toggle the draw mode.
  if (event.key == "d" && !ui.heldDownKeys['d'] && !ui.playToggle && !sim.fetching) {
    ui.heldDownKeys['d'] = true;
    drawAction();
  }
  // 'esc' to toggle the menu visiblity.
  if (event.key == "Escape" && !ui.heldDownKeys['Escape'] && ui.mainContainer.style.display == "none") {
    ui.heldDownKeys['Escape'] = true;
    ui.mainContainer.style.display = "flex";
  }
});

// Handle up key events.
document.addEventListener('keyup', function(event) {
  ui.heldDownKeys[event.key] = false;
  if (event.key == '.') {
    ui.forwardBtn.classList.remove('active');
  }
  if (event.key == ',') {
    ui.backwardBtn.classList.remove('active');
  }
});


// ###
// Functions

//# Generate the grid based off the simulation's dimensions.
function generateGrid () {
/**This create's the cell div elements that will be animated for
 * the Game of Life simulation. It gives them the class name of 'cell'
 * and a unique id that corresponds to their "i-j" coordinates.
 */
  console.log("generateGrid() called.");
  for (let i = 0; i < sim.height; i++) {
    for (let j = 0; j < sim.width; j++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.setAttribute('id', (String(i) + "-" + String(j)));
      ui.grid.appendChild(cell);
    }
  }
}


function toggleCell (event) {
  /**This function is called when a cell is clicked. It toggles the
   * class of the cell between 'cellAlive' and 'cell'. Thus changing
   * the color of the cell. 
   */
  const cell = event.target;
  cell.classList.toggle('cellAlive');
  ui.population.innerText = `Pop: ${ui.grid.querySelectorAll('.cellAlive').length}`;
}


function drawMode(mode) {
  /**This function is called when the draw button is clicked. It adds 
   * an event listener to each cell in the grid that toggles the class
   * of the cell between 'cellAlive' and 'cell' when clicked. This allows
   * the user to draw their own patterns on the grid.
   */
  if (mode) {
    sim.drawing = true;
    const cells = ui.grid.querySelectorAll('.cell');
    cells.forEach((cell) => {
      cell.addEventListener('click', toggleCell);
    });

    // Create Clear button
    const clearBtn = document.createElement('button');
    clearBtn.id = 'clearButton';
    clearBtn.classList.add('button');
    clearBtn.innerText = 'Clear';
    clearBtn.addEventListener('click', () => {
      clearSimulation();
      ui.population.innerText = 'Pop: 0';
    });


    // Create Generate button
    const generateBtn = document.createElement('button');
    generateBtn.id = 'generateButton';
    generateBtn.classList.add('button');
    generateBtn.innerText = 'Generate';
    generateBtn.addEventListener('click', () => {
      fetchSimulation("Drawn");
      ui.drawToggle = false;
      drawMode(false);
      // toggles
      ui.playBtn.disabled = false;
      ui.newBtn.disabled = false;
      ui.selectBtn.disabled = false;
      console.log("generateBtn() initiated. Hiding the draw menu");
    });

    // Insert the buttons after the Draw button
    ui.otherSection.insertBefore(clearBtn, ui.drawBtn.nextSibling);
    ui.otherSection.insertBefore(generateBtn, clearBtn.nextSibling);
  } else {
    sim.drawing = false;
    const cells = ui.grid.querySelectorAll('.cell');
    cells.forEach((cell) => {
      cell.removeEventListener('click', toggleCell);
    });

    const clearButton = document.getElementById('clearButton');
    const generateButton = document.getElementById('generateButton');
    clearButton.remove();
    generateButton.remove();
  }
}


//# Clear the simulation
function clearSimulation () {
  /**Selects all cells of the "cellAlive" class and removes them
   * from that class. Thus the cells revert back to their default
   * class and use the default element's color property.
   * 
   * May want to rework this to just swap in an empty grid -t
   */
  console.log("clearSimulation() called.");

  const childNodes = ui.grid.querySelectorAll('.cellAlive');
  childNodes.forEach((child) => {
    child.classList.toggle('cellAlive');
  });
}


function writeAliveCells() {
  aliveList = sim.patternData[sim.currentIndex]['alive'];

  aliveList.forEach((cell) => {
    let [j, i] = cell;
    const cellId = `${j}-${i}`;
    const targetCell = document.getElementById(cellId);
    targetCell.classList.toggle('cellAlive'); 
  });
}


function moveFrame(index) {
  if (index >= 0 && index < sim.patternData.length) {
    clearSimulation();
    sim.currentIndex = index;
    writeAliveCells();
    ui.generation.innerText = `Gen: ${sim.patternData[index]['generation'] + 1}`;
    ui.population.innerText = `Pop: ${sim.patternData[index]['population']}`;
  } else {
    console.log("Target index invalid")
  }
}


//# Render the simulation. ### TODO ### this function accepts simulation as
// an argument, but also calls global 'sim' variable. Work on only using the 
// the argument and reducing dependence on the sim variable.

function renderSimulation() {
  /**We create an inner function  named writeAlive Cellsthat processes
   * an array of cell id's and adds their class to alive, so that it can
   * be displayed with the new classes color properties. This handles
   * one frame of data at a time.
   */
  console.log("renderSimulation() called.")

  const animation = setInterval(() => {
    if (sim.currentIndex < sim.patternData.length) { 
      // continue if we haven't reached the end of the data array.
      if (ui.playToggle) {
        moveFrame(sim.currentIndex);
        sim.currentIndex++;

      } else {
        // If we ever hit the play/pause button to pause the simulation
        clearInterval(animation);
        pauseSubAction();
        console.log("Simulation Paused.");
      }
    } else {
      // If we reach the end of the animation:
      // (i.e.: index becomes equal or greater than patternData.length )
      clearInterval(animation);
      pauseSubAction();

      // toggles
      ui.playBtn.disabled = false;
      ui.newBtn.disabled = false;
      ui.selectBtn.disabled = false;
      ui.drawBtn.disabled = false;

      console.log("Simulation Finished.")
    }
  }, sim.fps);
}


// ###
// Button wrapper functions.

function playAction() {
  if (!ui.playToggle) {
    playSubAction();
  } else {
    pauseSubAction();
  }
}

function playSubAction () {
  console.log("playSubAction() initiated.")

  //toggles
  ui.playToggle = true;
  ui.playBtn.style.backgroundColor = "var(--color-stop-button-light)"
  ui.playBtn.style.borderColor = "var(--color-stop-button)"
  ui.playBtn.children[0].style.fill = "var(--color-stop-button)"

  ui.backwardBtn.disabled = true;
  ui.forwardBtn.disabled = true;
  ui.resetBtn.disabled = true;
  ui.newBtn.disabled = true;
  ui.jumpToBtn.disabled = true;
  ui.jumpToField.style.visibility = "hidden"; /* we should instead add a class that helps it simulate the button's disabled transition. */
  ui.selectBtn.disabled = true;
  ui.drawBtn.disabled = true;
  
  
  renderSimulation();
  console.log("playSubAction() complete.")
}


function pauseSubAction () {
  console.log("pauseSubAction() initiated.");

  // toggles
  ui.playToggle = false;
  ui.playBtn.style.backgroundColor = "var(--color-start-button-light)"
  ui.playBtn.style.borderColor = "var(--color-start-button)"
  ui.playBtn.children[0].style.fill = "var(--color-start-button)"

  ui.backwardBtn.disabled = false;
  ui.forwardBtn.disabled = false;
  ui.resetBtn.disabled = false;
  ui.newBtn.disabled = false;
  ui.jumpToBtn.disabled = false;
  ui.jumpToField.style.visibility = "visible";
  ui.selectBtn.disabled = false;
  ui.drawBtn.disabled = false;

  console.log("pauseSubAction() complete.");
}

function stepBackwardAction() {
  console.log("stepBackwardAction() initiated.");
  moveFrame(sim.currentIndex - 1);
  console.log("stepBackwardAction() complete.");
}

function stepForwardAction() {
  console.log("stepForwardAction() initiated.");
  moveFrame(sim.currentIndex + 1);
  console.log("stepForwardAction() complete.");
}

function resetAction() {
  console.log("resetAction() initiated.");
  moveFrame(0);
  console.log("resetAction() complete.");
}

function jumpToAction() {
  console.log("jumpToAction() initiated.");
  moveFrame(ui.jumpToField.value - 1);
  ui.jumpToField.value = '';
  console.log("jumpToAction() complete.");
}


function newAction () {
  console.log("newAction() initiated.");
  fetchSimulation(sim.pattern);
  console.log("newAction() complete.");
}


function selectAction () {
  if (!ui.selectToggle) {

    // toggles
    ui.selectToggle = true;
    ui.playBtn.disabled = true;
    ui.newBtn.disabled = true;
    ui.drawBtn.disabled = true;

    ui.typeContainer.style.display = "flex";
    console.log("selectAction() initiated. Showing the select menu");
  } else if (ui.selectToggle) {

    // toggles
    ui.selectToggle = false;
    ui.playBtn.disabled = false;
    ui.newBtn.disabled = false;
    ui.drawBtn.disabled = false;

    ui.typeContainer.style.display = "none";
    console.log("selectAction() initiated. Hiding the select menu");
  };
}

// ###WIP###
function selectActionNew () {
  ui.mainContainer.style.display = "none";
  ui.selectMenu.showModal();
}

function drawAction () {

  if (!ui.drawToggle) {
    ui.drawToggle = true;
    drawMode(true);

    // toggles
    ui.playBtn.disabled = true;
    ui.newBtn.disabled = true;
    ui.selectBtn.disabled = true;
    console.log("drawAction() initiated. Showing the draw menu");

  } else if (ui.drawToggle) {
    ui.drawToggle = false;
    drawMode(false);

    // toggles
    ui.playBtn.disabled = false;
    ui.newBtn.disabled = false;
    ui.selectBtn.disabled = false;
    console.log("drawAction() initiated. Hiding the draw menu");
  }
}


function fetchSimulation(pattern="Random") {
  console.log("fetchSimulation() called.")
  sim.fetching = true;

  const form = new FormData();
  form.append("PatternName", pattern);

  if (pattern === "Drawn") {
    const cells = ui.grid.querySelectorAll('.cellAlive');
    const aliveCells = [];

    cells.forEach((cell) => {
      const cellId = cell.getAttribute('id');
      const [j, i] = cellId.split('-'); // these are strings, they need to be integers
      aliveCells.push([parseInt(j), parseInt(i)]);
    });
    form.append("DrawnPattern", JSON.stringify(aliveCells));
  }

  // Loading UX
  ui.pageHeader.innerText = "Loading";
  ui.generation.innerText = `Gen: 0`;
  ui.population.innerText = `Pop: 0`;
  const loading = setInterval(() => {
    ui.pageHeader.innerText += ".";
    if (ui.pageHeader.innerText.length > 10) {
      ui.pageHeader.innerText = "Loading";
    }
  }, 200);


  clearSimulation();
  sim.resetAnimation();

  // toggles
  ui.playToggle = false;
  ui.selectToggle = false;
  ui.drawToggle = false;
  ui.playBtn.disabled = true;
  ui.backwardBtn.disabled = true;
  ui.forwardBtn.disabled = true;
  ui.resetBtn.disabled = true;
  ui.newBtn.disabled = true;
  ui.jumpToBtn.disabled = true;
  ui.jumpToField.style.visibility = "hidden";
  ui.selectBtn.disabled = true;
  ui.drawBtn.disabled = true;

  fetch('/simdata', {method: "POST", body: form})
    .then((response) => response.json())
    .then((patternData) => {
      sim.patternData = patternData;
      sim.pattern = pattern;
      ui.patternName.innerText =`${pattern}`

      // toggles
      ui.playBtn.disabled = false;
      ui.backwardBtn.disabled = false;
      ui.forwardBtn.disabled = false;
      ui.resetBtn.disabled = false;
      ui.newBtn.disabled = false;
      ui.jumpToBtn.disabled = false;
      ui.jumpToField.style.visibility = "visible";
      ui.selectBtn.disabled = false;
      ui.drawBtn.disabled = false;

      clearInterval(loading);
      ui.pageHeader.innerText = "Conway's Game of Life";

      moveFrame(0);

      sim.fetching = false;
      console.log("fetchSimulation() complete!");
    })
}


// ###
// Attach wrapper functions to buttons.
//###FIXME### prevent certain button clicks from firing off if certain actions have
// been started.
$("#playButton").click(() => playAction()); 
$("#stepForwards").click(() => stepForwardAction());
$("#stepBackwards").click(() => stepBackwardAction());
$("#resetButton").click(() => resetAction()); //###FIXME### need to disable this when sim running.
$("#newButton").click(() => newAction());
$("#jumpToButton").click(() => jumpToAction());
$("#selectButton").click(() => selectActionNew());
$("#drawButton").click(() => drawAction());


$("#type1").click(() => {
  fetchSimulation("Random");
  ui.mainContainer.style.display = "flex";
  ui.selectMenu.close();
});
$("#type2").click(() => {
  fetchSimulation("Blinker");
  ui.mainContainer.style.display = "flex";
  ui.selectMenu.close();
});
$("#type3").click(() => {
  fetchSimulation("Glider");
  ui.mainContainer.style.display = "flex";
  ui.selectMenu.close();
});
$("#type4").click(() => {
  fetchSimulation("Glider Gun");
  ui.mainContainer.style.display = "flex";
  ui.selectMenu.close();
});
