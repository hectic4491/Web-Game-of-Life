/*Builds the select menu dynamically by reading the patterns in
lib/patterns.toml and the saved patterns in the browsers localstorage,*/


const patternData = {}


// Fetch the pattern data from the backend
fetch('/getpatterns')
    .then((response) => {return response.json()})
    .then((data) => {
      Object.keys(data).forEach(key => {

        const patternId = `pattern${data[key]['id']}`;
        patternData[patternId] = data[key]['alive_cells'];

        const rowButtonId = `rowButton${data[key]['id']}`;

        const patternNameId = `patternName${data[key]['id']}`;
        const patternName = document.getElementById(patternNameId);
        patternName.textContent = key

        const patternDescriptionId = `patternDescription${data[key]['id']}`;
        const patternDescription = document.getElementById(patternDescriptionId);
        patternDescription.textContent = data[key]['description'];

      })
    })
    .catch((error) => {
      console.error('Error fetching pattern data from URL /getpatterns ', error);
    })


//TODO: Load in the saved patterns from local storage as the first type.