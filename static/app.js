$(document).ready(function() {
  function fetchSimulation() {
    const simulation = document.getElementById("simulation");
    const form = new FormData();

    form.append("matrixRows", 10);
    form.append("matrixColumns", 10);
    form.append("sequenceLength", 10);

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
