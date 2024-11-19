import * as fn from './functions.js';
import axios from 'https://cdnjs.cloudflare.com/ajax/libs/axios/1.7.7/esm/axios.js'; // Even though it's from the CDN, import it as a module
/**
 * WHERE searchFor is a gridcode
 * @return [type]
 */
export function handleClickEventOnSearchButton() {
    const searchFor = document.getElementById('searchInput').value;
    let associatedResult = null;
    alert('searching api for grid code : ' + searchFor);
    // return 0;
    // searching for an item in the localStorage : extract to helpers
    // for (let i = 0; i < localStorage.length; i++) {
    //     let key = localStorage.key(i);
    //     let valueAsJson = localStorage.getItem(key);
    //     let valueInStorage = (valueAsJson);

    //     if (valueInStorage.gridcode !== searchFor) {
    //         continue;
    //     } else {
    //         alert('we found a match locally')
    //     }
    //     associatedResult = valueInStorage;
    //     console.log('somalia', key + " = " + valueAsJson);
    //     console.log('assocRes', associatedResult);
    // }

    // search for the gridcode in the API
    const baseUrl = 'https://gcorea.gridweb.net';

    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
        'api-key': fn.getApiToken(),
    };
    const data = {
        "gridCodes[0]": searchFor,
        "countryCodes[0]": "NG",
    };

    const searchResultDiv = document.getElementById('searchResultForGridCode');

    axios.post(baseUrl + fn.routeToSearchGridCode(), data, { headers: headers })
        .then(function (response) {
            const resBody = response.data;
            alert('we good')
            console.log(resBody, resBody.data);
            if (resBody.code == '200' && resBody.message == "Retrieved successful") {
                const foundGridCodeInfo = resBody.data.details;
                searchResultDiv.innerHTML = ''; // Clear previous results
                searchResultDiv.innerHTML += `<p>
                Result: <br> 
                "gridCode":  ${foundGridCodeInfo[0].gridCode}<br> 
                "lat": ${foundGridCodeInfo[0].lat} <br> 
                "lng": ${foundGridCodeInfo[0].lng} <br> 
                "country": ${foundGridCodeInfo[0].country}<br> 
                "city": ${foundGridCodeInfo[0].city}<br> 
                "state": ${foundGridCodeInfo[0].state}<br> 
                "address": ${foundGridCodeInfo[0].address}
                </p>`;
            }

        }).catch(function (error) {
            // alert('an error occured')
            searchResultDiv.innerHTML = `No match found for gridcode :  "${searchFor}"`; // Clear previous results
            console.error('Error search data from api:', error, 'error data', error.data);
        });

    // display search results from the api

}

export function handleValidationOfGridCode() {
    let inputedGridcode = document.getElementById('searchInputForGridCodeValidation');
    let selectedCountry = document.getElementById('country-select');
    let gridcode = inputedGridcode.value;
    let countryCode = selectedCountry.value;
    console.log('about to validate', gridcode, countryCode);
    // return 0;
    alert('validating grid code : ' + gridcode);
    return fn.validateGridCodeFromApi(gridcode, countryCode)
}