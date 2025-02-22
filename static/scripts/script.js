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
  paused: true,
  currentIndex: 0,
  pattern: "Random",
  drawing: false,
  drawnPattern: undefined,
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
  // Header
  pageHeader: document.getElementById("mainHeader"),
  // Button Container 
  buttonContainer: document.getElementById("buttonContainer"),
  // Buttons
  startBtn: document.getElementById("startButton"),
  stopBtn: document.getElementById("stopButton"),
  newBtn: document.getElementById("newButton"),
  selectBtn: document.getElementById("selectButton"),
  drawBtn: document.getElementById("drawButton"),
  // Button Toggles
  selectToggle: 0,
  drawToggle: 0,
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
  settingsMenu: document.getElementById("settingsMenu"), // Settings Menu
  

  initialize: function() {
    // Initialize button to disabled.
    this.startBtn.disabled = true,
    this.stopBtn.disabled = true,
    this.newBtn.disabled = true,
    this.selectBtn.disabled = true,
    this.drawBtn.disabled = true, 
    // Select Type container
    this.typeContainer.style.display = "none";
  }
}


// ###
// Main
ui.initialize();
fetchSimulation();
generateGrid();


// ##
// Document event listeners
// ' ' (Space bar) to start and stop the simulation.
document.addEventListener('keydown', function(event) {
  if (event.key == " " && !sim.drawing) {
    if (sim.paused) {
      startAction();
    } else {
      stopAction();
    }
  } 
});

// '.' (>) to move to the next frame.
document.addEventListener('keydown', function(event) {
  if (event.key == "." && sim.paused) {
    moveFrame(sim.currentIndex + 1);
  }
});

// ',' (<) to move to the previous frame.
document.addEventListener('keydown', function(event) {
  if (event.key == "," && sim.paused) {
    moveFrame(sim.currentIndex - 1);
  }
});

// 'r' to reset the simulation.
document.addEventListener('keydown', function(event) {
  if (event.key == "r" && sim.paused) {
    moveFrame(0);
  }
});

// 'n' to fetch a new simulation.
document.addEventListener('keydown', function(event) {
  if (event.key == "n" && sim.paused && !sim.drawing) {
    newAction();
  }
});

// 'd' to toggle the draw mode.
document.addEventListener('keydown', function(event) {
  if (event.key == "d" && sim.paused) {
    drawAction();
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
      ui.drawToggle = 0;
      drawMode(false);
      // toggles
      ui.startBtn.disabled = false;
      ui.newBtn.disabled = false;
      ui.selectBtn.disabled = false;
      console.log("generateBtn() initiated. Hiding the draw menu");
    });

    // Insert the buttons after the Draw button
    ui.buttonContainer.insertBefore(clearBtn, ui.drawBtn.nextSibling);
    ui.buttonContainer.insertBefore(generateBtn, clearBtn.nextSibling);
    
    // Prevent space bar from triggering the draw action
    document.addEventListener('keydown', preventDefaultSpaceBar, false);

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

    // Remove the space bar prevention when not in drawing mode
    document.removeEventListener('keydown', preventDefaultSpaceBar, false);
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
      if (!sim.paused) {
        moveFrame(sim.currentIndex);
        sim.currentIndex++;

      } else {
        // If we ever hit the stop button and pause the simulation.
        // (more details in the stop button)
        clearInterval(animation);
        console.log("Simulation Paused.");
      }
    } else {
      // If we reach the end of the animation:
      // (i.e.: index becomes equal or greater than patternData.length )
      clearInterval(animation);
      sim.paused = true;

      // toggles
      ui.startBtn.disabled = false;
      ui.stopBtn.disabled = true;
      ui.newBtn.disabled = false;
      ui.selectBtn.disabled = false;
      ui.drawBtn.disabled = false;

      console.log("Simulation Finished.")
    }
  }, sim.fps);
}


