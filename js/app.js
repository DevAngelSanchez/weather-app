const container = document.querySelector(".container");
const resultContainer = document.querySelector("#resultado");
const form = document.querySelector("#formulario");

window.addEventListener("load", (e) => {
  form.addEventListener('submit', searchWeather);
});


function searchWeather(e) {
  e.preventDefault();

  // Validate input fields

  const city = document.querySelector("#ciudad").value;
  const country = document.querySelector('#pais').value;

  if (city === '' || country === '') {
    showError('Both fields are required');

    return;
  }

  // Api query
  consultApi(city, country);
}

function showError(msg) {

  const alert = document.querySelector('.bg-red-100');

  if (!alert) {
    const alert = document.createElement('div');
    alert.classList.add('bg-red-100', 'border-red-400', 'text-red-700', 'px-4', 'py-3', 'rounded', 'max-w-md', 'mx-auto', 'mt-6', 'text-center');

    alert.innerHTML = `
      <strong class='font-bold'>Error!</strong>
      <span class="block">${msg}</span>
    `;

    container.appendChild(alert);

    setTimeout(() => {
      alert.remove();
    }, 3000);
  }
}

function consultApi(city, country) {
  const APP_ID = 'd18cf04452fe41d2cb28bd3adb1860ab';

  const URL_API = `https://api.openweathermap.org/data/2.5/weather?q=${city}, ${country}&appid=${APP_ID}`

  spinner();

  fetch(URL_API)
    .then(response => response.json())
    .then(data => {
      clearHTML() // limpia el html anterior

      if (data.cod === '404') {
        showError('city not found');

        return;
      }

      showWeather(data);
    });
}

function showWeather(data) {
  const { name, main: { temp, temp_max, temp_min } } = data;

  const celcius = kelvinToCelcius(temp);
  const max = kelvinToCelcius(temp_max);
  const min = kelvinToCelcius(temp_min);

  const cityNameElement = document.createElement('p');
  cityNameElement.innerHTML = `Weather in ${name}`;
  cityNameElement.classList.add('font-bold', 'text-2xl');

  const currentTempElement = document.createElement('p');
  currentTempElement.innerHTML = `${celcius} &#8451;`;
  currentTempElement.classList.add('font-bold', 'text-6xl');

  const maxTemp = document.createElement('p');
  maxTemp.innerHTML = `Max temp: ${max} &#8451;`;
  maxTemp.classList.add('font-bold', 'text-xl');

  const minTemp = document.createElement('p');
  minTemp.innerHTML = `Min temp: ${min} &#8451;`;
  minTemp.classList.add('font-bold', 'text-xl');

  const resultContent = document.createElement('div');
  resultContainer.classList.add('text-center', 'text-white');
  resultContainer.appendChild(cityNameElement);
  resultContainer.appendChild(currentTempElement);
  resultContainer.appendChild(maxTemp);
  resultContainer.appendChild(minTemp);

  resultContainer.appendChild(resultContent);

}

const kelvinToCelcius = grades => parseInt(grades - 273.15);

function clearHTML() {
  while (resultContainer.firstChild) {
    resultContainer.removeChild(resultContainer.firstChild);
  }
}

function spinner() {
  clearHTML();

  const spinnerElement = document.createElement('div');
  spinnerElement.classList.add('sk-folding-cube');

  spinnerElement.innerHTML = `
    <div class="sk-cube1 sk-cube"></div>
    <div class="sk-cube2 sk-cube"></div>
    <div class="sk-cube4 sk-cube"></div>
    <div class="sk-cube3 sk-cube"></div>
  `;

  resultContainer.appendChild(spinnerElement);
}