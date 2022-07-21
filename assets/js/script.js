let searchCityForm = document.querySelector('#search-city');
let searchCityInput = document.querySelector('#search-input');
let noDataMessage = document.querySelector('#no-data-message');
let currentWeatherBox = document.querySelector('#current-weather-box');
let forecastSection = document.querySelector('#forecast-section');
let weatherBody = document.querySelector('#weather-body');
let fiveDay = document.querySelector('#five-day');
let searchHistoryList = document.querySelector('#search-history');

let searchHistoryArr = [];

let apiKey = '425d9b6035ae956db1531e2fea0981f6';
let apiUrl = 'https://api.openweathermap.org/data/2.5/';



let showCitySearch = function () {
	console.log('showCitySearch fn');

	// if data in localstorage, display last searched city
	if (localStorage.getItem('searchHistory')) {
		updateHistoryDisplay();
		weatherSearchHandler(searchHistoryArr[searchHistoryArr.concatlength - 1]);
	};
};


let fetchAndDisplayUVi = function (cityLatLon) {

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

				// create elements to hold UV info

				// create <div> container
				let uviDataBox = document.createElement('div');
				uviDataBox.classList.add('row');

				// create <div> column to hold text 'UV-Index:'
				let uviText = document.createElement('div');
				uviText.classList.add('col-md-auto');
				uviText.textContent = 'UV Index: ';


				/*
				Create the <div> column to hold the value of the UV Index.
				Color-code based on severity:
					 1-2 Green
					 3-5 Yellow
					 6-7 Orange
					 8-10 Red
					 11+ Purple
				*/

				let uviData = document.createElement('div');
				uviData.classList.add('col-md-auto', 'rounded', 'text-left');

				if (fetchedUvi.current.uvi < 3) {
					uviData.classList.add('bg-success');
				}
				else if (fetchedUvi.current.uvi >= 3 && fetchedUvi.current.uvi < 6) {
					uviData.classList.add('yellow');
				}
				else if (fetchedUvi.current.uvi >= 6 && fetchedUvi.current.uvi < 8) {
					uviData.classList.add('orange');
				}
				else if (fetchedUvi.current.uvi >= 8 && fetchedUvi.current.uvi < 11) {
					uviData.classList.add('bg-danger');
				}
				else {
					uviData.classList.add('purple');
				};
				uviData.textContent = fetchedUvi.current.uvi;

				let uviBlankBox = document.createElement('div');
				uviBlankBox.classList.add('col');

				uviDataBox.appendChild(uviText);
				uviDataBox.appendChild(uviData);
				uviDataBox.appendChild(uviBlankBox);
				weatherBody.appendChild(uviDataBox);
			});
		}
		else {
			console.log('Fetch UVI error');
		};
	});
};


let displayCurrentWeather = function (fetchedData) {

	// create <h1> tag to display city name, date, and weather icon
	let currentWeatherHeader = document.createElement('h1');

	// extra today's date
	let currentTime = moment();
	let today = '(' + currentTime.format('MM/DD/YYYY') + ')';

	// assign <h1> textContent to city name and today's date
	currentWeatherHeader.textContent = fetchedData.name + ' ' + today;

	// create <img> element and get weather icon
	let weatherIcon = document.createElement('img');
	weatherIcon.setAttribute('src', 'https://openweathermap.org/img/w/' + fetchedData.weather[0].icon + '.png');
	weatherIcon.setAttribute('alt', fetchedData.weather[0].main + ' - ' + fetchedData.weather[0].description);

	// create <div> element to display temperature
	let currentTemp = document.createElement('div');
	currentTemp.textContent = 'Temperature: ' + (fetchedData.main.temp) + ' °F';

	// create <div> element to display humidity
	let currentHumidity = document.createElement('div');
	currentHumidity.textContent = 'Humidity: ' + (fetchedData.main.humidity) + '%';

	// create <div> element to display wind speed
	let currentWindSpeed = document.createElement('div');
	currentWindSpeed.textContent = 'Wind Speed: ' + (fetchedData.wind.speed) + 'MPH';

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

	let currentWeatherUrl = apiUrl + 'weather?q=' + searchCity + '&units=imperial&APPID=' + apiKey;

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
			document.querySelector('#current-weather-box').classList.remove('hide');
			document.querySelector('#no-data-message').classList.remove('hide');
		};
	});
};


