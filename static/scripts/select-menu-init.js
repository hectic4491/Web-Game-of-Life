/*Builds the select menu dynamically by reading the patterns in
lib/patterns.toml and the saved patterns in the browsers localstorage,*/

// Menu back button
$("#selectMenuBackButton").click(() => window.selectAction());


// Random Pattern
$('#randomButton').click(() => {
  $("body").data('selection', {
    'patternName': 'Random',
    'patternData': 'None'
  })

  window.selectAction();
  window.loadSimulation();
})

// Initilize the select menu by fetching the pattern data from
// patterns.toml. This data is then used to set pattern names,
// pattern descriptions, button .data(), and html button click events.
fetch('/writepatterns')
    .then((response) => {return response.json()})
    .then((data) => {

      button_count = Object.keys(data).length;
      Object.keys(data).forEach(key => {

        const patternNameId = `patternName${data[key]['id']}`;
        const patternName = document.getElementById(patternNameId);
        patternName.textContent = key

        const patternDescriptionId = `patternDescription${data[key]['id']}`;
        const patternDescription = document.getElementById(patternDescriptionId);
        patternDescription.textContent = data[key]['description'];


        const rowButtonId = `rowButton${data[key]['id']}`;
        $(`#${rowButtonId}`).data('patternName', key)
        $(`#${rowButtonId}`).data('patternData', data[key]['alive_cells'])

        // Button EventListeners
        $(`#${rowButtonId}`).click(() => {
          $("body").data('selection', {
            'patternName': $(`#${rowButtonId}`).data('patternName'),
            'patternData': $(`#${rowButtonId}`).data('patternData')
          });
      
          window.selectAction();
          window.loadSimulation();
        })

      })
    })
    .catch((error) => {
      console.error('Error fetching pattern data from URL /getpatterns ', error);
    })


//TODO: Load in the saved patterns from local storage as the first type.

//TODO: Add the random selection button