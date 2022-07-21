let searchCityForm = document.querySelector('#search-city');
let searchCityInput = document.querySelector('#search-input');

let showCitySearch = function () {
	console.log('showCitySearch fn');
};

let weatherSearchHandler = function () {
	console.log('weatherSearchHandler fn: ' + searchCity);
};

let addCityToSearch = function () {
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