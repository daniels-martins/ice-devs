import * as fn from './functions.js';
import axios from 'https://cdnjs.cloudflare.com/ajax/libs/axios/1.7.7/esm/axios.js'; // Even though it's from the CDN, import it as a module
/**
 * WHERE searchFor is a gridcode
 * @return [type]
 */
export function searchForHospitalGridCode() {
    const searchFor = document.getElementById('searchInputForHospitals').value;
    let associatedResult = null;
    // alert('searching api for grid code : ' + searchFor);
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

    const searchResultDiv = document.getElementById('searchResultForHospitalGridCode');
    searchResultDiv.innerHTML = 'Searching for grid code availability. Please wait...'; // default message pre api call

    axios.post(baseUrl + fn.routeToSearchGridCode(), data, { headers: headers })
        .then(function (response) {
            const resBody = response.data;
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

/**
 * WHERE searchFor is a gridcode
 * @return [type]
 */
export function searchForUniversityGridCode() {
    const searchFor = document.getElementById('searchInputForUniversities').value;
    let associatedResult = null;

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

    const searchResultDiv = document.getElementById('searchResultForUniversityGridCode');
    searchResultDiv.innerHTML = 'Searching for grid code availability. Please wait...'; // default message pre api call

    axios.post(baseUrl + fn.routeToSearchGridCode(), data, { headers: headers })
        .then(function (response) {
            const resBody = response.data;
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

export function handleGenerateDistanceButtonForHospitals() {
    const sourceGridCodeForHospital = document.getElementById('sourceGridCodeForHospital');
    const sourceCountryForHospital = document.getElementById('sourceCountryForHospital');
    const destinationGridCodeForHospital = document.getElementById('destinationGridCodeForHospital');
    const destinationCountryForHospital = document.getElementById('destinationCountryForHospital');
    const distanceResultElementForHospital = document.getElementById('distanceResultForHospital');
    console.log('sourcegridcode', sourceGridCodeForHospital);

    const baseUrl = 'https://gcorea.gridweb.net';

    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
        'api-key': fn.getApiToken(),
    };

    const data = {
        sourceGridCode: sourceGridCodeForHospital.value,
        sourceCountryCode: sourceCountryForHospital.value,
        destinationGridCode: destinationGridCodeForHospital.value,
        destinationCountryCode: destinationCountryForHospital.value,
    };

    // default state once processing begins
    distanceResultElementForHospital.innerHTML = 'calculating distance. please wait...';

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
                and the estimated Travel Time : <b> ${foundGridCodeDistance.estimatedTravelTime}</b> <br> 
                </p>`;
                // final state after processing is concluded.
                distanceResultElementForHospital.innerHTML = result;
            }
        }).catch(function (error) {
            console.error('error in generating distance', error, error.data)
        })
}



export function handleGenerateDistanceButtonForUniversities() {
    const sourceGridCodeForUniversity = document.getElementById('sourceGridCodeForUniversity');
    const sourceCountryForUniversity = document.getElementById('sourceCountryForUniversity');
    const destinationGridCodeForUniversity = document.getElementById('destinationGridCodeForUniversity');
    const destinationCountryForUniversity = document.getElementById('destinationCountryForUniversity');
    const distanceResultElementForUniversity = document.getElementById('distanceResultForUniversity');
    console.log('sourcegridcode', sourceGridCodeForUniversity);

    const baseUrl = 'https://gcorea.gridweb.net';

    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
        'api-key': fn.getApiToken(),
    };

    const data = {
        sourceGridCode: sourceGridCodeForUniversity.value,
        sourceCountryCode: sourceCountryForUniversity.value,
        destinationGridCode: destinationGridCodeForUniversity.value,
        destinationCountryCode: destinationCountryForUniversity.value,
    };

    // default state once processing begins
    distanceResultElementForUniversity.innerHTML = 'calculating distance. please wait...';

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
                and the estimated Travel Time : <b> ${foundGridCodeDistance.estimatedTravelTime}</b> <br> 
                </p>`;
                // final state after processing is concluded.
                distanceResultElementForUniversity.innerHTML = result;
            }
        }).catch(function (error) {
            console.error('error in generating distance', error, error.data)
        })
}



export function handleValidationOfHospitalGridCode() {
    let inputedGridcode = document.getElementById('searchInputForHospitalGridCodeValidation');
    let selectedCountry = document.getElementById('hospital-country-select');
    let gridcode = inputedGridcode.value;
    let countryCode = selectedCountry.value;

    console.log('about to validate', gridcode, countryCode);
    // return 0;
    // alert('validating grid code : ' + gridcode);
    // return fn.validateGridCodeFromApi(gridcode, countryCode)
    let hospitalValidationResultElement = document.getElementById('hospitalValidationResult');
    // default state once processing begins
    hospitalValidationResultElement.innerHTML = `Validating Grid code ${gridcode} . please wait...`;

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
                hospitalValidationResultElement.innerHTML =
                    `Success: ${verifiedGridCode} for ${verifiedcountryCode} is valid 👍`;
            }
        })
        .catch(function (error) {
            alert('an error occured')
            console.error('Error fetching data:', error);
        });
}

export function handleValidationOfUniversityGridCode() {
    let inputedGridcode = document.getElementById('searchInputForUniversityGridCodeValidation');
    let selectedCountry = document.getElementById('university-country-select');
    let gridcode = inputedGridcode.value;
    let countryCode = selectedCountry.value;

    console.log('about to validate', gridcode, countryCode);
    // return 0;
    // alert('validating grid code : ' + gridcode);
    // return fn.validateGridCodeFromApi(gridcode, countryCode)
    let universityValidationResultElement = document.getElementById('universityValidationResult');
    // default state once processing begins
    universityValidationResultElement.innerHTML = `Validating Grid code ${gridcode} . please wait...`;

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
                universityValidationResultElement.innerHTML =
                    `Success: ${verifiedGridCode} for ${verifiedcountryCode} is valid 👍`;
            }
        })
        .catch(function (error) {
            alert('an error occured')
            console.error('Error fetching data:', error);
        });
}





