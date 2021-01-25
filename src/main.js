import getData from './api/converter.js';
import {getElement, getCurrenciesInfo, getCurrencyIndex, setFavourites, getNameById} from './utils/utils.js';


const btnFrom = getElement('currency-from-selector','id');
const btnTo = getElement('currency-to-selector','id');
const currencySelector = getElement('currency-selector');
const currencyListAll = getElement('currency-selector__currency-list_type_all');
const currencyListFavs = getElement('currency-selector__currency-list_type_favourites');
let currentData;
let favourites = [];
let currencyFrom = geoplugin_currencyCode();
let currencyTo = (currencyFrom==='USD') ? 'EUR': 'USD'


function init()
{
  btnFrom.textContent=currencyFrom;
  btnTo.textContent=currencyTo;
  console.log();
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
      break;
    case 'currency-to-selector':
      btnFrom.setAttribute("disabled", "true");
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
  if(item.classList.contains('currency-selector__favourite_status_inactive'))
  {
    addToFavourites(id, title);
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

function addToFavourites(id, title) {
  const html = `
  <li class="currency-selector__item" id="${id}">
    <button type="button" data="${id}" title="${title}" class="currency-selector__button">${id}</button>
    <button type="button" data="${id}" class="currency-selector__favourite currency-selector__favourite_status_gold"></button>
  </li>
  `
  currencyListFavs.insertAdjacentHTML('beforeend',html);
  favourites.push(currentData[getCurrencyIndex(currentData, id)]);
  updateLocalStorage();
}

function setCurrency(currency) {
  if(btnTo.attributes.disabled)
  {
    btnFrom.textContent = currency;
    currencyFrom = currency;
  }
  else
  {
    btnTo.textContent = currency;
    currencyTo = currency;
  }
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
    <button type="button"  data="${element.id}" title="${element.name}" class="currency-selector__button">${element.id}</button>
    <button type="button" data="${element.id}" class="currency-selector__favourite currency-selector__favourite_status_${favourite}"></button>
  </li>
  `
  currencyListAll.insertAdjacentHTML('beforeend',html);
}

function addFavourite(element) {
  const html = `
  <li class="currency-selector__item" id="${element.id}">
    <button type="button" data="${element.id}" title="${element.name}" class="currency-selector__button">${element.id}</button>
    <button type="button" data="${element.id}" class="currency-selector__favourite currency-selector__favourite_status_gold"></button>
  </li>
  `
  currencyListFavs.insertAdjacentHTML('beforeend',html);
}

function currencyHandler(e) {
  if(e.target.classList.contains('currency-selector__favourite'))
  {
    toggleFavouriteItem(e.target);
  }
  if(e.target.classList.contains('currency-selector__button'))
  {
    setCurrency(e.target.attributes.data.value);
  }
}

init()
