$(document).ready(function() {
  function fetchSimulation() {
    const simulation = document.getElementById("simulation");
    const data = new FormData();

    data.append("matrixRows", 10);
    data.append("matrixColumns", 10);
    data.append("sequenceLength", 10);

    fetch(simulationEndpoint, {
      method: "POST",
      body: data,
    })
      .then((response) => response.json())
      .then((data) => (simulation.innerHTML = data));
  }

  function clear() {
    const root = document.getElementById("root");

    root.innerHTML = null;
  }

  $("#printButton").click(() => fetchSimulation());
  $("#clearButton").click(() => clear());
});
