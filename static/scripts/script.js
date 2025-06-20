// sim object
const sim = {
  height: 50, // TODO: Make this a user input
  width: 90, // TODO: Make this a user input
  fps: 1000/12, // Milliseconds; i.e.: 10fps
  patternData: undefined, // Where we store the fetched data from the server.
  currentIndex: 0,
  patternName: "Random",
  drawnPattern: undefined,
  fetching: false,

  resetAnimation: function() {
    console.log(`sim.resetAnimation() called.`);
    this.patternData = undefined; // We want to reset this.
    this.currentIndex = 0; // We want to rest this.
  }
}


// ui object
const ui = {
  /* This object relates its properties to elements on index.html and
  provides the starting state of buttons and other elements.
  */
  // Main Container (Home Page)
  mainContainer: document.getElementById("mainContainer"),
  // Game Ttitle
  gameTitle: document.getElementById("gameTitle"),
  // Button Sections 
  simCategoryControls: document.getElementById("simButtonCategory"),
  selectDrawCategoryControls: document.getElementById("selectDrawButtonCategory"),
  drawCategoryControls: document.getElementById("drawButtonCategory"),
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
    this.patternName.textContent = `${sim.patternName}`;
    this.generation.textContent = `Gen: 0` ;
    this.population.textContent = `Pop: 0`
    this.drawCategoryControls.style.width=this.selectDrawCategoryControls.width;
    this.drawCategoryControls.style.height=this.selectDrawCategoryControls.height;
  }
}


// Main
ui.initialize();
fetchSimulation();
generateGrid();


