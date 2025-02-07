//## Developer verify in the console that JavaScript is executing.
console.log("JavaScript is running.")


//## Main Objects to pass around the program.
const SIMULATION = {
  // This object will hold the data for our simulation.
  height: 36, // TODO: Make this dependant on users window
  width: 82, // TODO: Make this dependant on users window
  fps: 100, // Milliseconds; i.e.: 10fps
  renderData: NaN,
  paused: false,
  pausedIndex: 0,
  pattern: "Random",

  reset: function() {
    // what exactly needs to be reset everytime? ## TODO ##
    console.log(`Simulation.reset method called.`);
    this.height = 36; 
    this.width = 82;
    this.fps = 100;
    this.renderData = NaN;
    this.paused = false;
    this.pausedIndex = 0;
    this.pattern = "Random";
  }
}

const USERINTERFACE = {
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
  display: document.getElementById("simulationField"),
  // Simulation Info
  patternName: document.getElementById("simulationType"),
  population: document.getElementById("population"),
  generation: document.getElementById("generation"),
  // Header Info
  pageHeader: document.getElementById("header"),
  

  initialize: function() {
    // Initialize button to disabled.
    this.start.disabled = true,
    this.stop.disabled = true,
    this.newBtn.disabled = true,
    this.select.disabled = true,
    this.draw.disabled = true, 
    // Select Type container
    this.typeContainer.style.visibility = "hidden";
    // Header info
    this.pageHeader.innerText = "Conway's Game of Life";
  }
}
// Immediately call the method after the object is defined.
USERINTERFACE.initialize();


//## Initalize
fetchSimulation(sim); // Here, we could probably condense the fetchSimulation function into just fetchPattern
generateDisplay(sim);




//## Functions

//# Generate the display based off the simulation's dimensions.
function generateDisplay (simulation) {
  /**
 * This create's the cell div elements that will be animated for
 * the Game of Life simulation. It gives them the class name of 'cell'
 * and a unique id that corresponds to their "i-j" coordinates.
 */
  console.log("'generateDisplay' function called.");
  console.group('Generating Cells');
  for (let i = 0; i < simulation.height; i++) {
    for (let j = 0; j < simulation.width; j++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.setAttribute('id', (String(i) + "-" + String(j)));
      ui.display.appendChild(cell);
      console.log(`cell generated with id ${i}-${j}`);
    }
  }
  console.groupEnd();
}


//# Clear the simulation
function clearSimulation (userInterface) {
  /**
   * Selects all cells of the "cellAlive" class and removes them
   * from that class. Thus the cells revert back to their default
   * class and use the default element's color property.
   * 
   * May way to rework this to just swap in an empty display -t
   */
  console.log("'clearSimulation' function called.");

  const childNodes = userInterface.display.querySelectorAll('.cellAlive');
  childNodes.forEach((child) => {
    child.classList.remove('cellAlive');
  });
}


//# Render the simulation. ### TODO ### this function accepts simulation as
// an argument, but also calls global 'sim' variable. Work on only using the 
// the argument and reducing dependence on the sim variable.
const renderSimulation = (simulation, userInterface) => {
  /**
   * 
   */
  console.log("'renderSimulation' function called.")

  const renderData = simulation.renderData;

  const writeAliveCells = (aliveList) => {
    aliveList.forEach((cell) => {
      let [j, i] = cell;
      const cellId = `${j}-${i}`;
      const targetCell = document.getElementById(cellId);
      targetCell.classList.add('cellAlive'); 
    });
  };

  let index = simulation.pausedIndex; // Defaults to 0 in a new simulation.

  const intervalId = setInterval(() => {
    if (index < renderData.length) {
      if (!sim.paused) {

        clearSimulation(userInterface);

        writeAliveCells(renderData[index]['alive']);
        ui.generation.innerText = `Gen: ${renderData[index]['generation']}`;
        ui.population.innerText = `Pop: ${renderData[index]['population']}`;
        index++;
      } else {
        simulation.pausedIndex = index;
        clearInterval(intervalId);
        console.log("Simulation Paused.");
      }
    } else {
      clearInterval(intervalId);
      simulation.pausedIndex = 0;

      ui.start.disabled = false;
      ui.stop.disabled = true;
      ui.new.disabled = false;
      ui.select.disabled = false;
      ui.draw.disabled = false;

      console.log("Simulation Finished.")
    }
  }, sim.fps);
}


