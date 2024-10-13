const OPENWEATHER_API_KEY = 'db556e87474a3ff3bf552011ffad7a93'; // Your actual OpenWeather API Key 
const DEFAULT_CITY = 'Tokyo'; // Constant for default city

// Fetch weather data from OpenWeather API
async function fetchWeather(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${OPENWEATHER_API_KEY}&units=metric`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('City not found');
    }
    return await response.json();
}

// Update the UI with weather data
async function updateWeather(city) {
    try {
        const weatherData = await fetchWeather(city);
        
        // Clear any existing error message
        document.getElementById('error-message').innerText = '';

        const weatherCondition = weatherData.weather[0].main.toLowerCase();

         // Update weather information
         document.getElementById('city-name').innerText = `${weatherData.name}, ${weatherData.sys.country}`;
         document.getElementById('temp').innerText = `${weatherData.main.temp.toFixed(2)}°C`;
         document.getElementById('humidity').innerText = `${weatherData.main.humidity}%`;
         document.getElementById('wind-speed').innerText = `${weatherData.wind.speed.toFixed(2)} km/h`;
         document.getElementById('weather-description').innerText = weatherData.weather[0].description.charAt(0).toUpperCase() + weatherData.weather[0].description.slice(1);

        // Automatically update the weather every 5 minutes (300000 milliseconds)
        setInterval(() => {
        const cityInput = document.getElementById('city-input').value || DEFAULT_CITY; // Use the current input or default city
        updateWeather(cityInput);
        }, 300000); // 5 minutes
       
        

        // Set weather icon based on OpenWeather icon code
        const iconCode = weatherData.weather[0].icon;
        document.getElementById('weather-icon').src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

        // Change background video based on weather condition
        const videoSource = document.getElementById('video-source');
        if (weatherCondition.includes('clear')) {
            videoSource.src = 'https://cdn.pixabay.com/video/2018/08/10/17723-284467863_large.mp4';
        } else if (weatherCondition.includes('cloud')) {
            videoSource.src = 'https://cdn.pixabay.com/video/2024/09/09/230528_large.mp4';
        } else if (weatherCondition.includes('rain')) {
            videoSource.src = 'https://cdn.pixabay.com/video/2023/02/22/151744-801455851_large.mp4';
        } else if (weatherCondition.includes('haze')) {
            videoSource.src = 'https://cdn.pixabay.com/video/2018/05/05/16011-268207201_large.mp4';
        } else {
            videoSource.src = 'https://cdn.pixabay.com/video/2019/05/22/23881-337972830_large.mp4'; // Default video
        }

        // Load the new video
        videoSource.parentElement.load();

        // Show the weather card
        document.getElementById('weather-card').classList.remove('hidden');
    } catch (error) {
        // Show error message
        document.getElementById('error-message').innerText = error.message;
        document.getElementById('weather-card').classList.add('hidden');
    }
}

// Event listener for the search button
document.getElementById('search-btn').addEventListener('click', () => {
    const cityInput = document.getElementById('city-input').value;
    if (cityInput) {
        updateWeather(cityInput);
    }
});

// Default city weather on page load
updateWeather(DEFAULT_CITY);

