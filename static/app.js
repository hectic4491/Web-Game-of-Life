$(document).ready(function() {
  //## Developer verify in the console that JavaScript is executing.
  console.log("JavaScript is running.")


  //## Custom classes for the web page
  class Simulation {
    // This singleton object will hold the data for our simulation.
    constructor() {
      this.rows = 36;
      this.columns = 82;
      this.patternName = "Random";
      this.genArray = NaN;
      this.initiated = false;
      this.paused = false;
      this.pausedIndex = 0;
    }

    reset () {
      console.log(`Simulation.reset method called.`);
      this.rows = 36; 
      this.columns = 82;
      this.patternName = "Random";
      this.genArray = NaN;
      this.initiated = false;
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

  fetchSimulation();
  generateDisplay(sim);


  //## Functions
  //# Generate the display based off the simulation's dimensions.
  function generateDisplay (sim) {
    console.log("'generateDisplay' function called.")

    for (let i = 0; i < sim.rows; i++) {
      for (let j = 0; j < sim.columns; j++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.setAttribute('id', (String(i) + "-" + String(j)));
        ui.display.appendChild(cell);
      }
    }
  }

  //# Clear the simulation
  function clearSimulation () {
    console.log("'clearSimulation' function called.")

    for (let j = 0; j < sim.rows; j++) {
      for (let i = 0; i < sim.columns; i++) {
        const cellId = j + "-" + i;
        const targetCell = document.getElementById(cellId);
        targetCell.style.backgroundColor = "#23333e"; //TODO -> get the css style variables later
      }
    } 
  }

  //# Render the simulation.
  function renderSimulation (sim) {
    console.log("'renderSimulation' function called.")

    const simulationData = sim.genArray;
    sim.initiated = true;

    const renderFrame = (frame) => {
      let j = 0;
      frame.forEach((row) => {
        let i = 0;
        for (const cell of row) {
          if (cell) {
            const cellId = j + "-" + i;
            const targetCell = document.getElementById(cellId);
            targetCell.style.backgroundColor = "#B6C649"; //TODO -> get the css style variables later
          } else if (!cell) {
            const cellId = j + "-" + i;
            const targetCell = document.getElementById(cellId);
            targetCell.style.backgroundColor = "#23333e"; //TODO -> get the css style variables later
          }
          i++;
        }
        j++;
      });
    }

    let index = sim.pausedIndex;

    const intervalId = setInterval(() => {
      if (index < simulationData.length) {
        if (!sim.paused) {
          renderFrame(simulationData[index][0]);
          ui.generation.innerText = `Gen: ${simulationData[index][1]}`;
          ui.population.innerText = `Pop: ${simulationData[index][2]}`;
          index++;
        } else {
          sim.pausedIndex = index;
          clearInterval(intervalId);
          console.log("Simulation Paused.");
        }
      } else {
        clearInterval(intervalId);
        sim.index = 0;
        sim.initiated = false;

        ui.start.disabled = false;
        ui.stop.disabled = true;
        ui.new.disabled = false;

        console.log("Simulation Finished.")
      }
    }, 100);
  }

  //# Fetch the simulation from the server.
  function fetchSimulation () {
    console.log("'fetchSimulation' function called.")

    ui.start.disabled = true;

    fetch(simDataEndpoint)
      .then((response) => response.json())
      .then((simulationData) => sim.genArray = simulationData)
      .then(() => {
        ui.start.disabled = false;
      })
      .then(() => console.log("'fetchSimulation' complete!"));
  }

  // ## Button wrapper functions.
  function startAction () {
    console.log("'startAction' initiated.")

    ui.start.disabled = true;
    ui.stop.disabled = false;
    ui.new.disabled = true;
    
    if (!sim.initiated) {
      console.log("Initiating simulation. Begin rendering.")
      renderSimulation(sim);
    } else if (sim.paused) {
      console.log("Simulation is paused. Resume rendering.")
      sim.paused = false;
      renderSimulation(sim);
    }
  }

  function stopAction () {
    console.log("'stopAction' initiated.")

    ui.start.disabled = false;
    ui.stop.disabled = true;
    ui.new.disabled = false;

    if (sim.initiated) {
      sim.paused = true;
      console.log("'stopAction' complete.")
    }
  }

  function newAction () {
    console.log("'newAction' initiated.")
    clearSimulation();
    ui.generation.innerHTML = "Gen";
    ui.population.innerHTML = "Pop";
    sim.reset();
    fetchSimulation();
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