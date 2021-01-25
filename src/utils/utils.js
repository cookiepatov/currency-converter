function getElement(objectName, type='class', from=document){
  switch(type) {
    case 'class':
      return from.querySelector('.'+objectName);
    case 'classAll':
      return from.querySelectorAll('.'+objectName);
    case 'id':
      return from.querySelector('#'+objectName);
  }
}

function getNameById(array, id)
{
  let result =-1;
  array.forEach(element => {
    if (element['id'] === id)
    {
      result = element['name'];
    }
  });
  return result;
}

function getCurrencyIndex(array, id)
{
  for(let i=0; i<array.length; i++)
  {
    if (array[i]['id'] === id)
    {
      return i;
    }
  }
  return -1;
}


function setFavourites(fullArray, favArray)
{
  for(let i=0; i<favArray.length; i++)
  {
    fullArray[getCurrencyIndex(fullArray, favArray[i]['id'])]['favourite'] = '1';
  }
}


async function getCurrenciesInfo(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Ошибка загрузки магазинов. Адрес ${url} не отвечает. Статус: ${response.status}`)
  }
  return await response.json();

}

export {getElement, getCurrenciesInfo, getCurrencyIndex, setFavourites, getNameById};
