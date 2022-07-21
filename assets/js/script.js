let searchCityForm = document.querySelector('#search-city');
let searchCityInput = document.querySelector('#search-input');
let noDataMessage = document.querySelector('#no-data-message');
let currentWeatherBox = document.querySelector('#current-weather-box');
let forecastSection = document.querySelector('#forecast-section');
let weatherBody = document.querySelector('#weather-body');
let fiveDay = document.querySelector('#five-day');

let apiKey = '425d9b6035ae956db1531e2fea0981f6';
let apiUrl = 'https://api.openweathermap.org/data/3.0/';

let showCitySearch = function () {
	console.log('showCitySearch fn');
};

let searchCurrentWeather = function (searchCity) {
	console.log('searchCurrentWeather fn: ' + searchCity);

	let currentWeatherUrl = apiUrl + 'weather?q=' + searchCity + '&units=imperial&PPID=' + apiKey;
	console.log(currentWeatherUrl);
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
	searchCurrentWeather(searchCity);
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