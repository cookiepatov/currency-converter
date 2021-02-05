import getData from './api/converter.js';
import getUserInfo from './api/local.js';
import {getElement, getCurrenciesInfo, getCurrencyIndex, getNameById, getCurrencyRate, getIconById} from './utils/utils.js';


const templateItem = getElement('template-item','id').content;
const currenciesContainer = getElement('currencies__container');
let currentData;
const currentRates = getData();
let favourites = getLocalStorage();
let base = 'RUB';


function updateList(data, base, favs)
{
  if (favs)
  {
    const firstItems = data.filter(item=>{
      return ((getNameById(favs, item.id)||!item.id===base))
    })
    const secondItems = data.filter(item=>{
      return ((!getNameById(favs, item.id)&&item.id!==base))
    })
    const newData=firstItems.concat(secondItems);
    return newData
  }
  else {
    return data.filter(item=>item.id!==base);
  }
}

function clearCurrencies()
{
  getElement('item','classAll',currenciesContainer).forEach(item=>item.remove());
}

function updateBase(id=base)
{
  clearCurrencies();
  getCurrenciesInfo('src/data/currencies.json').then(function(data) {
    base = id;
    currentData = updateList(data, base, favourites);
    const baseEl = getElement('base','id');
    const icon = getElement('item__icon','class', baseEl);
    const name = getElement('item__name','class', baseEl);
    const description = getElement('item__description','class',baseEl);
    icon.src = '/images/country-icons/'+getIconById(data,id);
    icon.alt = getNameById(data,id);
    name.textContent = id;
    description.textContent = getNameById(data,id);
    currentData.forEach(element => {
      addCurrency(element);
    });
  });
}

function init()
{
  getUserInfo().then(userCurrency=>{
    updateBase(userCurrency['currency']['code']);
  });


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


function toggleFavouriteItem(id) {
  const currencyList = getElement('currencies__container');
  const item = getElement(id, 'id', currencyList);
  if(item.classList.contains('item__favourite_status_inactive'))
  {
    addToFavourites(id);
    item.classList.toggle('item__favourite_status_inactive');
    item.classList.toggle('item__favourite_status_active');
  }
  else
  {
    item.classList.toggle('item__favourite_status_inactive');
    item.classList.toggle('item__favourite_status_active');
    favourites.splice(getCurrencyIndex(favourites,id),1);
    updateLocalStorage();
  }
  updateBase();
}

function addToFavourites(id) {
  if(!favourites)
  {
    favourites = [];
  }
  favourites.push(currentData[getCurrencyIndex(currentData, id)]);
  updateLocalStorage();
}


function updateLocalStorage()
{
  localStorage.setItem('favouritesData',JSON.stringify(favourites));
}

function addCurrency(element) {
  const newElement = templateItem.cloneNode(true);
  const icon = getElement('item__icon', 'class', newElement);
  const name = getElement('item__name', 'class', newElement);
  const description = getElement('item__description', 'class', newElement);
  const rate = getElement('item__rate','class',newElement);
  const favStatus = getElement('item__favourite','class',newElement);
  const baseBtn = getElement('item__base', 'class', newElement);
  icon.src='/images/country-icons/'+element.icon;
  icon.alt=element.name;
  name.textContent=element.id;
  description.textContent=element.name;
  favStatus.id=element.id;
  favStatus.addEventListener('click',function(){
    toggleFavouriteItem(element.id);
  })
  currentRates.then(rates=>{
    const rateData=getCurrencyRate(rates['rates'][element.id],rates['rates'][base]).toFixed(2);
    rate.textContent=`1.00 ${base} = ${rateData} ${element.id}`;
  });
  if(favourites&&(getCurrencyIndex(favourites,element.id)!==false))
  {
    favStatus.classList.add('item__favourite_status_active');
  }
  else
  {
    favStatus.classList.add('item__favourite_status_inactive');
  }
  baseBtn.addEventListener('click',function(){
    updateBase(element.id);
  })
  currenciesContainer.append(newElement);
}

init()
