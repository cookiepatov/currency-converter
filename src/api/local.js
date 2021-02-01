const url= 'https://api.ipgeolocation.io/ipgeo?apiKey=';
const key= 'a6afd17cd7384a7ab8a9d0a41abf8bae';

async function  getUserInfo() {
  let response = await fetch(url+key);
  if (response.ok) {
    let json = await response.json();
    return json;
  }
  else {
    alert("Ошибка HTTP: " + response.status);
  }
}

export default getUserInfo;
