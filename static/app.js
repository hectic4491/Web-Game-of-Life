$(document).ready(function() {
  //## Developer verify in the console that JavaScript is executing.
  console.log("JavaScript is running.")


  //## Custom classes for the web page
  class Simulation {
    // This singleton object will hold the data for our simulation.
    constructor() {
      this.height = 36; // TODO: Make this dependant on users window
      this.width = 82; // TODO: Make this dependant on users window
      this.fps = 100; // Milliseconds; i.e.: 10fps
      this.patternName = "Random";
      this.renderData = NaN;
      this.paused = false;
      this.pausedIndex = 0;
    }

    reset () {
      console.log(`Simulation.reset method called.`);
      this.height = 36; 
      this.width = 82;
      this.fps = 100;
      this.patternName = "Random";
      this.renderData = NaN;
      this.paused = false;
      this.pausedIndex = 0;
    }
  }

  class UserInterface {
    // This singleton object will hold the data for the user interface.
    constructor () {
      // Control buttons
      this.start = document.getElementById("startButton");
      this.start.disabled = true;
      this.stop = document.getElementById("stopButton");
      this.stop.disabled = true;
      this.new = document.getElementById("newButton");
      this.select = document.getElementById("selectButton");
      this.draw = document.getElementById("drawButton");

      // Simulation display
      this.display = document.getElementById("simulationField");

      // Simulation info
      this.patternName = document.getElementById("simulationType");
      this.population = document.getElementById("population");
      this.generation = document.getElementById("generation");
      
      // Header info
      this.pageHeader = document.getElementById("header");
      this.pageHeader.innerText = "Conway's Game of Life";
    }
  }


  //## Initalize
  const sim = new Simulation();
  const ui = new UserInterface();

  fetchSimulation(sim);
  generateDisplay(sim);


  //## Functions
  //# Generate the display based off the simulation's dimensions.
  function generateDisplay (simulation) {
    // TODO -> This function should be linked to the css #simulationField attributes
    console.log("'generateDisplay' function called.")

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
    // May way to rework this to just swap in an empty display
    console.log("'clearSimulation' function called.");

    const childNodes = userInterface.display.querySelectorAll('.cellAlive');
    childNodes.forEach(child => {
      child.classList.remove('cellAlive');
    });
  }

  //# Render the simulation.
  const renderSimulation = (simulation, userInterface) => {
    console.log("'renderSimulation' function called.")

    const renderData = simulation.renderData;


    /* I can instead have two classes of cells. one alive and one dead. i tell the alive cells
    to join the "alive" class, and then at the end revert everyones class back to dead, as in "flushing"
    the display back to a clean grid
    */


    const writeAliveCells = (aliveList) => {
      aliveList.forEach((cell) => {
        let [j, i] = cell;
        const cellId = `${j}-${i}`;
        const targetCell = document.getElementById(cellId);
        targetCell.classList.add('cellAlive'); //TODO -> get the css style variables later
      });
    };

    let index = simulation.pausedIndex; // Defaults to 0 in a new simulation.

    console.log(renderData[index]['alive'])

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

        console.log("Simulation Finished.")
      }
    }, sim.fps);
  }

  //# Fetch the simulation from the server.
  function fetchSimulation (simulation) {
    console.log("'fetchSimulation' function called.")

    fetch('/simdata')
      .then((response) => response.json())
      .then((renderData) => {
        simulation.renderData = renderData;
        ui.start.disabled = false;
        console.log("'fetchSimulation' complete!");
      })
  }


  // ## Button wrapper functions.
  function startAction () {
    console.log("'startAction' initiated.")

    ui.start.disabled = true;
    ui.stop.disabled = false;
    ui.new.disabled = true;
    
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
    console.log("'stopAction' initiated.")

    sim.paused = true;

    ui.start.disabled = false;
    ui.stop.disabled = true;
    ui.new.disabled = false;

    console.log("'stopAction' complete.")
  }

  function newAction () {
    console.log("'newAction' initiated.")

    ui.start.disabled = true;
    ui.generation.innerHTML = "Gen";
    ui.population.innerHTML = "Pop";
    clearSimulation(ui);
    sim.reset();
    fetchSimulation(sim);
    console.log("'newAction' complete.")
  }

  function selectAction () {
    console.log("'selectAction' initiated. (This does nothing yet)")
  }

  function drawAction () {
    console.log("'drawAction' initiated. (This does nothing yet)")
  }

  //## Attach wrapper functions to buttons.
  $("#startButton").click(() => startAction()); 
  $("#stopButton").click(() => stopAction());
  $("#newButton").click(() => newAction());
  $("#selectButton").click(() => selectAction());
  $("#drawButton").click(() => drawAction());

});