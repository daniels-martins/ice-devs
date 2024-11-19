'use strict';
// localStorage.clear();
import axios from 'https://cdnjs.cloudflare.com/ajax/libs/axios/1.7.7/esm/axios.js'; // Even though it's from the CDN, import it as a module

import { universities, hospitals, categories, countries } from "./dictionary.js";
import * as fn from './functions.js';
import * as listener from './listeners.js';

const hospitalSelectElement = document.getElementById('hospital-select');
const universitySelectElement = document.getElementById('university-select');
const countrySelectElement = document.getElementById('country-select');

// handle default data for universities dropdown
universities.forEach(university => fn.populateUniversities(university, universitySelectElement));
// handle default data for hospitals dropdown
hospitals.forEach(hospital => fn.populateHospitals(hospital, hospitalSelectElement));

// handle default data for Countries dropdown
countries.forEach(country => fn.populateCountries(country, countrySelectElement));



// =================EVENT LISTENERS========================



// Add event listener to handle selection
hospitalSelectElement.addEventListener('change', function () {
    // let selectedLocation = this.value;
    const selectedLocation = this.options[this.selectedIndex];
    handleGridCodeGenerationForSelectedHospital(selectedLocation);
});

// Event listener for the gridcode search button
document.getElementById('searchButton')
    .addEventListener('click', () => listener.handleClickEventOnSearchButton());


// Event listener for the gridcode validate button
document.getElementById('searchButtonForGridCodeValidation')
    .addEventListener('click', () => listener.handleValidationOfGridCode());











// =============================================================================
// =============================================================================
// =============================================================================

// Add event listener to handle selection
universitySelectElement.addEventListener('change', function () {
    const selectedLocation = this.value;
    if (selectedLocation) {
        alert('we here')
        // Make an API request using the selected location
        const baseUrl = 'https://gcorea.gridweb.net';

        axios.get(baseUrl + fn.routeToVerifyGridCode(), {
            headers: {
                'api-key': fn.getApiToken()
            }
        })
            .then(function (response) {
                // alert('fifi')
                console.log('hello', response.data);
            })
            .catch(function (error) {
                alert('an error occured')
                console.error('Error fetching data:', error);
            });
    }
});


























// helper

