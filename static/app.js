$(document).ready(function() {
  //## Developer verify in the console that JavaScript is executing.
  console.log("JavaScript is running")


  //## Custom classes for the web page
  class Simulation {
    // This singleton object will hold the data for our simulation.
    constructor() {
      this.gridRows = 36;
      this.gridColumns = 82;
      this.name = NaN;
      this.genArray = NaN;
      this.running = false;
      this.paused = false;
      this.pausedIndex = 0;
    }

    reset () {
      console.log(`${this}.method 'reset' called.`);
      this.gridRows = 36; 
      this.gridColumns = 82;
      this.name = NaN;
      this.genArray = NaN;
      this.running = false;
      this.paused = false;
      this.pausedIndex = 0;
    }
  }

  class UserInterface {
    // This singleton object will hold the data for the user interface.
    constructor () {
      // Control buttons
      this.start = document.getElementById("startButton");
      this.stop = document.getElementById("stopButton");
      this.new = document.getElementById("newButton");
      this.select = document.getElementById("selectButton");
      this.draw = document.getElementById("drawButton");

      // Simulation display
      this.display = document.getElementById("simulationField");

      // Simulation info
      this.title = document.getElementById("simulationType");
      this.population = document.getElementById("population");
      this.generation = document.getElementById("generation");
    }
  }


  //## Initalize variables
  const SimObject = new Simulation();
  const ui = new UserInterface();
  ui.stop.disabled = true;

  fetchSimulation();

  const simulationField = document.getElementById("simulationField");
  const generation = document.getElementById("population"); // Gen
  const population = document.getElementById("generation"); // Pop

  const pageHeader = document.getElementById("header");
  pageHeader.innerText = "Conway's Game of Life";

  //## Build the simulationField
  const numRows = SimObject.gridRows; //TODO These numbers have to correspond to the styles.css repeat() declaration.
  const numCols = SimObject.gridColumns; //TODO These numbers have to correspond to the styles.css repeat() declaration.
  // for now, use 36x82 (or 82x36) as the test GenArray size. 
  for (let i = 0; i < numRows; i++) {
    for (let j = 0; j < numCols; j++) {
      const gridCell = document.createElement('div');
      gridCell.classList.add('gridCell');
      gridCell.setAttribute('id', (String(i) + "-" + String(j)));
      simulationField.appendChild(gridCell);
    }
  }

  //## Create functions
  //# Clear the simulation
  function clearSimulation () {
    console.log("'clearSimulation' function called.")
    for (let j = 0; j < SimObject.gridRows; j++) {
      for (let i = 0; i < SimObject.gridColumns; i++) {
        const cellId = j + "-" + i;
        const targetCell = document.getElementById(cellId);
        targetCell.style.backgroundColor = "#23333e"; //TODO -> get the css style variables later
      }
    } 
  }

  //# Render the simulation.
  function renderSimulation (simObject) {
    console.log("'renderSimulation' function called.")
    const simulationData = simObject.genArray;
    simObject.running = true;

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

    let index = SimObject.pausedIndex;

    const intervalId = setInterval(() => {
      if (index < simulationData.length) {
        if (!simObject.paused) {
          renderFrame(simulationData[index][0]);
          generation.innerText = `Gen: ${simulationData[index][1]}`;
          population.innerText = `Pop: ${simulationData[index][2]}`;
          index++;
        } else {
          simObject.pausedIndex = index;
          clearInterval(intervalId);
          console.log("Simulation Paused.");
        }
      } else {
        clearInterval(intervalId);
        simObject.index = 0;
        simObject.running = false;

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
      .then((simulationData) => SimObject.genArray = simulationData)
      .then(() => {
        ui.start.disabled = false;
      })
      .then(() => console.log("'fetchSimulation complete!"));
  }

  // ## Button wrapper functions.
  function startAction () {
    console.log("'startAction' initiated.")

    ui.start.disabled = true;
    ui.stop.disabled = false;
    ui.new.disabled = true;
    
    if (!SimObject.running) {
      console.log("SimObject is not running. Begin rendering.")
      renderSimulation(SimObject);
    } else if (SimObject.paused) {
      console.log("SimObject is paused. Resume rendering.")
      SimObject.paused = false;
      renderSimulation(SimObject);
    }
  }

  function stopAction () {
    console.log("'stopAction' initiated.")

    ui.start.disabled = false;
    ui.stop.disabled = true;
    ui.new.disabled = false;

    if (SimObject.running) {
      SimObject.paused = true;
      console.log("'stopAction' complete.")
    }
  }

  function newAction () {
    console.log("'newAction' initiated.")
    clearSimulation();
    generation.innerHTML = "Gen";
    population.innerHTML = "Pop";
    SimObject.reset();
    fetchSimulation();
    console.log("'newAction' complete.")
  }

  //## Attach wrapper functions to buttons.
  $("#startButton").click(() => startAction()); 
  $("#stopButton").click(() => stopAction());
  $("#newButton").click(() => newAction());

});