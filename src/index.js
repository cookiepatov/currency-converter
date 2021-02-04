import getData from './api/converter.js';
import getUserInfo from './api/local.js'
import {getElement, getCurrenciesInfo, getCurrencyIndex, setFavourites, getNameById, getCurrencyRate, getIconById} from './utils/utils.js';


const btnFrom = getElement('currency-from-selector','id');
const btnTo = getElement('currency-to-selector','id');
const currencySelector = getElement('currency-selector');
const currencyListAll = getElement('currency-selector__currency-list_type_all');
const currencyListFavs = getElement('currency-selector__currency-list_type_favourites');
const inputFrom = getElement('currency-from-amount','id');
const inputTo = getElement('currency-to-amount','id');
let currentData;
const currentRates = getData();
let favourites = [];
let currencyFrom = 'EUR';
let currencyTo = (currencyFrom==='USD') ? 'EUR': 'USD'
let currentexchangeRate = 1;

function updateCurrentRate()
{
   currentRates.then(rates=>{
    currentexchangeRate = getCurrencyRate(rates['rates'][currencyFrom],rates['rates'][currencyTo]);
    updateResult();
  });
}

function updateResult(e)
{
  if(e)
  {

    switch (e.target.id) {
      case 'currency-from-amount' :
        inputTo.value = (inputFrom.value / currentexchangeRate).toFixed(2);
        break;
      case 'currency-to-amount' :
        inputFrom.value = (inputTo.value * currentexchangeRate).toFixed(2);
        break;
    }
  }
  else{
    inputTo.value = (inputFrom.value / currentexchangeRate).toFixed(2);
  }
}
function init()
{
  inputFrom.value='0.00'
  getUserInfo().then(userCurrency=>{
    currencyFrom = userCurrency['currency']['code'];
    btnFrom.innerHTML=` <img src="../images/country-icons/${getIconById(currentData, currencyFrom)}" class="converter__button-img" alt="Иконка валюты">
    ${currencyFrom}`;
    btnTo.innerHTML=` <img src="../images/country-icons/${getIconById(currentData, currencyTo)}" class="converter__button-img" alt="Иконка валюты">
    ${currencyTo}`;
  })
  updateCurrentRate();
  getUserInfo();
  if(getLocalStorage())
  {
    favourites = getLocalStorage();
    favourites.forEach(element => {
      addFavourite(element);
    })
  }
  getCurrenciesInfo('src/data/currencies.json').then(function(data){
    currentData = data;
    setFavourites(currentData, favourites);
    data.forEach(element => {
      addCurrency(element);
      currencyListAll.addEventListener('click', currencyHandler);
      currencyListFavs.addEventListener('click', currencyHandler);
    });
  })
  btnFrom.addEventListener('click',togglePopup);
  btnTo.addEventListener('click',togglePopup);
  inputFrom.addEventListener('input',updateResult);
  inputTo.addEventListener('input',updateResult);

}

function getLocalStorage()
{
  if(localStorage.hasOwnProperty('favouritesData'))
  {
    const localData = JSON.parse(localStorage.favouritesData)
    return localData
  }
  return false
}

function togglePopup(e) {
  if(currencySelector.classList.contains('currency-selector_hidden'))
  {
    setInputMode(e.target.id);
    currencySelector.classList.toggle('currency-selector_hidden');
  }
  else{
    setInputMode()
    currencySelector.classList.toggle('currency-selector_hidden');
  }
}

function setInputMode(mode='reset') {
  switch (mode) {
    case 'currency-from-selector':
      btnTo.setAttribute("disabled", "true");
      getElement('currency-to-amount','id').setAttribute("disabled", "true");
      getElement('currency-from-amount','id').setAttribute("disabled", "true");
      break;
    case 'currency-to-selector':
      btnFrom.setAttribute("disabled", "true");
      getElement('currency-to-amount','id').setAttribute("disabled", "true");
      getElement('currency-from-amount','id').setAttribute("disabled", "true");
      break;
    case 'reset':
      btnTo.removeAttribute("disabled");
      btnFrom.removeAttribute("disabled");
      getElement('currency-from-amount','id').removeAttribute("disabled");
      getElement('currency-to-amount','id').removeAttribute("disabled");
  }
}

