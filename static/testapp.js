$(document).ready(function() {

  console.log("JavaScript is running")
  const simulationField = document.getElementById("simulationField");
  const pageHeader = document.getElementById("header");
  pageHeader.innerText = "Conway's Game of Life";

  // Buiild the simulationField
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

  function printFrame (simulationData) {
    const renderFrame = (frame) => {
      let j = 0;
      frame.forEach((row) => {
        let i = 0;
        for (const cell of row) {
          console.log(j, i, cell);
          if (cell === 1) {
            const makeId = j + "-" + i;
            console.log(makeId);
            const targetCell = document.getElementById(makeId);
            targetCell.style.backgroundColor = "black"; // -> get the css style variables later
          } else if (cell === 0) {
            const makeId = j + "-" + i;
            console.log(makeId);
            const targetCell = document.getElementById(makeId);
            targetCell.style.backgroundColor = "white"; // -> get the css style variables later

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


  function fetchSimulation () {
    fetch(simDataEndpoint)
      .then((response) => response.json())
      .then((simulationData) => printFrame(simulationData));
  }

  $("#startButton").click(() => fetchSimulation())

});

  // const simulation = new Simulation("Random", [1, 2, 3]);
  // document.getElementById("simulationType").innerHTML = String(simulation.name);

  // // TODO
  // const clearFrame = () => (simulationDiv.innerHTML = null);

  // // TODO
  // function renderSimulation(simulation) {
  //  const renderFrame = (frame) =>
  //     frame.forEach((row) =>
  //       simulationDiv.append(row, document.createElement("div")),
  //     );



  //   let index = 0;

  //   const intervalId = setInterval(() => {
  //     if (index < simulation.length) {
  //       clearFrame();
  //       renderFrame(simulation[index]);
  //       index++;
  //     } else {
  //       clearInterval(intervalId);
  //     }
  //   }, 100);
  // }


  // function fetchSimulation() {
  //   const form = new FormData();

  //   const matrixRows = 36;
  //   const matrixColumns = 82;
  //   const sequenceLength = 100;

  //   form.append("matrixRows", matrixRows);
  //   form.append("matrixColumns", matrixColumns);
  //   form.append("sequenceLength", sequenceLength);
 
  //   fetch(simulationEndpoint, {
  //     method: "POST",
  //     body: form,
  //   })
  //     .then((response) => response.json())
  //     .then((simulationData) => renderSimulation(simulationData));
  // }
  
  // document.getElementById("startButton").addEventListener('click', fetchSimulation);
  // document.getElementById("stopButton").addEventListener('click', stopAction);
  // document.getElementById("newButton").addEventListener('click', newAction);
  // document.getElementById("selectButton").addEventListener('click', selectAction);



// function startAction () {
//   return (document.getElementById("simulationField").innerHTML = "Start")
// };

// function stopAction () {
//   return (document.getElementById("simulationField").innerHTML = "Stop")
// };

// function newAction () {
//   return (document.getElementById("simulationField").innerHTML = null)
// };

// function selectAction () {
//   return (document.getElementById("simulationField").innerHTML = "Selecting...")
// };