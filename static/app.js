$(document).ready(function() {
  const simulationDiv = document.getElementById("simulation");
  const clearFrame = () => (simulationDiv.innerHTML = null);

  function renderSimulation(simulation) {
    const renderFrame = (frame) =>
      frame.forEach((row) =>
        simulationDiv.append(row, document.createElement("div")),
      );

    let index = 0;

    const intervalId = setInterval(() => {
      if (index < simulation.length) {
        clearFrame();
        renderFrame(simulation[index]);
        index++;
      } else {
        clearInterval(intervalId);
      }
    }, 100);
  }

  function fetchSimulation() {
    const form = new FormData();

    const matrixRows = document.getElementById("matrixRows").value || 159;
    const matrixColumns = document.getElementById("matrixColumns").value || 50;
    const sequenceLength = document.getElementById("sequenceLength").value || 100;

    form.append("matrixRows", matrixRows);
    form.append("matrixColumns", matrixColumns);
    form.append("sequenceLength", sequenceLength);

    fetch(simulationEndpoint, {
      method: "POST",
      body: form,
    })
      .then((response) => response.json())
      .then((simulationData) => renderSimulation(simulationData));
  }

  $("#printButton").click(() => fetchSimulation());
  $("#clearButton").click(() => clearFrame());
});
