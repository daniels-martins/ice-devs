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
    searchResultDiv.innerHTML = 'Searching for grid code availability. Please wait...'; // default message pre api call

    axios.post(baseUrl + fn.routeToSearchGridCode(), data, { headers: headers })
        .then(function (response) {
            const resBody = response.data;
            alert('we good')
            console.log(resBody, resBody.data);
            if (resBody.code == '200' && resBody.message == "Retrieved successful") {
                const foundGridCodeInfo = resBody.data.details;
                searchResultDiv.innerHTML = ''; // Clear previous message 
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


export function handleGenerateDistanceButton() {
    let sourceGridCode = document.getElementById('sourceGridCode');
    let sourceCountry = document.getElementById('sourceCountry');
    let destinationGridCode = document.getElementById('destinationGridCode');
    let destinationCountry = document.getElementById('destinationCountry');
    const distanceResultElement = document.getElementById('distanceResult');
    console.log('sourcegridcode', sourceGridCode);

    const baseUrl = 'https://gcorea.gridweb.net';

    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
        'api-key': fn.getApiToken(),
    };

    const data = {
        sourceGridCode: sourceGridCode.value,
        sourceCountryCode: sourceCountry.value,
        destinationGridCode: destinationGridCode.value,
        destinationCountryCode: destinationCountry.value,
    };

    // default state once processing begins
    distanceResultElement.innerHTML = 'calculating distance. please wait...';

    // return 0;
    axios.post(baseUrl + fn.routeToGenerateGridCodeDistance(), data, { headers: headers })
        .then(function (response) {
            const resBody = response.data;
            console.log(resBody);
            if (resBody.code == 200 && resBody.message == "Distance calculated successful") {
                const foundGridCodeDistance = resBody.data;
                console.log('man', foundGridCodeDistance, foundGridCodeDistance.sourceGridCode);

                let result = `<p>
               Distance calculated successful <br> 
                Result: <br> 
                <b>Total distance from point A:</b>  ${foundGridCodeDistance.sourceGridCode.address}<br> <br> 
                <b>To Point B:</b>  ${foundGridCodeDistance.destinationGridCode.address}<br> <br> 
                Is approximately:  <b> ${foundGridCodeDistance.distanceKm} km</b> <br> 
                and the estimated Travel Time : <b> ${foundGridCodeDistance.estimatedTravelTime} minutes</b> <br> 
                </p>`;
                // final state after processing is concluded.
                distanceResultElement.innerHTML = result;
            }
        }).catch(function (error) {
            console.error('error in generating distance', error, error.data)
        })
}


export function handleValidationOfGridCode() {
    let inputedGridcode = document.getElementById('searchInputForGridCodeValidation');
    let selectedCountry = document.getElementById('country-select');
    let gridcode = inputedGridcode.value;
    let countryCode = selectedCountry.value;

    console.log('about to validate', gridcode, countryCode);
    // return 0;
    alert('validating grid code : ' + gridcode);
    // return fn.validateGridCodeFromApi(gridcode, countryCode)
    let validationResultElement = document.getElementById('validationResult');
    // default state once processing begins
    validationResultElement.innerHTML = 'Validating Grid code. please wait...';

    // Make an API request using the selected location (gridcode)
    const baseUrl = 'https://gcorea.gridweb.net';

    axios.get(baseUrl + fn.routeToVerifyGridCode(gridcode, countryCode), {
        headers: {
            'api-key': fn.getApiToken()
        }
    })
        .then(function (response) {
            let resBody = response.data;
            if (resBody.code == 200 && resBody.message == 'Verified') {
                console.log('hello', response.data);
                let verifiedGridCode = resBody.data.gridCode;
                let verifiedcountryCode = resBody.data.countryCode;
                let verifiedValidity = resBody.data.isValid;

                // display the formatted validation message from api: post validation
                validationResultElement.innerHTML =
                    `Success: ${verifiedGridCode} for ${verifiedcountryCode} is valid 👍`;
            }
        })
        .catch(function (error) {
            alert('an error occured')
            console.error('Error fetching data:', error);
        });
}


