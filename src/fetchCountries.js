export default function fetchCounties(countryName) {
    const BASE_URL = 'https://restcountries.com/v3.1/name'
    
    return fetch(`${BASE_URL}/${countryName}?fields=name,capital,languages,flags,population`)
        .then(response => {
            if (!response.ok) {
               throw new Error(response.status);
             }
            return response.json();
        })
}