// Events - Keys
// Handle down key events.
document.addEventListener('keydown', function(event) {
  // ' ' (space bar) prevent this key from doing it's default function in
  // the browser.
  if (event.key === ' ') {
    event.preventDefault();
    console.log('Space bar pressed - default behavior prevented.');
  }
  // 'p' to play and pause the simulation.
  if (event.key === "p" && !ui.heldDownKeys['p'] && !sim.fetching) {
    ui.heldDownKeys['p'] = true;
    ui.playBtn.classList.add('active');

    ui.playBtn.click();

    setTimeout(function() {
      ui.playBtn.classList.remove('active');
    }, 150);
  }
  // 's' to open the select menu.
  if (event.key == "s" && !ui.heldDownKeys['s'] && !sim.fetching && !ui.playToggle) {
    ui.heldDownKeys['s'] = true;
    ui.selectBtn.classList.add('active');

    ui.selectBtn.click();

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
  if (event.key == "n" && !ui.heldDownKeys['n'] && !ui.playToggle && !sim.fetching) {
    ui.heldDownKeys['n'] = true;
    ui.newBtn.classList.add('active');

    ui.newBtn.click();

    setTimeout(function() {
      ui.newBtn.classList.remove('active');
    }, 150);
  }
  // 'j' to fetch a new simulation.
  if (event.key == "j" && !ui.heldDownKeys['j'] && !ui.playToggle && !sim.fetching) {
    ui.heldDownKeys['j'] = true;
    ui.jumpToBtn.classList.add('active');

    ui.jumpToBtn.click();

    setTimeout(function() {
      ui.jumpToBtn.classList.remove('active');
    }, 150);
  }
  // 'd' to toggle the draw mode.
  // if (event.key == "d" && !ui.heldDownKeys['d'] && !ui.playToggle && !sim.fetching) {
  //   ui.heldDownKeys['d'] = true;
  //   ui.drawBtn.classList.add('active');

  //   ui.drawBtn.click();

  //   setTimeout(function() {
  //     ui.drawBtn.classList.remove('active');
  //   }, 150);
  // }
  
  // 'esc' to toggle the menu visiblity.
  // ### WARNING ###
  // This will have to depend on which menu is being shown.
  if (event.key == "Escape" && !ui.heldDownKeys['Escape']) {
    ui.heldDownKeys['Escape'] = true;
    if (ui.selectMenu.open) {
      ui.selectBtn.click();
    }
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


// Events - Buttons
$("#playButton").click(() => playAction()); 
$("#stepForwards").click(() => stepForwardAction());
$("#stepBackwards").click(() => stepBackwardAction());
$("#resetButton").click(() => resetAction());
$("#newButton").click(() => newAction());
$("#jumpToButton").click(() => jumpToAction());
$("#selectButton").click(() => selectAction());
// $("#drawButton").click(() => drawAction());
/* Clicking outside of the select menu returns to main screen */
$("#selectMenu").click(event => {
  const rect = ui.selectMenu.getBoundingClientRect();
  const isInDialog =
    event.clientX >= rect.left &&
    event.clientX <= rect.right &&
    event.clientY >= rect.top &&
    event.clientY <= rect.bottom;
  if (!isInDialog) {
    selectAction();
  }
});


// Functions
// Functions - Utility 
function generateGrid () {
/**Generate the grid based off the simulation's dimensions.
 * This create's the cell div elements that will be animated for
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
  ui.population.textContent = `Pop: ${ui.grid.querySelectorAll('.cellAlive').length}`;
}

function clearSimulation () {
  /**Clear the simulationSelects all cells of the "cellAlive"
   * class and removes them from that class. Thus the cells
   * revert back to their default class and use the default
   * element's color property.
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
    ui.generation.textContent = `Gen: ${sim.patternData[index]['generation'] + 1}`;
    ui.population.textContent = `Pop: ${sim.patternData[index]['population']}`;
  } else {
    console.log("Target index invalid")
  }
}

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

// Functions - Button .click() 
function playAction() {
  if (!ui.playToggle) {
    playSubAction();
  } else {
    ui.playToggle = false;
  }
}

function playSubAction () {
  console.log("playSubAction() initiated.")

  //toggles
  ui.playToggle = true;
  ui.playBtn.classList.remove('playButton');
  ui.playBtn.classList.add('pauseButton');
  ui.playBtn.children[0].classList.add('paused');

  ui.backwardBtn.disabled = true;
  ui.forwardBtn.disabled = true;
  ui.resetBtn.disabled = true;
  ui.newBtn.disabled = true;
  ui.jumpToBtn.disabled = true;
  ui.jumpToField.style.visibility = "hidden"; /* we should instead add a class that helps it simulate the button's disabled transition. */
  ui.selectBtn.disabled = true;
  ui.drawBtn.disabled = true;

  /* ### TODO ### -> use this section to create and display the empty button graphics for the disabled buttons.
  const emptyGraphic = ui.backwardBtn.nextElementSibling;
  emptyGraphic.classList.toggle('visible');
  */

  renderSimulation();

  console.log("playSubAction() complete.")
}

function pauseSubAction () {
  console.log("pauseSubAction() initiated.");

  // toggles
  ui.playToggle = false;
  ui.playBtn.classList.remove('pauseButton');
  ui.playBtn.classList.add('playButton');
  ui.playBtn.children[0].classList.remove('paused');

  ui.backwardBtn.disabled = false;
  ui.forwardBtn.disabled = false;
  ui.resetBtn.disabled = false;
  if (sim.patternName === 'Random'){
    ui.newBtn.disabled = false;
  }
  ui.jumpToBtn.disabled = false;
  ui.jumpToField.style.visibility = "visible";
  ui.selectBtn.disabled = false;
  ui.drawBtn.disabled = false;

  /* ### TODO ### -> use this section to remove and hide the empty button graphics for the disabled buttons.
  const emptyGraphic = ui.backwardBtn.nextElementSibling;
  emptyGraphic.classList.toggle('visible');
  */

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
  fetchSimulation(sim.patternName);
  console.log("newAction() complete.");
}

function selectAction() {
  if (!ui.selectToggle) {
    ui.selectToggle = true;
    ui.playBtn.disabled = true;
    ui.backwardBtn.disabled = true;
    ui.forwardBtn.disabled = true;
    ui.resetBtn.disabled = true;
    ui.newBtn.disabled = true;
    ui.jumpToBtn.disabled = true;
    ui.jumpToField.style.visibility = "hidden";
    ui.drawBtn.disabled = true;
    ui.selectMenu.showModal();
    console.log("selectAction() initiated. Showing the select menu");
  } else {
    ui.selectToggle = false;
    ui.selectToggle = false;
    ui.playBtn.disabled = false;
    ui.backwardBtn.disabled = false;
    ui.forwardBtn.disabled = false;
    ui.resetBtn.disabled = false;
    ui.newBtn.disabled = false;
    ui.jumpToBtn.disabled = false;
    ui.jumpToField.style.visibility = "visible";
    ui.drawBtn.disabled = false;
    ui.selectMenu.close();
    console.log("selectAction() initiated. Hiding the select menu");
  }
}
// ###WIP!!! drawAction() and the draw functionality is WIP
function drawAction () {
  if (!ui.drawToggle) {
    drawStartSubAction();
  } else {
    drawStopSubAction();
  }
}

function drawStartSubAction() {
  /**This function is called when the draw button is clicked. It adds 
   * an event listener to each cell in the grid that toggles the class
   * of the cell between 'cellAlive' and 'cell' when clicked. This allows
   * the user to draw their own patterns on the grid.
   */
  console.log("drawStartSubAction() initiated. Showing the draw menu");

  ui.drawToggle = true;
  ui.gameTitle.textContent = "Draw Mode";

  // toggles
  ui.playBtn.disabled = true;
  ui.backwardBtn.disabled = true;
  ui.forwardBtn.disabled = true;
  ui.resetBtn.disabled = true;
  ui.newBtn.disabled = true;
  ui.jumpToBtn.disabled = true;
  ui.jumpToField.style.visibility = "hidden"; /* we should instead add a class that helps it simulate the button's disabled transition. */
  ui.selectBtn.disabled = true;

  // Add event listeners to each cell
  const cells = ui.grid.querySelectorAll('.cell');
  cells.forEach((cell) => {
    cell.addEventListener('click', toggleCell);
  });

  // Reformat the Control Section
  // TODO

  // Create Button Row
  const buttonRowA = document.createElement('div');
  buttonRowA.classList.add('buttonRow');
  ui.drawCategoryControls.style.width = ui.selectDrawCategoryControls.style.width;

  // Create Back button
  const backBtn = document.createElement('button');
  backBtn.classList.add('button');
  backBtn.classList.add('generalButton');
  backBtn.id = 'backButton';
  backBtn.title = "[ d ] - Back";
  backBtn.addEventListener('click', () => {
    drawStopSubAction();
  });
  // Create Back button SVG
  const backBtnSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  backBtnSvg.classList.add('mediumSquareSVG');
  backBtnSvg.classList.add('backIcon');
  backBtnSvg.setAttribute('viewBox', '0 0 50 50');
  // Create Back button SVG Path
  const backBtnPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  backBtnPath.setAttribute('d', 'M 3 3 L 47 3 L 47 47 L 3 47 Z');
  // Append the path to the SVG
  backBtnSvg.appendChild(backBtnPath);
  backBtn.appendChild(backBtnSvg);
  

  // Create Clear button
  const clearBtn = document.createElement('button');
  clearBtn.classList.add('button');
  clearBtn.classList.add('generalButton');
  clearBtn.id = 'clearButton';
  clearBtn.title = "[ c ] - Clear grid";
  clearBtn.addEventListener('click', () => {
    clearSimulation();
    ui.population.textContent = 'Pop: 0';
  });
  // Create Clear button SVG
  const clearBtnSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  clearBtnSvg.classList.add('mediumSquareSVG');
  clearBtnSvg.classList.add('clearIcon');
  clearBtnSvg.setAttribute('viewBox', '0 0 50 50');
  // Create Clear button SVG Path
  const clearBtnPath = document.createElementNS('http://www.w3.org/2000/svg', 'path')
  clearBtnPath.setAttribute('d', 'M 3 3 L 47 3 L 47 47 L 3 47 Z');
  // Append the path to the SVG
  clearBtnSvg.appendChild(clearBtnPath);
  clearBtn.appendChild(clearBtnSvg);

  // Create Generate button
  // const generateBtn = document.createElement('button');
  // generateBtn.id = 'generateButton';
  // generateBtn.classList.add('button');
  // generateBtn.textContent = 'Generate';
  // generateBtn.addEventListener('click', () => {
  //   fetchSimulation("Drawn");
  //   ui.drawToggle = false;
  //   drawMode(false);
  //   // toggles
  //   ui.playBtn.disabled = false;
  //   ui.newBtn.disabled = false;
  //   ui.selectBtn.disabled = false;
  //   console.log("generateBtn() initiated. Hiding the draw menu");
  // });

  // Insert the buttons into the drawButtonCategory
  ui.drawCategoryControls.appendChild(buttonRowA);
  buttonRowA.appendChild(clearBtn);
  buttonRowA.appendChild(backBtn);


  console.log(ui.drawCategoryControls.style.width);
  console.log(ui.selectDrawCategoryControls.style.width);
console.log(ui.gameTitle.style.width);

  // enable the keyboard event listeners
}

function drawStopSubAction() {
  /**This function is called when the draw button is clicked. It adds 
   * an event listener to each cell in the grid that toggles the class
   * of the cell between 'cellAlive' and 'cell' when clicked. This allows
   * the user to draw their own patterns on the grid.
   */
  console.log("drawStopSubAction() initiated. Hiding the draw menu");

  ui.drawToggle = false;

  ui.gameTitle.textContent = "Conway's Game of Life";

  // toggles
  ui.playBtn.disabled = false;
  ui.backwardBtn.disabled = false;
  ui.forwardBtn.disabled = false;
  ui.resetBtn.disabled = false;
  ui.newBtn.disabled = false;
  ui.jumpToBtn.disabled = false;
  ui.jumpToField.style.visibility = "visible"; /* we should instead add a class that helps it simulate the button's disabled transition. */
  ui.selectBtn.disabled = false;

  const cells = ui.grid.querySelectorAll('.cell');
  cells.forEach((cell) => {
    cell.removeEventListener('click', toggleCell);
  });

  // Reformat the Control Section
  // TODO

  // remove the buttons from the drawButtonCategory
  const clearButton = document.getElementById('clearButton');
  clearButton.parentElement.remove(); // remove the button row
  clearButton.remove();
  // const generateButton = document.getElementById('generateButton');
  // generateButton.remove();

  // disable the keyboard event listeners
}

// Functions - Fetching
function loadSimulation() {

  const form = new FormData();

  form.append("PatternName", JSON.stringify($("body").data("selection").patternName));
  form.append("PatternData", JSON.stringify($("body").data("selection").patternData));

  // Loading UX
  ui.gameTitle.textContent = "Loading";
  ui.generation.textContent = `Gen: 0`;
  ui.population.textContent = `Pop: 0`;
  const loading = setInterval(() => {
    ui.gameTitle.textContent += ".";
    if (ui.gameTitle.textContent.length > 10) {
      ui.gameTitle.textContent = "Loading";
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

  fetch('/loadsim', {method: "POST", body: form})
    .then((response) => response.json())
    .then((patternData) => {

      sim.patternData = patternData;
      sim.patternName = $("body").data("selection").patternName;
      ui.patternName.textContent = $("body").data("selection").patternName;

      // toggles
      ui.playBtn.disabled = false;
      ui.backwardBtn.disabled = false;
      ui.forwardBtn.disabled = false;
      ui.resetBtn.disabled = false;
      if (sim.patternName === 'Random') {
        ui.newBtn.disabled = false;
      }
      ui.jumpToBtn.disabled = false;
      ui.jumpToField.style.visibility = "visible";
      ui.selectBtn.disabled = false;
      ui.drawBtn.disabled = false;

      clearInterval(loading);
      ui.gameTitle.textContent = "Conway's Game of Life";

      moveFrame(0);

      $("body").data("selection").patternName = 'None';
      $("body").data("selection").patternData = 'None';
      
      sim.fetching = false;
      console.log("fetchSimulation() complete!");
    })
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
  ui.gameTitle.textContent = "Loading";
  ui.generation.textContent = `Gen: 0`;
  ui.population.textContent = `Pop: 0`;
  const loading = setInterval(() => {
    ui.gameTitle.textContent += ".";
    if (ui.gameTitle.textContent.length > 10) {
      ui.gameTitle.textContent = "Loading";
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

  /* ###FIXME### Need to handle TypeError: Failed to fetch */
  fetch('/simdata', {method: "POST", body: form})
    .then((response) => response.json())
    .then((patternData) => {
      sim.patternData = patternData;
      sim.patternName = pattern;
      ui.patternName.textContent =`${pattern}`

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
      ui.gameTitle.textContent = "Conway's Game of Life";

      moveFrame(0);

      sim.fetching = false;
      console.log("fetchSimulation() complete!");
    })
}