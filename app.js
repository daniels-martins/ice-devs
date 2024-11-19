'use strict';
// localStorage.clear();
import axios from 'https://cdnjs.cloudflare.com/ajax/libs/axios/1.7.7/esm/axios.js'; // Even though it's from the CDN, import it as a module
import { universities, hospitals, categories, countries } from "./dictionary.js";
import * as fn from './functions.js';
import * as listener from './listeners.js';

// This is for clearing out local storage
// Example usage:
// const keysToPreserve = ['user', 'theme', 'preferences'];
// fn.deleteUnmatchedKeysInLocalStorage(keysToPreserve);

const hospitalSelectElement = document.getElementById('hospital-select');
const universitySelectElement = document.getElementById('university-select');

const hospitalCountrySelectElement = document.getElementById('hospital-country-select');
const sourceCountryForHospitalSelectElement = document.getElementById('sourceCountryForHospital');
const destinationCountryForHospitalSelectElement = document.getElementById('destinationCountryForHospital');


const universityCountrySelectElement = document.getElementById('university-country-select');
const sourceCountryForniversitySelectElement = document.getElementById('sourceCountryForUniversity');
const destinationCountryForUniversitySelectElement = document.getElementById('destinationCountryForUniversity');



// handle default data for universities dropdown : uncomment later for universities
universities.forEach(university => fn.populateUniversities(university, universitySelectElement));
// handle default data for hospitals dropdown
hospitals.forEach(hospital => fn.populateHospitals(hospital, hospitalSelectElement));
// handle default data for Countries dropdown
countries.forEach(country => fn.populateCountries(country, hospitalCountrySelectElement));
countries.forEach(country => fn.populateCountries(country, sourceCountryForHospitalSelectElement));
countries.forEach(country => fn.populateCountries(country, destinationCountryForHospitalSelectElement));

countries.forEach(country => fn.populateCountries(country, universityCountrySelectElement));
countries.forEach(country => fn.populateCountries(country, sourceCountryForniversitySelectElement));
countries.forEach(country => fn.populateCountries(country, destinationCountryForUniversitySelectElement));


// =================EVENT LISTENERS========================
// Register Event listeners

// Add event listener to handle selection
// for hospitals
hospitalSelectElement.addEventListener('change', function () {
    // let selectedLocation = this.value;
    const selectedLocation = this.options[this.selectedIndex];
    handleGridCodeGenerationForSelectedHospital(selectedLocation);
});

// for universities
universitySelectElement.addEventListener('change', function () {
    const selectedLocation = this.options[this.selectedIndex];
    handleGridCodeGenerationForSelectedUniversity(selectedLocation);
});

// =============================================================================
// Event listener for the gridcode search button
// for hospitals
document.getElementById('searchButtonForHospitals')
    .addEventListener('click', () => listener.searchForHospitalGridCode());

// for universities
document.getElementById('searchButtonForUniversities')
    .addEventListener('click', () => listener.searchForUniversityGridCode());



// =============================================================================
// Event listener for distance generation between two grid codes
// for hospitals
document.getElementById('gridCodeDistanceGenerateBtnForHospitals')
    .addEventListener('click', () => listener.handleGenerateDistanceButtonForHospitals());

// for universities
document.getElementById('gridCodeDistanceGenerateBtnForUniversities')
    .addEventListener('click', () => listener.handleGenerateDistanceButtonForUniversities());


// =============================================================================
// Event listener for the gridcode validate button
// for hospitals
document.getElementById('searchButtonForHospitalGridCodeValidation')
    .addEventListener('click', () => listener.handleValidationOfHospitalGridCode());
// for universities
document.getElementById('searchButtonForUniversityGridCodeValidation')
    .addEventListener('click', () => listener.handleValidationOfUniversityGridCode());

// event for distance generation






// =============================================================================
// =============================================================================
// =============================================================================

// Add event listener to handle selection
// universitySelectElement.addEventListener('change', function () {
//     const selectedLocation = this.value;
//     if (selectedLocation) {
//         alert('we here')
//         // Make an API request using the selected location
//         const baseUrl = 'https://gcorea.gridweb.net';

//         axios.get(baseUrl + fn.routeToVerifyGridCode(), {
//             headers: {
//                 'api-key': fn.getApiToken()
//             }
//         })
//             .then(function (response) {
//                 // alert('fifi')
//                 console.log('hello', response.data);
//             })
//             .catch(function (error) {
//                 alert('an error occured')
//                 console.error('Error fetching data:', error);
//             });
//     }
// });


























// helper

