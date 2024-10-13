$(document).ready(function() {
  function hello() {
    const root = document.getElementById("root");
    root.innerHTML = "Hello World";
  }

  function clear() {
    const root = document.getElementById("root");
    root.innerHTML = null;
  }

  $("#printButton").click(() => hello());
  $("#clearButton").click(() => clear());
});
