//## Developer verify in the console that JavaScript is executing.
console.log("JavaScript is running.")


//## Main Objects to pass around the program.
const sim = {
  // This object will hold the data for our simulation.
  height: 36, // TODO: Make this dependant on users window
  width: 82, // TODO: Make this dependant on users window
  fps: 100, // Milliseconds; i.e.: 10fps
  renderData: NaN, // Where we store the fetched data from the server.
  paused: true,
  pausedIndex: 0,
  pattern: "Random",

  resetAnimation: function() {
    console.log(`.resetAnimation method called.`);
    this.renderData = NaN; // We want to reset this.
    this.pausedIndex = 0; // We want to rest this.
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
  display: document.getElementById("simulationField"),
  // Simulation Info
  patternName: document.getElementById("simulationType"),
  population: document.getElementById("population"),
  generation: document.getElementById("generation"),
  // Header Info
  pageHeader: document.getElementById("header"),
  

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

//## Initalize
ui.initialize();
fetchSimulation();
generateDisplay(sim);


//## Functions

//# Generate the display based off the simulation's dimensions.
function generateDisplay (simulation) {
/**This create's the cell div elements that will be animated for
 * the Game of Life simulation. It gives them the class name of 'cell'
 * and a unique id that corresponds to their "i-j" coordinates.
 */
  console.log("'generateDisplay' function called.");
  for (let i = 0; i < simulation.height; i++) {
    for (let j = 0; j < simulation.width; j++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.setAttribute('id', (String(i) + "-" + String(j)));
      ui.display.appendChild(cell);
    }
  }
}


//# Clear the simulation
function clearSimulation (userInterface) {
  /**Selects all cells of the "cellAlive" class and removes them
   * from that class. Thus the cells revert back to their default
   * class and use the default element's color property.
   * 
   * May want to rework this to just swap in an empty display -t
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

function renderSimulation(simulation, userInterface) {
  /**We create an inner function  named writeAlive Cellsthat processes
   * an array of cell id's and adds their class to alive, so that it can
   * be displayed with the new classes color properties. This handles
   * one frame of data at a time.
   */
  console.log("'renderSimulation' function called.")

  const renderData = simulation.renderData;

  function writeAliveCells(aliveList) {
    aliveList.forEach((cell) => {
      let [j, i] = cell;
      const cellId = `${j}-${i}`;
      const targetCell = document.getElementById(cellId);
      targetCell.classList.add('cellAlive'); 
    });
  }


  let index = simulation.pausedIndex;
  // Defaults to 0 in a new simulation.


  const animation = setInterval(() => {
  /**We call the SetInterval function to enter the animation loop. We
   * pass the setInterval ID to the variable 'animation' so that we can
   * exit the interval later with clearInterval.  
   */
    if (index < renderData.length) { 
      // continue if we haven't reached the end of the data array.
      if (!sim.paused) {
        clearSimulation(userInterface);
        // query all alive cells and remove the cellAlive class from them.
        writeAliveCells(renderData[index]['alive']);
        // read the 'alive' value of the current 'index' (frame) of the
        // renderData.

        // update these two elements.
        ui.generation.innerText = `Gen: ${renderData[index]['generation'] + 1}`;
        ui.population.innerText = `Pop: ${renderData[index]['population']}`;

        index++;

      } else {
        // If we ever hit the stop button and pause the simulation.
        // (more details in the stop button)
        simulation.pausedIndex = index;
        clearInterval(animation);
        console.log("Simulation Paused.");
      }
    } else {
      // If we reach the end of the animation:
      // (i.e.: index becomes equal or greater than renderData.length )
      clearInterval(animation);
      simulation.pausedIndex = 0;

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


// ## Button wrapper functions.
function startAction () {
  console.log("'startAction' initiated.")

  //toggles
  ui.startBtn.disabled = true;
  ui.stopBtn.disabled = false;
  ui.newBtn.disabled = true;
  ui.selectBtn.disabled = true;
  ui.drawBtn.disabled = true;
  
  sim.paused = false;
  renderSimulation(sim, ui);
  console.log("'startAction' complete.")

}


function stopAction () {
  console.log("'stopAction' initiated.");

  // toggles
  ui.startBtn.disabled = false;
  ui.stopBtn.disabled = true;
  ui.newBtn.disabled = false;
  ui.selectBtn.disabled = false;
  ui.drawBtn.disabled = false;

  sim.paused = true;

  console.log("'stopAction' complete.");
}


function newAction () {
  console.log("'newAction' initiated.");

  // toggles
  ui.startBtn.disabled = true;
  ui.newBtn.disabled = true;
  ui.selectBtn.disabled = true;
  ui.drawBtn.disabled = true;
  
  ui.generation.innerHTML = "Gen: 0";
  ui.population.innerHTML = "Pop: 0";

  fetchSimulation(sim.pattern);
  
  console.log("'newAction' complete.");
}


function selectAction () {
  if (ui.selectToggle == 0) {

    // toggles
    ui.selectToggle = 1;
    ui.startBtn.disabled = true;
    ui.newBtn.disabled = true;
    ui.drawBtn.disabled = true;

    ui.typeContainer.style.visibility = "visible";
    console.log("'selectAction' initiated. Showing the select menu");
  } else if (ui.selectToggle == 1) {

    // toggles
    ui.selectToggle = 0;
    ui.startBtn.disabled = false;
    ui.newBtn.disabled = false;
    ui.drawBtn.disabled = false;

    ui.typeContainer.style.visibility = "hidden";
    console.log("'selectAction' initiated. Hiding the select menu");
  };
}


function drawAction () {
  console.log("'drawAction' initiated. (This does nothing yet)");
}


function fetchSimulation(pattern="Random") {
  
  console.log("'fetchSimulation' called.")

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

      console.log("'fetchSimulation' complete!");
    })
}


//## Attach wrapper functions to buttons.
$("#startButton").click(() => startAction()); 
$("#stopButton").click(() => stopAction());
$("#newButton").click(() => newAction());
$("#selectButton").click(() => selectAction());
$("#drawButton").click(() => drawAction());


$("#type-1").click(() => fetchSimulation("Random"));
$("#type-2").click(() => fetchSimulation("Blinker"));
$("#type-3").click(() => fetchSimulation("Glider"));
$("#type-4").click(() => fetchSimulation("Glider Gun"));