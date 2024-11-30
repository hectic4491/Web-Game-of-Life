/*
## This is Travis' intial code for the app. It was used to guide
   Rob's development.

## Observation: Compared to Python, JavaScript uses a lot of 
 nested functions. So much so, that we have a few common
 shorthand notations to write functions. I know that we could
 technically write python to nest functions to match the same
 levels of scope as JavaScript, but javascript seems to be more
 event focused. i.e.: A lot of the code we write is event based.
 Meaning a lot of arguments we pass are simply the "effect" of 
 the outer function's "cause". e.g.: The first function call we
 define is accessing the $(document) object that is created to
 represent the entire DOM. This object is made available as soon
 as the jQuery library is loaded from app.html.
 
# Notes on the order of requesting a webpage #
 > Client Initiates a Request:...
 > Server Receives the Request:...
 > Server Processes the Request:...
 > Server Sends Response:...
 > Browser Receives Reponse: The browser receives the response and
    begins to parse the HTML content.
 > Dom Construction: As the browser parses the HTML, it constructs 
    the DOM, which is an in-memory representation of the HTML
    structure.
 > External Resource Loading:
    During parsing, the browser encounters references to external
    resources. (CSS, JavaScript, images, etc.) It sends additional
    requests to retrieve these resources.
    While these resources are being loaded, the browser continues
    parsing the HTML.
 > Executes JavaScript:
    JavaScript is executed at this stage, which might modify the DOM
    further or add event listeners.
    If a <script> tag has the 'defer' attributes, it will execute
    after the HTML has been completely parsed.
    If a <script> tag has the async attribute, it will execute as
    soon as it is downloaded.
 > DOMContentLoaded Event:
    Once the HTML is fully parsed and the DOM is complete (excluding
    external resources and images) the DOMContentLoaded event is 
    fired. This means the HTML structure is ready for manipulation.
    At this same moment, the jQuery .ready() method runs.
 > Page Fully Loaded:
    The 'load' event is fired once all external resources have also
    been loaded. This indicates that the entire page, including all
    dependencies, is fully loaded.

i.e.:

    Client -> GET /page.html -> Server
              Server -> Response (HTML) -> Browser
              Browser parses HTML-> Constructs DOM
              [ $(document).ready() fires here ]
              Browser requests CSS, JS, images -> Continues parsing
              JavaScript executes -> DOM manipulation possible
              Browser fires `window.onload` event -> Page fully loaded

Because of jQuery, this object has a .ready method. In this method
we pass a function that is evoked to initialize variables, provide
access to choice html elements, initialize some of the html page
programmatically, create functions, and attach functionality to the
html's buttons with these functions.


 This first function call makes sure that all the html
 elements are fully loaded before running any JavaScript code.
 We do this by using the jquery $(document).ready() method.
 You pass an anonymous function to ready() which jquery will execute
 once the DOM is fully loaded. We use anonymous function notation and
 write the contents of the function within the function call
 curly braces.
 
 This function runs everytime the page is loaded or reloaded.
 This includes every time the page is first accessed, and every
 time it is reloaded or navigated to.
*/
$(document).ready(function() {


  // ## Initialize ##
  // Initalize some important html elements into usable JavaScript
  // variables. This is the Div element that is going to contain our
  // simulation.
  const simulationDiv = document.getElementById("simulation");

  // function
  const clearFrame = () => (simulationDiv.innerHTML = null);

  // function
  function renderSimulation(simulation) {
    const renderFrame = (frame) =>
      frame.forEach((row) =>
        simulationDiv.append(row, document.createElement("div")),
      );

    // initalize this function variable to 0
    let index = 0;

    // this cycles through the actual "animation"
    const intervalId = setInterval(() => {
      if (index < simulationData.length) {
        clearFrame();
        renderFrame(simulationData[index]);
        index++;
      } else {
        clearInterval(intervalId);
      }
    }, 100);
  }

  // function
  function fetchSimulation() {
    // we initalize a form object
    const form = new FormData();

    // Here we grab the input
    const matrixRows = document.getElementById("matrixRows").value || 159;
    const matrixColumns = document.getElementById("matrixColumns").value || 50;
    const sequenceLength = document.getElementById("sequenceLength").value || 100;

    // Here we append the form object with the input
    form.append("matrixRows", matrixRows);
    form.append("matrixColumns", matrixColumns);
    form.append("sequenceLength", sequenceLength);

    // we fetch the simulation by posting our form to the server. we use the
    // asynchronous built in function 'fetch' to grab this data. we fetch the
    // 'simulationEndpoints' url? the succes is response. we read this response in
    // its JSON format. 
    // We run a renderSimulation function on the data.
   fetch(simulationEndpoint, {
      // Set the method of the HTTP request
      method: "POST",
      // set the body of the HTTP request.
      // (request take the form of (head, body))
      body: form,
    })
      // if we successfully receive the data from the server, we translate the
      // data into a JavaScript usable 
      .then((response) => response.json())
      .then((simulationData) => renderSimulation(simulationData));
  }

  // attach functions to buttons
  $("#printButton").click(() => fetchSimulation());
  $("#clearButton").click(() => clearFrame());
});