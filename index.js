'use strict';

const apiKey = 'PywVNsn3a0bYuVnrcNKpVcs0qjj0WT524ZOKEwk2'; 
const searchURL = 'https://developer.nps.gov/api/v1/parks';

function formatQueryParams(params) {
    const queryItems = Object.keys(params)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
  }

function getParksList(query, maxResults) {
    const params = {
      api_key: apiKey,
      stateCode: query,
      limit: maxResults
    };
    const queryString = formatQueryParams(params)
    const url = searchURL + '?' + queryString;
  
    fetch(url)
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error(response.statusText);
      })
      .then(responseJson => displayResults(responseJson))
      .catch(err => {
        $('#js-error-message').text(`Something went wrong: ${err.message}`);
      });   
}

function displayResults(responseJson){
    console.log(responseJson);
    if (responseJson.data.length == 0) {
        alert('No results found, please try again!');
        return;
    }
    $('.results').empty();
    for (let i =0; i < responseJson.data.length; i++){
        let parkName = responseJson.data[i].fullName;
        let description = responseJson.data[i].description;
        let websiteUrl = responseJson.data[i].url;
        let parkAddress = formatAddress(responseJson.data[i].addresses[1]);
        $('.results').append(`<ul><li>Park name: ${parkName}</li><li>Description: ${description}</li><li>Website URL: <a target='_blank' href='${websiteUrl}'> ${websiteUrl}</a></li><li>Address: ${parkAddress}</li><ul>`);
    } 
}

function formatAddress(addressObject) {
    return `${addressObject.line1}, ${addressObject.city}, ${addressObject.stateCode}, ${addressObject.postalCode}`;
}

function watchForm() {
    $('form').submit(event => {
      event.preventDefault();
      const state_code = $('#state').val();
      const maxResults = $('#js-max-results').val();
      getParksList(state_code, maxResults);
    });
  }
  
$(watchForm);