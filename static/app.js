$(document).ready(function() {
  function fetchSimulation() {
    const root = document.getElementById("root");

    fetch(simulationEndpoint)
      .then((response) => response.json())
      .then((data) => (root.innerHTML = data));
  }

  function clear() {
    const root = document.getElementById("root");
    root.innerHTML = null;
  }

  $("#printButton").click(() => fetchSimulation());
  $("#clearButton").click(() => clear());
});
