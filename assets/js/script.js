let searchCityForm = document.querySelector('#search-city');
let searchCityInput = document.querySelector('#search-input');
let noDataMessage = document.querySelector('#no-data-message');
let currentWeatherBox = document.querySelector('#current-weather-box');
let forecastSection = document.querySelector('#forecast-section');
let weatherBody = document.querySelector('#weather-body');
let fiveDay = document.querySelector('#five-day');

let apiKey = '425d9b6035ae956db1531e2fea0981f6';
let apiUrl = 'https://api.openweathermap.org/data/2.5/';

let showCitySearch = function () {
	console.log('showCitySearch fn');
};

let fetchAndDisplayUVi = function (cityLatLon) {
	console.log('fetchAndDisplayUvi fn Lat/Lon: ' + cityLatLon);

	let searchLatLon = 'lat=' + cityLatLon.lat + '&lon=' + cityLatLon.lon;
	let uviUrl = apiUrl + 'onecall?' + searchLatLon + '&appid=' + apiKey;

	// send search city name to api to fetch current uvi data
	// if success parse and display uvi data
	// else perform error handling
	fetch(uviUrl).then(function (response) {
		if (response.ok) {
			response.json().then(function (fetchedUvi) {
				console.log();
				console.log('fetchedUvi: ');
				console.log(fetchedUvi);

				// create <div> to hold UV info
				let uviData = document.createElement('div');
				uviData.textContent = 'UV Index: ' + (fetchedUvi.current.uvi);
				weatherBody.appendChild(uviData);
			});
		}
		else {
			console.log('Fetch UVI error');
		};
	});
};

let displayCurrentWeather = function (fetchedData) {
	console.log('displayCurrentWeather fn');

	// create <h1> tag to display city name, date, and weather icon
	let currentWeatherHeader = document.createElement('h1');

	// extra today's date
	let currentTime = moment();
	let today = '(' + currentTime.format('MM/DD/YYYY') + ')';
	console.log('today: ' + today);
	console.log('fetchedData.name' + fetchedData.name);

	// assign <h1> textContent to city name and today's date
	currentWeatherHeader.textContent = fetchedData.name + ' ' + today;

	// create <img> element and get weather icon
	let weatherIcon = document.createElement('img');
	weatherIcon.setAttribute('src', 'https://openweathermap.org/img/w/' + fetchedData.weather[0].icon + '.png');
	weatherIcon.setAttribute('alt', fetchedData.weather[0].main + ' - ' + fetchedData.weather[0].description);
	console.log('ICON');
	console.log('src', 'https://openweathermap.org/img/w/' + fetchedData.weather[0].icon + '.png');
	console.log('alt', fetchedData.weather[0].main + ' - ' + fetchedData.weather[0].description);

	// create <div> element to display temperature
	let currentTemp = document.createElement('div');
	currentTemp.textContent = 'Temperature: ' + (fetchedData.main.temp) + ' °F';
	console.log('Temperature: ' + (fetchedData.main.temp) + ' °F');

	// create <div> element to display humidity
	let currentHumidity = document.createElement('div');
	currentHumidity.textContent = 'Humidity: ' + (fetchedData.main.humidity) + '%';
	console.log('Humidity: ' + (fetchedData.main.humidity) + '%');

	// create <div> element to display wind speed
	let currentWindSpeed = document.createElement('div');
	currentWindSpeed.textContent = 'Wind Speed: ' + (fetchedData.wind.speed) + 'MPH';
	console.log('Wind Speed: ' + (fetchedData.wind.speed) + 'MPH');

	// append icon to header
	currentWeatherHeader.appendChild(weatherIcon);

	// append all created elements to weather body
	weatherBody.appendChild(currentWeatherHeader);
	weatherBody.appendChild(currentTemp);
	weatherBody.appendChild(currentHumidity);
	weatherBody.appendChild(currentWindSpeed);

	currentWeatherBox.appendChild(weatherBody);

	// current weather body hidden on page load, removes 'hide' attribute now we have data to display
	currentWeatherBox.removeAttribute('class', 'hide');

	// display currently fetched UV data
	let cityLatLon = fetchedData.coord;
	fetchAndDisplayUVi(cityLatLon);
};

let fetchCurrentWeather = function (searchCity) {
	console.log('searchCurrentWeather fn: ' + searchCity);

	let currentWeatherUrl = apiUrl + 'weather?q=' + searchCity + '&units=imperial&APPID=' + apiKey;
	console.log(currentWeatherUrl);

	fetch(currentWeatherUrl).then(function (response) {
		if (response.ok) {
			response.json().then(function (fetchedData) {
				console.log('');
				console.log('fetched Data: ');
				console.log(fetchedData);

				// display currently fetched weather
				displayCurrentWeather(fetchedData);
			});
		}
		else {
			console.log('Fetch weather data Error');
		};
	});
};

let weatherSearchHandler = function (searchCity) {
	console.log('weatherSearchHandler fn: ' + searchCity);

	// hide no data message
	noDataMessage.classList.add('hide');

	// hide current weather box until time to display
	currentWeatherBox.classList.add('hide');

	// hide forecast section from until time to display
	forecastSection.classList.add('hide');

	// clear data from current weather body area
	weatherBody.textContent = '';

	// clear data from five day forecast section
	fiveDay.textContent = '';

	// call search function for fetch data
	fetchCurrentWeather(searchCity);
};

let addCityToSearch = function (searchCity) {
	console.log('addCityToSearch fn: ' + searchCity);
};

let searchFormHandler = function (event) {
	// stops browser from sending the form's input data to URL
	event.preventDefault();

	let searchCity = searchCityInput.value.trim();

	// if search city is empty
	if (!searchCity) {
		return false;
	}

	console.log('searchCity: ' + searchCity);

	// if input, fetch weather data
	weatherSearchHandler(searchCity);

	// clear input field, then fetch weather data
	searchCityInput.value = '';

	// add last searched city to history search array
	addCityToSearch(searchCity);
};

// call function. display weather data for last searched city
showCitySearch();

// event listener for click on search button
searchCityForm.addEventListener('click', searchFormHandler);