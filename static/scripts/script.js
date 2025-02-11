//## Main Objects to pass around the program.

//TODO: Make the drawing functionality work.
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
  renderData: NaN, // Where we store the fetched data from the server.
  paused: true,
  currentIndex: 0,
  pattern: "Random",

  resetAnimation: function() {
    console.log(`sim.resetAnimation() called.`);
    this.renderData = NaN; // We want to reset this.
    this.currentIndex = 0; // We want to rest this.
  }
}

const ui = {
  // This object will hold the data for the user interface.
  // Control buttons
  startBtn: document.getElementById("startButton"),
  stopBtn: document.getElementById("stopButton"),
  newBtn: document.getElementById("newButton"),
  selectBtn: document.getElementById("selectButton"),
  drawBtn: document.getElementById("drawButton"),
  // Select Button type-container
  typeContainer: document.getElementById("type-container"),
  selectToggle: 0,
  // Simulation display
  grid: document.getElementById("grid"),
  // Simulation Info
  patternName: document.getElementById("simulationType"),
  population: document.getElementById("population"),
  generation: document.getElementById("generation"),
  // Header Info
  pageHeader: document.getElementById("main-header"),
  

  initialize: function() {
    // Initialize button to disabled.
    this.startBtn.disabled = true,
    this.stopBtn.disabled = true,
    this.newBtn.disabled = true,
    this.selectBtn.disabled = true,
    this.drawBtn.disabled = true, 
    // Select Type container
    this.typeContainer.style.visibility = "hidden";
    // Header info
    this.pageHeader.innerText = "Conway's Game of Life";
  }
}


// ###
// Main
ui.initialize();
fetchSimulation();
generateGrid(sim);


// ##
// Document event listeners
// ' ' (Space bar) to start and stop the simulation.
document.addEventListener('keydown', function(event) {
  if (event.key == " ") {
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
  if (event.key == "n" && sim.paused) {
    newAction();
  }
});

// ###
// Functions

//# Generate the grid based off the simulation's dimensions.
function generateGrid (simulation) {
/**This create's the cell div elements that will be animated for
 * the Game of Life simulation. It gives them the class name of 'cell'
 * and a unique id that corresponds to their "i-j" coordinates.
 */
  console.log("generateGrid() called.");
  for (let i = 0; i < simulation.height; i++) {
    for (let j = 0; j < simulation.width; j++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.setAttribute('id', (String(i) + "-" + String(j)));
      ui.grid.appendChild(cell);
    }
  }
}


//# Clear the simulation
function clearSimulation (userInterface) {
  /**Selects all cells of the "cellAlive" class and removes them
   * from that class. Thus the cells revert back to their default
   * class and use the default element's color property.
   * 
   * May want to rework this to just swap in an empty grid -t
   */
  console.log("clearSimulation() called.");

  const childNodes = userInterface.grid.querySelectorAll('.cellAlive');
  childNodes.forEach((child) => {
    child.classList.remove('cellAlive');
  });
}


function writeAliveCells(simulation) {
  aliveList = simulation.renderData[simulation.currentIndex]['alive'];

  aliveList.forEach((cell) => {
    let [j, i] = cell;
    const cellId = `${j}-${i}`;
    const targetCell = document.getElementById(cellId);
    targetCell.classList.add('cellAlive'); 
  });
}


function moveFrame(index) {
  if (index >= 0 && index < sim.renderData.length) {
    clearSimulation(ui);
    sim.currentIndex = index;
    writeAliveCells(sim);
    ui.generation.innerText = `Gen: ${sim.renderData[index]['generation'] + 1}`;
    ui.population.innerText = `Pop: ${sim.renderData[index]['population']}`;
  }
}


//# Render the simulation. ### TODO ### this function accepts simulation as
// an argument, but also calls global 'sim' variable. Work on only using the 
// the argument and reducing dependence on the sim variable.

function renderSimulation(simulation, userInterface) {
  /**We create an inner function  named writeAlive Cellsthat processes
   * an array of cell id's and adds their class to alive, so that it can
   * be displayed with the new classes color properties. This handles
   * one frame of data at a time.
   */
  console.log("renderSimulation() called.")

  const renderData = simulation.renderData;


  let renderIndex = simulation.currentIndex;
  // Defaults to 0 in a new simulation.

  const animation = setInterval(() => {
  /**We call the SetInterval function to enter the animation loop. We
   * pass the setInterval ID to the variable 'animation' so that we can
   * exit the interval later with clearInterval.  
   */
    if (renderIndex < renderData.length) { 
      // continue if we haven't reached the end of the data array.
      if (!sim.paused) {
        moveFrame(renderIndex);
        renderIndex++;

      } else {
        // If we ever hit the stop button and pause the simulation.
        // (more details in the stop button)
        clearInterval(animation);
        console.log("Simulation Paused.");
      }
    } else {
      // If we reach the end of the animation:
      // (i.e.: index becomes equal or greater than renderData.length )
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
  renderSimulation(sim, ui);
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

    ui.typeContainer.style.visibility = "visible";
    console.log("selectAction() initiated. Showing the select menu");
  } else if (ui.selectToggle == 1) {

    // toggles
    ui.selectToggle = 0;
    ui.startBtn.disabled = false;
    ui.newBtn.disabled = false;
    ui.drawBtn.disabled = false;

    ui.typeContainer.style.visibility = "hidden";
    console.log("selectAction() initiated. Hiding the select menu");
  };
}


function drawAction () {
  console.log("drawAction() initiated. (This does nothing yet)");
}


function fetchSimulation(pattern="Random") {
  console.log("fetchSimulation() called.")

  ui.pageHeader.innerText = "Loading";
  ui.generation.innerText = `Gen: 0`;
  ui.population.innerText = `Pop: 0`;

  const loading = setInterval(() => {
    ui.pageHeader.innerText += ".";
    if (ui.pageHeader.innerText.length > 10) {
      ui.pageHeader.innerText = "Loading";
    }
  }, 200);

  clearSimulation(ui);
  sim.resetAnimation();

  ui.selectToggle = 0;
  ui.selectBtn.disabled = true;

  ui.typeContainer.style.visibility = "hidden";

  const form = new FormData();
  form.append("Pattern", pattern);
  
  fetch('/simdata', {method: "POST", body: form})
    .then((response) => response.json())
    .then((renderData) => {
      sim.renderData = renderData;
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


$("#type-1").click(() => fetchSimulation("Random"));
$("#type-2").click(() => fetchSimulation("Blinker"));
$("#type-3").click(() => fetchSimulation("Glider"));
$("#type-4").click(() => fetchSimulation("Glider Gun"));