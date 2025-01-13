const apiKey = 'YOUR API KEY';
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather';
const forecastUrl = 'https://api.openweathermap.org/data/2.5/forecast';

function getWeather() {
    // Gets the value entered in the input field
    const city = document.getElementById('cityInput').value;
    if (!city) {
        alert("Please enter a city");
        return;
    }
    // Makes HTTP request to the OpenWeatherMap API
    fetch(`${apiUrl}?q=${city}&appid=${apiKey}&units=metric`)
        // Converts the API response into a JSON object
        .then(response => response.json())
        .then(data => {
            if (data.cod !== 200) {
                alert('City not found!');
                return;
            }
            // Creates a variable with the weather data formatted as HTML
            const weatherHTML = `
                <h2>${data.name}, ${data.sys.country}</h2>
                <p>Temperature: ${data.main.temp} °C</p>
                <p>Weather: ${data.weather[0].description}</p> <!-- Removed °C here -->
                <p>Humidity: ${data.main.humidity}%</p>
                <p>Wind Speed: ${data.wind.speed} m/s</p>
                <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}.png" alt="Weather Icon">
            `;
            // Inserts the generated weather data into the HTML element
            document.getElementById('weatherResult').innerHTML = weatherHTML;
            // Saves the last searched city in the browser's local storage
            localStorage.setItem('lastCity', city);

            // Call the forecast function
            getForecast(city);
        })
        // Catches errors in case API request fails
        .catch(error => alert('Error fetching data'));
}

function getForecast(city) {
    fetch(`${forecastUrl}?q=${city}&appid=${apiKey}&units=metric`)
        .then(response => response.json())
        .then(data => {
            const forecastElement = document.getElementById('forecastResult');
            forecastElement.innerHTML = '<h3>5-Day Forecast</h3>';

            // Group data by day and extract one entry per day
            const dailyForecasts = {};
            data.list.forEach(item => {
                const date = item.dt_txt.split(' ')[0]; // Extract date only
                if (!dailyForecasts[date]) {
                    dailyForecasts[date] = item;
                }
            });

            // Generate forecast cards
            Object.keys(dailyForecasts).forEach(date => {
                const forecast = dailyForecasts[date]; // Fixed variable name
                forecastElement.innerHTML += `
                    <div class="forecast-card"> <!-- Fixed class name -->
                        <p><strong>${date}</strong></p>
                        <p>Temp: ${forecast.main.temp} °C</p>
                        <p>${forecast.weather[0].description}</p>
                        <img src="https://openweathermap.org/img/wn/${forecast.weather[0].icon}.png" alt="Weather Icon">
                    </div>
                `;
            });
        })
        .catch(error => alert('Error fetching forecast data'));
}

// Page load logic using local storage
window.onload = function() { // Runs the code when the page loads
    const lastCity = localStorage.getItem('lastCity');
    if (lastCity) { // Checks if the last city was previously saved
        document.getElementById('cityInput').value = lastCity;
        getWeather(); // Fetches weather for the saved city
    }
}