// ## Button wrapper functions.
function startAction () {
  console.log("'startAction' initiated.")

  ui.start.disabled = true;
  ui.stop.disabled = false;
  ui.new.disabled = true;
  ui.select.disabled = true;
  ui.draw.disabled = true;
  
  if (!sim.paused) {
  console.log("Initiating simulation. Begin rendering.")
  renderSimulation(sim, ui);

  } else {
    console.log("Simulation is paused. Resume rendering.")
    sim.paused = false;
    renderSimulation(sim, ui);
  }
}


function stopAction () {
  console.log("'stopAction' initiated.");

  sim.paused = true;

  ui.start.disabled = false;
  ui.stop.disabled = true;
  ui.new.disabled = false;
  ui.select.disabled = false;
  ui.draw.disabled = false;

  console.log("'stopAction' complete.");
}


function newAction () {
  console.log("'newAction' initiated.");

  ui.start.disabled = true;
  ui.new.disabled = true;
  ui.select.disabled = true;
  ui.draw.disabled = true;
  
  ui.generation.innerHTML = "Gen";
  ui.population.innerHTML = "Pop";
  clearSimulation(ui);
  sim.reset();
  fetchSimulation();
  console.log("'newAction' complete.");
}


function selectAction () {
  if (ui.selectToggle == 0) {
    ui.selectToggle = 1;
    ui.start.disabled = true;
    ui.new.disabled = true;
    ui.draw.disabled = true;
    ui.typeContainer.style.visibility = "visible";
    console.log("'selectAction' initiated. Showing the select menu");
  }
  else if (ui.selectToggle == 1) {
    ui.selectToggle = 0;
    ui.start.disabled = false;
    ui.new.disabled = false;
    ui.draw.disabled = false;
    ui.typeContainer.style.visibility = "hidden";
    console.log("'selectAction' initiated. Hiding the select menu");
  };
}


function drawAction () {
  console.log("'drawAction' initiated. (This does nothing yet)");
}


function fetchPattern(pattern) {
  // We probably only need a single fetch function.
  // only check if we have the pattern requested being "random" 
  sim.reset();


  ui.selectToggle = 0;
  ui.select.disabled = true;
  ui.typeContainer.style.visibility = "hidden";

  console.log(`Fetching ${pattern}`);
  const form = new FormData();
  form.append("Pattern", pattern);
  
  fetch('/simdata', {method: "POST", body: form})
    .then((response) => response.json())
    .then((renderData) => {
      sim.renderData = renderData;
      ui.start.disabled = false;
      ui.new.disabled = false;
      ui.select.disabled = false;
      ui.selectToggle = 0;
      ui.draw.disabled = false;
      console.log("'fetchPattern' complete!");
    })
}


//# Fetch the simulation from the server.
function fetchSimulation () {
  console.log("'fetchSimulation' function called.")

  fetch('/simdata')
    .then((response) => response.json())
    .then((renderData) => {
      sim.renderData = renderData;
      ui.start.disabled = false;
      ui.new.disabled = false;
      ui.select.disabled = false;
      ui.draw.disabled = false;
      console.log("'fetchSimulation' complete!");
    })
}


//## Attach wrapper functions to buttons.
$("#startButton").click(() => startAction()); 
$("#stopButton").click(() => stopAction());
$("#newButton").click(() => newAction());
$("#selectButton").click(() => selectAction());
$("#drawButton").click(() => drawAction());

$("#type-1").click(() => fetchPattern(sim.requestedPattern = "Random"));
$("#type-2").click(() => fetchPattern(sim.requestedPattern = "Blinker"));
$("#type-3").click(() => fetchPattern(sim.requestedPattern = "Glider"));
$("#type-4").click(() => fetchPattern(sim.requestedPattern = "Glider Gun"));