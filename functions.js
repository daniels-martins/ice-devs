import { axios } from './app.js'; // Assuming app.js is in the same directory
import { categories } from "./dictionary.js";

export function name(params) {
    function createInputWithButton() {
        const container = document.getElementById('container');
      
        // Create the input element
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Enter text...';
        input.classList.add(
          'border',      // Add a border
          'border-gray-300', // Set border color
          'p-2',         // Add padding
          'rounded-md',   // Round the corners
          'focus:outline-none', // Remove default focus outline
          'focus:ring-2', // Add a ring on focus
          'focus:ring-blue-300' // Set ring color
        );
      
      
        // Create the button element
        const button = document.createElement('button');
        button.textContent = 'Save grid code';
        button.classList.add(
          'bg-blue-500', // Set background color
          'hover:bg-blue-700', // Darken on hover
          'text-white',     // Set text color
          'font-bold',     // Make text bold
          'py-2',         // Add vertical padding
          'px-4',         // Add horizontal padding
          'rounded-md',   // Round the corners
          'ml-2'          // Add margin to the left
        );
      
        // Append the elements to the container
        container.appendChild(input);
        container.appendChild(button);
      }
      
    //   createInputWithButton();
}

export function deleteUnmatchedKeysInLocalStorage(keysToKeep) {
    // Convert the array of keys to a Set for faster lookups.
    const keepSet = new Set(keysToKeep);

    // Get all keys currently in localStorage.
    const allKeys = Object.keys(localStorage);

    // Iterate through all keys and remove those not in the keep set.
    for (const key of allKeys) {
        if (!keepSet.has(key)) {
            localStorage.removeItem(key);
        }
    }
}

export function validateGridCodeFromApi(gridcode, countryCode = 'NG') {
    let validationResultElement = document.getElementById('validationResult');

    // Make an API request using the selected location (gridcode)
    const baseUrl = 'https://gcorea.gridweb.net';

    axios.get(baseUrl + routeToVerifyGridCode(gridcode, countryCode), {
        headers: {
            'api-key': getApiToken()
        }
    })
        .then(function (response) {
            let resBody = response.data;
            if (resBody.code == 200 && resBody.message == 'Verified') {
                console.log('hello', response.data);
                let verifiedGridCode = resBody.data.gridCode;
                let verifiedcountryCode = resBody.data.countryCode;
                let verifiedValidity = resBody.data.isValid;

                // get a container to display the formatted validation message
                validationResultElement.innerHTML =
                    `Success: ${verifiedGridCode} for ${verifiedcountryCode} is valid 👍`;
            }
        })
        .catch(function (error) {
            alert('an error occured')
            console.error('Error fetching data:', error);
        });
}

export function getLatLongDeviation(latitude) {
    // Convert the latitude string to a number.  This handles potential leading/trailing whitespace.
    let latNum = parseFloat(latitude);

    // Check if the latitude is a valid number.
    if (isNaN(latNum)) {
        return "Invalid latitude format. Please provide a numeric string.";
    }

    // Convert the latitude to a string, split it into integer and decimal parts.
    const latString = latNum.toString();
    const parts = latString.split('.');

    // If there's a decimal part, increment the last two digits.
    if (parts.length === 2) {
        let decimalPart = parts[1];
        let lastTwoDigits = parseInt(decimalPart.slice(-2));
        let incrementedDigits = lastTwoDigits + 1;

        // Handle cases where incrementing goes over 99.  This pads with zeros as needed.
        let newDecimalPart = decimalPart.slice(0, -2) + String(incrementedDigits).padStart(2, '0');

        // If the increment caused the decimal part to grow (e.g., 98 + 2 = 100),
        // we need to handle the carry-over to the integer part.
        if (newDecimalPart.length > decimalPart.length) {
            let carry = parseInt(newDecimalPart.slice(0, newDecimalPart.length - decimalPart.length));
            newDecimalPart = newDecimalPart.slice(-decimalPart.length);
            parts[0] = (parseInt(parts[0]) + carry).toString();
        }

        return parseFloat(parts[0] + "." + newDecimalPart);
    } else {
        // If there's no decimal part, treat it as .00 and increment.
        return latNum + 0.02;
    }
}




//   // Test cases
//   console.log(getLatA("-2.900283928392")); // Output: -2.900283928394
//   console.log(getLatA("-2.900283928399")); // Output: -2.900283928401
//   console.log(getLatA("-2"));             // Output: -1.98
//   console.log(getLatA("2.98"));            // Output: 3
//   console.log(getLatA("invalid"));       // Output: Invalid latitude format. Please provide a numeric string.


/**
 * handle hospitals dropdown 
 * 
 *  Iterate over the array of hospitals and create options (ie. hospitals list)
 * @param mixed hospital
 * 
 * @return [type]
 */
export function populateHospitals(hospital, hospitalSelectElement) {
    const option = document.createElement('option');
    option.value = hospital["ADDRESS"]; // Use LOCATION for API request
    option.setAttribute('long', hospital['LONGITUDE'])
    option.setAttribute('lat', hospital['LATITUDE'])
    option.textContent = hospital["NAME"];
    hospitalSelectElement.appendChild(option);
}


export function populateCountries(country, countrySelectElement) {
    const option = document.createElement('option');
    option.value = country["countryCode"]; // eg 'NG' or 'RW'
    option.textContent = country["country"]; //country name
    countrySelectElement.appendChild(option);
}

export function getCountryCode(country, data) {
    const foundCountry = data.find(item => item.country === country);
    return foundCountry ? foundCountry.countryCode : null; // Return null if not found
}
/**
  * handle universities dropdown 
  * 
  *  Iterate over the array of universities and create options (ie. universities list)
  * @param mixed hospital
  * 
  * @return [type]
  */
export function populateUniversities(university, universitySelectElement) {
    const option = document.createElement('option');
    option.value = university["ADDRESS"]; // Use LOCATION for API request
    option.textContent = university["NAME"];
    universitySelectElement.appendChild(option);
}

export function searchLocalStorage(value) {
    const results = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const storedValue = localStorage.getItem(key);
        if (storedValue.includes(value)) {
            results.push({ key, value: storedValue });
        }
    }
    return results;
}


export function getGridCodeCategory(searchTerm = null) {

    let foundCategory = null;

    if (searchTerm) {
        foundCategory = categories.find(item => item.description.toLowerCase() === searchTerm.toLowerCase());
    }

    return foundCategory.categoryId ?? null; //null coalescing
}








// Routes 
export function routeToSaveGridCode() {
    return '/gridcode/api/store';
}
export function routeToVerifyGridCode(gridCode = 'aaaa-ahgumc', countryCode = 'in') {
    return `/external/api/verify-gridcode?gridCode=${gridCode}&countryCode=${countryCode}`;
}

export function routeToSearchGridCode() {
    return '/external/api/search-gridcodes';
}

export function routeToGenerateGridCodeDistance(params) {
    return '/external/api/calculate-distance';
}
export function routeToGenerateGridCode() {
    return '/gridcode/api/generate'
}

export function getApiToken() {
    return 'wGu10X79gpSqqNaiAvXGchz7v06wquEGhKiUO9igixbEgstMEBb0TDJYHekDLpFriRjKORWTfhOqlDLH2OOtNQMHVbpQuQur0wrVqHupjFi7VhpvBs3a1zBAtod8tisg4ILwyE93hZMfBy1liBYEF6USoipVLLtoZWxnFYM28HV7ou7lgDUWfCEI39zUsWHMkRjpCNLL';
}