function toggleFavouriteItem(item) {

  const id = item.attributes.data.value;
  const title = getNameById(currentData, id);
  const icon = getIconById(currentData, id);
  if(item.classList.contains('currency-selector__favourite_status_inactive'))
  {
    addToFavourites(id, title, icon);
    item.classList.toggle('currency-selector__favourite_status_inactive');
    item.classList.toggle('currency-selector__favourite_status_active');
  }
  else
  {
    const itemFavourite = getElement(id, 'id', currencyListFavs);
    const itemCommon = getElement(id, 'id', currencyListAll);
    const favButton = getElement('currency-selector__favourite','class', itemCommon);
    favButton.classList.toggle('currency-selector__favourite_status_inactive');
    favButton.classList.toggle('currency-selector__favourite_status_active');
    itemFavourite.remove();
    favourites.splice(getCurrencyIndex(favourites,id),1);
    updateLocalStorage();
  }
}

function addToFavourites(id, title, icon) {
  const html = `
  <li class="currency-selector__item" id="${id}">
    <div class="currency-selector__item-handlers">
      <button type="button" data="${id}" title="${title}" class="currency-selector__button">
        <img class="currency-selector__icon" data="${id}" alt="${title}" src="../images/country-icons/${icon}">
        ${id}
      </button>
      <button type="button" data="${id}" class="currency-selector__favourite currency-selector__favourite_status_gold"></button>
    </div>
    <label class="currency-selector__item-name">${title}</label>
  </li>
  `
  currencyListFavs.insertAdjacentHTML('beforeend',html);
  favourites.push(currentData[getCurrencyIndex(currentData, id)]);
  updateLocalStorage();
}

function setCurrency(currency) {
  if(btnTo.attributes.disabled)
  {
    btnFrom.innerHTML=` <img src="../images/country-icons/${getIconById(currentData, currency)}" class="converter__button-img" alt="Иконка валюты">
    ${currency}`;
    currencyFrom = currency;
  }
  else
  {

    btnTo.innerHTML=` <img src="../images/country-icons/${getIconById(currentData, currency)}" class="converter__button-img" alt="Иконка валюты">
    ${currency}`;
    currencyTo = currency;
  }
  updateCurrentRate();
  togglePopup();
}

function updateLocalStorage()
{
  localStorage.setItem('favouritesData',JSON.stringify(favourites));
}

function addCurrency(element) {
  const favourite = element.favourite ? 'active' : 'inactive';
  const html = `
  <li class="currency-selector__item" id="${element.id}">
    <div class="currency-selector__item-handlers">
      <button type="button" data="${element.id}" title="${element.name}" class="currency-selector__button">
        <img class="currency-selector__icon" data="${element.id}" alt="${element.name}" src="../images/country-icons/${element.icon}">
        ${element.id}
      </button>
      <button type="button" data="${element.id}" class="currency-selector__favourite currency-selector__favourite_status_${favourite}"></button>
    </div>
    <label class="currency-selector__item-name">${element.name}</label>
  </li>
  `
  currencyListAll.insertAdjacentHTML('beforeend',html);
}

function addFavourite(element) {
  const html = `
  <li class="currency-selector__item" id="${element.id}">
    <div class="currency-selector__item-handlers">
      <button type="button" data="${element.id}" title="${element.name}" class="currency-selector__button">
        <img class="currency-selector__icon" data="${element.id}" alt="${element.name}" src="../images/country-icons/${element.icon}">
        ${element.id}
      </button>
      <button type="button" data="${element.id}" class="currency-selector__favourite currency-selector__favourite_status_gold"></button>
    </div>
    <label class="currency-selector__item-name">${element.name}</label>
  </li>
  `
  currencyListFavs.insertAdjacentHTML('beforeend',html);
}

function currencyHandler(e) {
  if(e.target.classList.contains('currency-selector__favourite'))
  {
    toggleFavouriteItem(e.target);
  }
  if(e.target.classList.contains('currency-selector__button')||e.target.classList.contains('currency-selector__icon'))
  {
    setCurrency(e.target.attributes.data.value);
  }
}

init()
