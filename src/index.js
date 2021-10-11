import { debounce } from 'lodash';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import './css/styles.css';
import fetchCounties from "./fetchCountries";


const inputEl = document.querySelector('#search-box')
const countryListEl = document.querySelector('.country-list')
const countryContainerEl = document.querySelector('.country-info')

const DEBOUNCE_DELAY = 300;

inputEl.addEventListener('input', debounce(searchCountry, DEBOUNCE_DELAY))


function searchCountry(evt) {
    clearElements()
    if (evt.target.value.trim() === "") {
        return
    }
    fetchCounties(evt.target.value.trim())
        .then(data => {
            if (data.length > 10) {
                return Notify.info("Too many matches found. Please enter a more specific name.")
            }
            if (data.length === 1) {
                countryContainerBuilder(data)
                return
            }
            if (data.length > 1 || data.length <= 10) {
                countryListBuilder(data)
                return
            }
        })
        .catch(error => {
            Notify.failure("Oops, there is no country with that name")
            clearElements()
            console.log(error);
        })
}

function countryContainerBuilder(data) {
    const countryBuild = data.map(country => `<h2><img src="${country.flags.svg}" alt="flag ${country.name.official}">
${country.name.official}</h2>
<ul>
  <li>
  <p>Capital:</p>
  <span>${country.capital}</span>
  </li>
  <li>
    <p>Population:</p>
    <span>${country.population}</span>
  </li>
  <li>
    <p>Languages:</p>
    <span>${Object.values(country.languages)}</span>
  </li>
</ul>`).join('')
                countryContainerEl.insertAdjacentHTML('afterbegin', countryBuild)
}

function countryListBuilder(data) {
    const countryList = data.map(country =>
        `<li><img src="${country.flags.svg}" alt="flag ${country.name.official}"><p>${country.name.official}</p></li>`)
        .join('')
    countryListEl.insertAdjacentHTML('afterbegin', countryList)
}

function clearElements() {
    countryListEl.innerHTML = ""
    countryContainerEl.innerHTML = ""
}
