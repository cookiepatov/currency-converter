const url= 'https://openexchangerates.org/api/latest.json?app_id=bf9884004ffe46c193a7d1ace0a038fa';

async function  getData() {
  let response = await fetch(url);
  if (response.ok) {
    let json = await response.json();
    console.log(json);
  }
  else {
    alert("Ошибка HTTP: " + response.status);
  }
}

export default getData;