// ###
// Button wrapper functions.
function startAction () {
  console.log("startAction() initiated.")

  //toggles
  ui.startBtn.disabled = true;
  ui.stopBtn.disabled = false;
  ui.newBtn.disabled = true;
  ui.selectBtn.disabled = true;
  ui.drawBtn.disabled = true;
  
  sim.paused = false;
  renderSimulation();
  console.log("startAction() complete.")
}


function stopAction () {
  console.log("stopAction() initiated.");

  // toggles
  ui.startBtn.disabled = false;
  ui.stopBtn.disabled = true;
  ui.newBtn.disabled = false;
  ui.selectBtn.disabled = false;
  ui.drawBtn.disabled = false;

  sim.paused = true;

  console.log("stopAction() complete.");
}


function newAction () {
  console.log("newAction() initiated.");

  // toggles
  ui.startBtn.disabled = true;
  ui.newBtn.disabled = true;
  ui.selectBtn.disabled = true;
  ui.drawBtn.disabled = true;
  
  ui.generation.innerHTML = "Gen: 0";
  ui.population.innerHTML = "Pop: 0";

  fetchSimulation(sim.pattern);
  
  console.log("newAction() complete.");
}


function selectAction () {
  if (ui.selectToggle == 0) {

    // toggles
    ui.selectToggle = 1;
    ui.startBtn.disabled = true;
    ui.newBtn.disabled = true;
    ui.drawBtn.disabled = true;

    ui.typeContainer.style.display = "flex";
    console.log("selectAction() initiated. Showing the select menu");
  } else if (ui.selectToggle == 1) {

    // toggles
    ui.selectToggle = 0;
    ui.startBtn.disabled = false;
    ui.newBtn.disabled = false;
    ui.drawBtn.disabled = false;

    ui.typeContainer.style.display = "none";
    console.log("selectAction() initiated. Hiding the select menu");
  };
}


function drawAction () {

  if (ui.drawToggle == 0) {
    ui.drawToggle = 1;
    drawMode(true);

    // toggles
    ui.startBtn.disabled = true;
    ui.newBtn.disabled = true;
    ui.selectBtn.disabled = true;
    console.log("drawAction() initiated. Showing the draw menu");

  } else if (ui.drawToggle == 1) {
    ui.drawToggle = 0;
    drawMode(false);

    // toggles
    ui.startBtn.disabled = false;
    ui.newBtn.disabled = false;
    ui.selectBtn.disabled = false;
    console.log("drawAction() initiated. Hiding the draw menu");
  }
}


function preventDefaultSpaceBar(event) {
  if (event.code === "Space") {
    event.preventDefault();
  }
}


function fetchSimulation(pattern="Random") {
  console.log("fetchSimulation() called.")

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

  ui.selectToggle = 0;
  ui.selectBtn.disabled = true;

  ui.typeContainer.style.display = "none";

  fetch('/simdata', {method: "POST", body: form})
    .then((response) => response.json())
    .then((patternData) => {
      sim.patternData = patternData;
      sim.pattern = pattern;

      // toggles
      ui.startBtn.disabled = false;
      ui.newBtn.disabled = false;
      ui.selectBtn.disabled = false;
      ui.drawBtn.disabled = false;

      clearInterval(loading);
      ui.pageHeader.innerText = "Conway's Game of Life";

      moveFrame(0);

      console.log("fetchSimulation() complete!");
    })
}


// ###
// Attach wrapper functions to buttons.
$("#startButton").click(() => startAction()); 
$("#stopButton").click(() => stopAction());
$("#newButton").click(() => newAction());
$("#selectButton").click(() => selectAction());
$("#drawButton").click(() => drawAction());


$("#type1").click(() => fetchSimulation("Random"));
$("#type2").click(() => fetchSimulation("Blinker"));
$("#type3").click(() => fetchSimulation("Glider"));
$("#type4").click(() => fetchSimulation("Glider Gun"));
