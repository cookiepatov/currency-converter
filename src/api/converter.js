const url= 'https://openexchangerates.org/api/latest.json?app_id=';
const key = 'bf9884004ffe46c193a7d1ace0a038fa'
async function  getData() {
  let response = await fetch(url+key);
  if (response.ok) {
    let json = await response.json();
    return json;
  }
  else {
    alert("Ошибка HTTP: " + response.status);
  }
}

export default getData;