function handleGridCodeGenerationForSelectedHospital(selectedLocation) {
    if (selectedLocation) {
        // Make an API request using the selected location
        const baseUrl = 'https://gcorea.gridweb.net';

        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json',
            'api-key': fn.getApiToken(),
        };
        const data = {
            countryCode: 'NG',
            long: selectedLocation.getAttribute('long'),
            lat: selectedLocation.getAttribute('lat'),
        };
        const hospitalGridCodeContainer = document.getElementById('hospital-generate-grid-code-results-container');
        // show the user that we are processing the request
        hospitalGridCodeContainer.innerHTML = 'Processing request to Generate Grid code. Please wait... ';
        // return 0;
        axios.post(baseUrl + fn.routeToGenerateGridCode(), data, { headers: headers })
            .then(function (response) {
                const resBody = response.data;

                hospitalGridCodeContainer.innerHTML = ''; // Clear previous data
                if (resBody.code == '200' && resBody.message == 'Gridcode generated successful') {
                    console.log('resbody', resBody);

                    let hospitalGridCodeElem = document.createElement('div');
                    let hospitalLocationInfoElem = document.createElement('div');
                    // hospitalGridCodeElem.textContent = `Grid Code : ${resBody.data.gridcode}`;
                    // hospitalLocationInfoElem.textContent = `Address :  ${resBody.data.address}`
                    hospitalGridCodeElem.textContent = `Attempting to save new grid code...`;

                    hospitalGridCodeContainer.appendChild(hospitalGridCodeElem);
                    hospitalGridCodeContainer.appendChild(hospitalLocationInfoElem);

                    // Save gridcode data to Local Storage
                    let keyInStorage = `${data.long}_${data.lat}`;
                    console.log('OUR DATA', data, 'resBody', resBody);
                    // return 0;

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

                        generateAction: 'USE_EXISTING'
                    }

                    let jsonValueInStorage = JSON.stringify(valueInStorage);
                    localStorage.setItem(keyInStorage, jsonValueInStorage);
                    console.log('about to store in api', valueInStorage, 'retrievedFromStorage', JSON.parse(localStorage.getItem(keyInStorage)));

                    // generate the second grid code
                    // Nested Axios request
                    // axios.post(baseUrl + fn.routeToGenerateGridCode(), data, { headers: headers })
                    //     .then(function (nestedResponse) {
                    //         const nestedResBody = nestedResponse.data;
                    //         if (nestedResBody.code == '200' && nestedResBody.message == 'Gridcode generated successful') {
                    //             // Store the result of the nested request in localStorage
                    //             valueInStorage.gridcode2 = nestedResBody.data.gridcode;
                    //             localStorage.setItem(keyInStorage, JSON.stringify(valueInStorage));
                    //             console.log(
                    //                 'updated girdcodes for this location :' + resBody.data.address,
                    //                 JSON.parse(localStorage.getItem(keyInStorage))
                    //             );

                    //         }
                    //     })
                    //     .catch(function (nestedError) {
                    //         console.error('Error in nested Axios request:', nestedError);
                    //     });

                    // const headersNew = {
                    //     'api-key': fn.getApiToken(),
                    //     'Content-Type': 'application/json', // For JSON data
                    //     'Accept': '*/*',
                    // };
                    // console.log('we sent', 'valueInStorage', valueInStorage);

                    // Save gridcode data to Api
                    axios.post(baseUrl + fn.routeToSaveGridCode(), valueInStorage, { headers: headers })
                        .then(response => {
                            let resBody = response.data;
                            console.log('we found', resBody);
                        })
                        .catch(function (error) {
                            hospitalGridCodeContainer.innerHTML = error.response.data.message;
                            console.log('we saw an error', error.response.data.message)
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


function handleGridCodeGenerationForSelectedUniversity(selectedLocation) {
    if (selectedLocation) {
        // Make an API request using the selected location
        const baseUrl = 'https://gcorea.gridweb.net';

        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json',
            'api-key': fn.getApiToken(),
        };
        const data = {
            countryCode: 'NG',
            long: selectedLocation.getAttribute('long'),
            lat: selectedLocation.getAttribute('lat'),
        };
        const universityGridCodeContainer = document.getElementById('university-generate-grid-code-results-container');
        // show the user that we are processing the request
        universityGridCodeContainer.innerHTML = 'Processing request to Generate Grid code. Please wait... ';
        // return 0;
        axios.post(baseUrl + fn.routeToGenerateGridCode(), data, { headers: headers })
            .then(function (response) {
                const resBody = response.data;

                universityGridCodeContainer.innerHTML = ''; // Clear previous data
                if (resBody.code == '200' && resBody.message == 'Gridcode generated successful') {
                    console.log('resbody', resBody);

                    let universityGridCodeElem = document.createElement('div');
                    let universityLocationInfoElem = document.createElement('div');
                    universityGridCodeElem.textContent = `Attempting to save new grid code...`;

                    universityGridCodeContainer.appendChild(universityGridCodeElem);
                    universityGridCodeContainer.appendChild(universityLocationInfoElem);

                    // Save gridcode data to Local Storage
                    let keyInStorage = `${data.long}_${data.lat}`;
                    console.log('OUR DATA', data, 'resBody', resBody);
                    // return 0;

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

                        generateAction: 'USE_EXISTING'
                    }

                    let jsonValueInStorage = JSON.stringify(valueInStorage);
                    localStorage.setItem(keyInStorage, jsonValueInStorage);
                    console.log('about to store in api', valueInStorage, 'retrievedFromStorage', JSON.parse(localStorage.getItem(keyInStorage)));

                    // Save gridcode data to Api
                    axios.post(baseUrl + fn.routeToSaveGridCode(), valueInStorage, { headers: headers })
                        .then(response => {
                            if (resBody.code == 200) {
                                const resBody = response.data;
                                console.log('we saved a new gridcode successfully', resBody);
                                let newlySavedGridCode = resBody.data.gridCode;
                                universityGridCodeContainer.innerHTML =
                                    'New grid code saved successfully : ' + newlySavedGridCode;
                            }
                        })
                        .catch(function (error) {
                            universityGridCodeContainer.innerHTML = error.response.data.message;
                            console.log('we saw an error', error.response.data.message)
                            // console.error('Error fetching data:', error);
                            // console.log('url', baseUrl + fn.routeToSaveGridCode(), 'valueInStorage', valueInStorage)
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