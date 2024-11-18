import * as fn from './functions.js';

/**
 * WHERE searchFor is a gridcode
 * @return [type]
 */
export function handleClickEventOnSearchButton() {
    const searchFor = document.getElementById('searchInput').value;
    let associatedResult = null;
    alert('button');
    // return 0;

    const headers = {
        'api-key': fn.getApiToken()
    };

    // search for the item in the API
  
    // searching for an item in the localStorage : extract to helpers

    for (let i = 0; i < localStorage.length; i++) {
        alert('fiji')

        let key = localStorage.key(i);
        let valueAsJson = localStorage.getItem(key);
        let valueInStorage = (valueAsJson);

        if (valueInStorage.gridcode !== searchFor) {
            continue;
        }else{
            alert('fiji')
            alert(searchFor)
        }
        associatedResult = valueInStorage;
        console.log('somalia', key + " = " + valueAsJson);
        console.log('assocRes', associatedResult);
    }
    alert('fufu')


    const resultDiv = document.getElementById('searchResult');
    resultDiv.innerHTML = ''; // Clear previous results
//     resultDiv.innerHTML += `<p>
//     Result: <br> 
//     GridCode :   ${associatedResult.gridcode} <br>
//     Address : ${associatedResult.address}
// </p>`;
}