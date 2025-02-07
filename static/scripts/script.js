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
      this.renderData = NaN;
      this.paused = false;
      this.pausedIndex = 0;
      this.pattern = "Random";
    }

    reset () {
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

  class UserInterface {
    // This singleton object will hold the data for the user interface.
    constructor () {
      // Control buttons
      this.start = document.getElementById("startButton");
      this.start.disabled = true;
      this.stop = document.getElementById("stopButton");
      this.stop.disabled = true;
      this.new = document.getElementById("newButton");
      this.new.disabled = true;
      this.select = document.getElementById("selectButton");
      this.select.disabled = true;
      this.draw = document.getElementById("drawButton");
      this.draw.disabled = true;

      // Select Type container
      this.typeContainer = document.getElementById("type-container");
      this.typeContainer.style.visibility = "hidden";
      this.selectToggle = 0;

      // Select Type buttons
      // ##TODO## the buttons should be constructed automatically by the amount of elements we have in the toml file.

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

  fetchSimulation(sim); // Here, we could probably condense the fetchSimulation function into just fetchPattern
  generateDisplay(sim);


  //## Functions
  //# Generate the display based off the simulation's dimensions.
  function generateDisplay (simulation) {
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
    // May way to rework this to just swap in an empty display -t
    console.log("'clearSimulation' function called.");

    const childNodes = userInterface.display.querySelectorAll('.cellAlive');
    childNodes.forEach(child => {
      child.classList.remove('cellAlive');
    });
  }

  //# Render the simulation. ### TODO ### this function accepts simulation as
  // an argument, but also calls global 'sim' variable. Work on only using the 
  // the argument and reducing dependence on the sim variable.
  const renderSimulation = (simulation, userInterface) => {
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
});