$(document).ready(function() {
  //## Check to see if this prints in console.
  console.log("JavaScript is running")


  //## Create the simulation object
  class SimulationClass {
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
        console.log("'reset' method called.");
        this.gridRows = 36;
        this.gridColumns = 82;
        this.name = NaN;
        this.genArray = NaN;
        this.running = false;
        this.paused = false;
        this.pausedIndex = 0;
      }
      
    }


  //## Initalize variables
  const SimObject = new SimulationClass();

  fetchSimulation();

  const simulationField = document.getElementById("simulationField");
  const generation = document.getElementById("population"); // Gen
  const population = document.getElementById("generation"); // Pop

  const pageHeader = document.getElementById("header");
  pageHeader.innerText = "Conway's Game of Life";

  const stopButton = document.getElementById("stopButton");
  stopButton.disabled = true;


  //## Build the simulationField
  const numRows = SimObject.gridRows; // These numbers have to correspond to the styles.css repeat() declaration.
  const numCols = SimObject.gridColumns; // These numbers have to correspond to the styles.css repeat() declaration.
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
        targetCell.style.backgroundColor = "#23333e"; // -> get the css style variables later
      
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
            targetCell.style.backgroundColor = "#B6C649"; // -> get the css style variables later
          } else if (!cell) {
            const cellId = j + "-" + i;
            const targetCell = document.getElementById(cellId);
            targetCell.style.backgroundColor = "#23333e"; // -> get the css style variables later
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

        const startButton = document.getElementById("startButton");
        startButton.disabled = false;

        const newButton = document.getElementById("newButton");
        newButton.disabled = false;

        const stopButton = document.getElementById("stopButton");
        stopButton.disabled = true;

        console.log("Simulation Finished.")
      }
    }, 100);
  }

  //# Fetch the simulation from the server.
  function fetchSimulation () {
    console.log("'fetchSimulation' function called.")
    fetch(simDataEndpoint)
      .then((response) => response.json())
      .then((simulationData) => SimObject.genArray = simulationData)
      .then(console.log("'fetchSimulation Complete!"));
  }

  // ## Button wrapper functions.
  function startAction () {
    console.log("'startAction' initiated.")

    const startButton = document.getElementById("startButton");
    startButton.disabled = true;

    const newButton = document.getElementById("newButton");
    newButton.disabled = true;

    const stopButton = document.getElementById("stopButton");
    stopButton.disabled = false;

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

    const startButton = document.getElementById("startButton");
    startButton.disabled = false;

    const newButton = document.getElementById("newButton");
    newButton.disabled = false;

    const stopButton = document.getElementById("stopButton");
    stopButton.disabled = true;

    if (SimObject.running) {
      SimObject.paused = true;
      console.log("'stopAction' complete.")
    }
  }

  function newAction () {
    console.log("'newAction' initiated.")
    stopAction();
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