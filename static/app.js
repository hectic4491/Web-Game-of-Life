$(document).ready(function() {
  function fetchSimulation() {
    const root = document.getElementById("root");
    fetch("127.0.0.1:5000/simulation").then((response) =>
      console.log(response.json()),
    );
  }

  function clear() {
    const root = document.getElementById("root");
    root.innerHTML = null;
  }

  $("#printButton").click(() => fetchSimulation());
  $("#clearButton").click(() => clear());
});