let displayForecastWeather = function (fetchedForecastData) {

	// loop thru number of forecast days to display all 5 forecasts one by one
	for (let i = 0; i < fetchedForecastData.cnt; i++) {

		// create display elements
		let forecastDate = moment(fetchedForecastData.list[i].dt_txt);
		if (parseInt(forecastDate.format('HH')) == 12) {

			// create <div> to hold each forecast
			let singleForecastBox = document.createElement('div');
			singleForecastBox.classList.add('card', 'bg-primary', 'col-10', 'col-lg-12', 'p-0', 'mx-auto', 'mt-3');

			// create <div> body to hold each forecast
			let singleForecastBody = document.createElement('div');
			singleForecastBody.classList.add('card-body', 'text-light', 'p-2');

			// forecast header is the forecast date
			let forecastHeader = document.createElement("h5");
			forecastHeader.classList.add("card-title");
			forecastDate = forecastDate.format("MM/DD/YYYY");
			forecastHeader.textContent = forecastDate

			// grab weather icon
			let forecastIcon = document.createElement('img');
			forecastIcon.setAttribute('src', 'https://openweathermap.org/img/w/' + fetchedForecastData.list[i].weather[0].icon + '.png');
			forecastIcon.setAttribute('alt', fetchedForecastData.list[i].weather[0].main + ' - ' + fetchedForecastData.list[i].weather[0].description);

			// display temperature
			let forecastTemp = document.createElement('div');
			forecastTemp.textContent = 'Temp: ' + fetchedForecastData.list[i].main.temp + ' °F';

			// display humidity
			let forecastHumidity = document.createElement('div');
			forecastHumidity.textContent = 'Humidity: ' + fetchedForecastData.list[i].main.humidity + '%';

			// append all elements to forecast box body
			singleForecastBody.appendChild(forecastHeader);
			singleForecastBody.appendChild(forecastIcon);
			singleForecastBody.appendChild(forecastTemp);
			singleForecastBody.appendChild(forecastHumidity);

			// append forecast box body to forecast box
			singleForecastBox.appendChild(singleForecastBody);

			// append each day's forecast box to 5-day forecast
			fiveDay.appendChild(singleForecastBox);
		};
	};

	forecastSection.classList.remove('hide');
};


let fetchDisplayFiveDay = function (searchCity) {

	let forecastUrl = apiUrl + 'forecast?q=' + searchCity + '&units=imperial&appid=' + apiKey;


	fetch(forecastUrl).then(function (response) {
		if (response.ok) {
			response.json().then(function (fetchedForecastData) {
				console.log('');
				console.log('fetched forecast data: ');
				console.log(fetchedForecastData);

				// call function to display 5-day forecast data
				displayForecastWeather(fetchedForecastData);
			});
		}
		else {
			console.log('Fetch forecast weather data error');
		};
	});
};


let weatherSearchHandler = function (searchCity) {

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
	// call search function to fetch and display 5 day
	fetchDisplayFiveDay(searchCity);
};


let updateHistoryDisplay = function () {

	// clear search history display
	searchHistoryList.textContent = '';

	// grab and parse searchHistoryArr from localStorage
	searchHistoryArr = JSON.parse(localStorage.getItem('searchHistory'));

	// display list of past cities searched in descending order from latest to oldest
	let displayCount = 1;
	for (let i = searchHistoryArr.length - 1; i >= 0; i--) {
		let historySearchItem = document.createElement('li');

		historySearchItem.textContent = displayCount + '.) ' + searchHistoryArr[i];
		historySearchItem.classList.add('list-group-item');
		historySearchItem.setAttribute('data-history-value', searchHistoryArr[i]);

		searchHistoryList.appendChild(historySearchItem);

		displayCount++;
	};
};

let addCityToSearch = function (searchCity) {

	// if city search list available in localStorage, grab it
	if (localStorage.getItem('searchHistory')) {
		searchHistoryArr = JSON.parse(localStorage.getItem('searchHistory'));
	};

	// add recently search city to searchHistoryArr array
	searchHistoryArr.push(searchCity);

	console.log('');
	console.log('searchHistoryArr: ' + searchHistoryArr);

	// store up to 10 cities in the array, shift / remove oldest city
	if (searchHistoryArr.length > 10) {
		searchHistoryArr.shift();
	};

	// store updated SearchHistoryArr into localStorage
	localStorage.setItem('searchHistory', JSON.stringify(searchHistoryArr));

	// refresh list of search history on web page
	updateHistoryDisplay();
};


let searchFormHandler = function (event) {
	// stops browser from sending the form's input data to URL
	event.preventDefault();

	let searchCity = searchCityInput.value.trim();

	// if search city is empty
	if (!searchCity) {
		return false;
	}


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

// if user clicks on city from search history list
searchHistoryList.addEventListener('click', function (event) {
	// prevent the browser from sending the form's input data to a URL
	event.preventDefault();

	let clickedSearch = event.target;

	if (clickedSearch.matches('li')) {
		let clickedHistoryCity = clickedSearch.getAttribute('data-history-value');
		weatherSearchHandler(clickedHistoryCity);
		addCityToSearch(clickedHistoryCity);
	};
});