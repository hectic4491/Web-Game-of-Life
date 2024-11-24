$(document).ready(function() {

  //## Check to see if this prints in console.
  console.log("JavaScript is running")


  //## Initalize variables
  let simulation; //-> this will store our current simulation.
  fetchSimulation();
  const simulationField = document.getElementById("simulationField");
  const pageHeader = document.getElementById("header");
  pageHeader.innerText = "Conway's Game of Life";


  //## Build the simulationField
  const numRows = 36; // These numbers have to correspond to the styles.css repeat() declaration.
  const numCols = 82; // These numbers have to correspond to the styles.css repeat() declaration.
  // for now, use 36x82 (or 82x36) as the test GenArray size. 
  for (let i = 0; i < numRows; i++) {
    for (let j = 0; j < numCols; j++) {
      const gridCell = document.createElement('div');
      gridCell.classList.add('gridCell');
      gridCell.setAttribute('id', (String(i) + "-" + String(j)));
      simulationField.appendChild(gridCell);
    }
  }

  //## Retrieve the css defined variables
  function getCSSVariables() {
    const styles = getComputedStyle(document.documentElement);
    const cssVariables = {};

    for (let i = 0; i < styles.length; i++) {
      const name = styles[i];
      if (name.startsWith('--')) {
        cssVariables[name] = styles.getPropertyValue(name).trim();
      }
    }
    return cssVariables;
  }

  const allCSSVariables = getCSSVariables();
  console.log(Object.keys(allCSSVariables));

  //## Create functions
  //# Render the simulation.
  function renderSimulation (simulationData) {
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
    let index = 0;

    const intervalId = setInterval(() => {
      if (index< simulationData.length) {
        renderFrame(simulationData[index]);
        index++;
      } else {
        clearInterval(intervalId);
      }
    }, 100);
  }

  //# Fetch the simulation from the server.
  function fetchSimulation () {
    fetch(simDataEndpoint)
      .then((response) => response.json())
      .then((simulationData) => simulation = simulationData);
  }

  //## Attach functions to buttons.
  $("#startButton").click(() => renderSimulation(simulation)) 
  $("#newButton").click(() => fetchSimulation())

});

/*
TODO
-> StartButton needs to prevent input on start and new button while the simulation is running.

*/