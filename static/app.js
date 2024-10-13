$(document).ready(function() {
  function fetchSimulation() {
    const simulation = document.getElementById("simulation");
    const form = new FormData();

    const matrixRows = document.getElementById("matrixRows").value;
    const matrixColumns = document.getElementById("matrixColumns").value;
    const sequenceLength = document.getElementById("sequenceLength").value

    form.append("matrixRows", matrixRows);
    form.append("matrixColumns", matrixColumns);
    form.append("sequenceLength", sequenceLength);

    fetch(simulationEndpoint, {
      method: "POST",
      body: form,
    })
      .then((response) => response.json())
      .then((simulationData) => (simulation.innerHTML = simulationData));
  }

  function clear() {
    const simulation = document.getElementById("simulation");

    simulation.innerHTML = null;
  }

  $("#printButton").click(() => fetchSimulation());
  $("#clearButton").click(() => clear());
});
