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


let displayForecastWeather = function (fetchedForecastData) {
	console.log('displayForecastWeather fn, forecast count: ' + fetchedForecastData.cnt);

	// loop thru number of forecast days to display all 5 forecasts one by one
	for (let i = 0; i < fetchedForecastData.cnt; i++) {

		// create display elements
		let forecastDate = moment(fetchedForecastData.list[i].dt_txt);
		if (parseInt(forecastDate.format('HH')) == 12) {
			console.log('Hour: ' + forecastDate.format('HH'));

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
			console.log("Forecast iteration #" + (i + 1) + ": " + forecastDate);

			// grab weather icon
			let forecastIcon = document.createElement('img');
			forecastIcon.setAttribute('src', 'https://openweathermap.org/img/w/' + fetchedForecastData.list[i].weather[0].icon + '.png');
			forecastIcon.setAttribute('alt', fetchedForecastData.list[i].weather[0].main + ' - ' + fetchedForecastData.list[i].weather[0].description);
			console.log('src', 'https://openweathermap.org/img/w/' + fetchedForecastData.list[i].weather[0].icon + '.png');
			console.log('alt', fetchedForecastData.list[i].weather[0].main + ' - ' + fetchedForecastData.list[i].weather[0].description);

			// display temperature
			let forecastTemp = document.createElement('div');
			forecastTemp.textContent = 'Temp: ' + fetchedForecastData.list[i].main.temp + ' °F';
			console.log('Temp: ' + fetchedForecastData.list[i].main.temp + ' °F');

			// display humidity
			let forecastHumidity = document.createElement('div');
			forecastHumidity.textContent = 'Humidity: ' + fetchedForecastData.list[i].main.humidity + '%';
			console.log('Humidity: ' + fetchedForecastData.list[i].main.humidity + '%');

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
	console.log('fetchDisplayFiveDay fn: ' + searchCity);
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
	// call search function to fetch and display 5 day
	fetchDisplayFiveDay(searchCity);
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