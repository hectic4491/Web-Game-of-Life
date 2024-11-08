document.addEventListener('DOMContentLoaded', pageLoaded);


function pageLoaded() {
    const simulationDiv = document.getElementById("simulationField");
    const selectButton = document.getElementById("selectButton");

    document.getElementById("startButton").addEventListener('click', startAction);
    document.getElementById("stopButton").addEventListener('click', stopAction);
    document.getElementById("newButton").addEventListener('click', newAction);
    document.getElementById("selectButton").addEventListener('click', selectAction);

    simulationDiv.innerHTML = "This is the simulation-field element called simulationDiv in javascript.";
};


const startAction = () => {
    return (document.getElementById("simulationField").innerHTML = "Start")
};

const stopAction = () => {
    return (document.getElementById("simulationField").innerHTML = "Stop")
};

const newAction = () => {
    return (document.getElementById("simulationField").innerHTML = null)
};

const selectAction = () => {
    return (document.getElementById("simulationField").innerHTML = "Selecting...")
};