function handleGridCodeGenerationForSelectedHospital(selectedLocation) {
    if (selectedLocation) {
        // Make an API request using the selected location
        const baseUrl = 'https://gcorea.gridweb.net';
        const apiToken = fn.getApiToken();
        const headers = {
            'api-key': fn.getApiToken()
        };
        const data = {
            countryCode: 'NG',
            long: selectedLocation.getAttribute('long'),
            lat: selectedLocation.getAttribute('lat'),
        };
        const hospitalGridCodeContainer = document.getElementById('hospital-grid-code-container');
        // show the user that we are processing the request
        hospitalGridCodeContainer.innerHTML = 'Processing...';
        // return 0;
        axios.post(baseUrl + fn.routeToGenerateGridCode(), data, { headers: headers })
            .then(function (response) {
                const resBody = response.data;

                hospitalGridCodeContainer.innerHTML = ''; // Clear previous data
                if (resBody.code == '200' && resBody.message == 'Gridcode generated successful') {
                    console.log('resbody', resBody);

                    let hospitalGridCodeElem = document.createElement('div');
                    hospitalGridCodeElem.textContent = `Grid Code : ${resBody.data.gridcode}`;
                    let hospitalLocationInfoElem = document.createElement('div');
                    hospitalLocationInfoElem.textContent = `Address :  ${resBody.data.address}`

                    hospitalGridCodeContainer.appendChild(hospitalGridCodeElem);
                    hospitalGridCodeContainer.appendChild(hospitalLocationInfoElem);

                    // Save gridcode data to Local Storage
                    let keyInStorage = `${data.long}_${data.lat}`;
                    console.log('OUR DATA', data, 'resBody', resBody);
                    // return 0;

                    // using the data from the request to test and it worked
                    let valueInStorageRaw = {
                        gridcode: 'aaac-aabl' || resBody.data.gridcode,
                        address: '23st, ava kigali rwanda' || resBody.data.address,
                        countryCode: 'RW' || fn.getCountryCode(resBody.data.country, countries),
                        categoryId: 'EA6955C1-153D-4AC8-AAD2-A37E29189920' || fn.getGridCodeCategory('office'),
                        titleDescription: '23st, ava kigali rwanda' || resBody.data.address,

                        lat: '23.019622957719968' || data.lat,  //+0
                        latA: '23.019622957719968' || data.lat,  //+0
                        latB: '23.019622957719969' || fn.getLatLongDeviation(data.lat), //+2 
                        latC: '23.019622957719970' || fn.getLatLongDeviation(fn.getLatLongDeviation(data.lat)),  //+4

                        long: '72.5112663229025' || data.long,  //+0
                        longA: '72.5112663229025' || data.long,  //+0
                        longB: '72.5112663229026' || fn.getLatLongDeviation(data.long), //+2 
                        longC: '72.5112663229029' || fn.getLatLongDeviation(fn.getLatLongDeviation(data.long)), //+4

                        generateAction: 'NONE'
                    }


                    let valueInStorage = {
                        gridcode: resBody.data.gridcode,
                        address: resBody.data.address,
                        // countryCode: fn.getCountryCode(resBody.data.country, countries),
                        countryCode: data.countryCode,
                        categoryId: fn.getGridCodeCategory('office'),
                        titleDescription: resBody.data.address,

                        lat: data.lat,  //+0
                        latA: data.lat,  //+0
                        latB: fn.getLatLongDeviation(data.lat), //+1 
                        latC: fn.getLatLongDeviation(fn.getLatLongDeviation(data.lat)),  //+2

                        long: data.long,  //+0
                        longA: data.long,  //+0
                        longB: fn.getLatLongDeviation(data.long), //+1
                        longC: fn.getLatLongDeviation(fn.getLatLongDeviation(data.long)), //+2

                        generateAction: 'NONE'
                    }

                    let jsonValueInStorage = JSON.stringify(valueInStorage);
                    localStorage.setItem(keyInStorage, jsonValueInStorage);
                    console.log('about to store in api', valueInStorage, 'retrievedFromStorage', JSON.parse(localStorage.getItem(keyInStorage)));

                    // generate the second grid code
                    // Nested Axios request
                    axios.post(baseUrl + fn.routeToGenerateGridCode(), data, { headers: headers })
                        .then(function (nestedResponse) {
                            const nestedResBody = nestedResponse.data;
                            if (nestedResBody.code == '200' && nestedResBody.message == 'Gridcode generated successful') {
                                // Store the result of the nested request in localStorage
                                valueInStorage.gridcode2 = nestedResBody.data.gridcode;
                                localStorage.setItem(keyInStorage, JSON.stringify(valueInStorage));
                                console.log(
                                    'updated girdcodes for this location :' + resBody.data.address,
                                    JSON.parse(localStorage.getItem(keyInStorage))
                                );

                            }
                        })
                        .catch(function (nestedError) {
                            console.error('Error in nested Axios request:', nestedError);
                        });

                    const headersNew = {
                        'api-key': fn.getApiToken(),
                        'Content-Type': 'application/json', // For JSON data
                        'Accept': '*/*',
                    };
                    console.log('we sent', 'valueInStorage', valueInStorage);

                    // Save gridcode data to Api
                    axios.post(baseUrl + fn.routeToSaveGridCode(), valueInStorage, { headers: headersNew })
                        .then(response => {
                            let resBody = response.data;
                            console.log('we found', resBody);
                        })
                        .catch(function (error) {
                            alert('we saw an error')
                            console.error('Error fetching data:', error);
                            console.log('url', baseUrl + fn.routeToSaveGridCode(), 'valueInStorage', valueInStorage)
                        });

                    // Retrieve data from Local Storage
                    const locallyStoredGridCodeInJson = localStorage.getItem(keyInStorage);
                    const locallyStoredGridCode = JSON.parse(locallyStoredGridCodeInJson);

                    console.log(
                        'keyInStorage', keyInStorage,
                        'locallyStoredGridCode', locallyStoredGridCode, locallyStoredGridCode.address
                    );
                }
            })
            .catch(function (error) {
                alert('an error occured')
                console.error('Error fetching data:', error, error.data);
            });
    }
}




export { axios }; // Export axios