import { debounce } from 'lodash';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import './css/styles.css';
import fetchCounties from "./fetchCountries";
import countryInfoMarkup from './countryInfoBuilder.hbs'
import countryListMarkup from "./countryListBuilder.hbs";


const inputEl = document.querySelector('#search-box')
const countryListEl = document.querySelector('.country-list')
const countryContainerEl = document.querySelector('.country-info')

const DEBOUNCE_DELAY = 300;

inputEl.addEventListener('input', debounce(searchCountry, DEBOUNCE_DELAY))
countryListEl.addEventListener('click', selectCountry)


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
    countryContainerEl.insertAdjacentHTML('afterbegin', countryInfoMarkup(data))
}

function countryListBuilder(data) {
    countryListEl.insertAdjacentHTML('afterbegin', countryListMarkup(data))
}

function clearElements() {
    countryListEl.innerHTML = ""
    countryContainerEl.innerHTML = ""
}

function selectCountry(evt) {
    evt.preventDefault();

    if (evt.target.nodeName !== 'A' && evt.target.nodeName !== 'P') {
        return
    }
    if (evt.target.nodeName === 'A') {
        clearElements()
        inputEl.value = evt.target.dataset.name
        fetchCounties(evt.target.dataset.name.trim()).then(data => countryContainerBuilder(data))
        return
    }
    if (evt.target.nodeName === 'P') {
        clearElements()
        inputEl.value = evt.target.parentElement.dataset.name
        fetchCounties(evt.target.parentElement.dataset.name.trim()).then(data => countryContainerBuilder(data))
        return
    }
}
