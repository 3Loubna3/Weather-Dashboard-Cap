// Store the OpenWeather API Key for accessing weather data
const OPENWEATHER_API_KEY = 'db556e87474a3ff3bf552011ffad7a93'; // My OpenWeather API Key 

// Default city to display weather information if no input is provided
const DEFAULT_CITY = 'Tokyo'; // Constant for default city

// Function to fetch weather data from OpenWeather API based on city name
async function fetchWeather(city) {
    // Construct the API request URL with the city name and API key
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${OPENWEATHER_API_KEY}&units=metric`;
    
    // Fetch data from the API
    const response = await fetch(url);
    
    // Check if the response is successful; if not, throw an error
    if (!response.ok) {
        throw new Error('City not found :(');
    }
    
    // Return the weather data in JSON format
    return await response.json();
}

// Function to update the weather information displayed on the UI
async function updateWeather(city) {
    try {
        // Fetch weather data for the specified city
        const weatherData = await fetchWeather(city);

        // Clear any existing error messages from the UI
        document.getElementById('error-message').innerText = '';

        // Extract the main weather condition (e.g., clear, rain) from the data
        const weatherCondition = weatherData.weather[0].main.toLowerCase();

        // Update UI elements with the fetched weather data
        document.getElementById('city-name').innerText = `${weatherData.name}, ${weatherData.sys.country}`; // Display city and country
        document.getElementById('temp').innerText = `${weatherData.main.temp.toFixed(2)}°C`; // Display temperature
        document.getElementById('humidity').innerText = `${weatherData.main.humidity}%`; // Display humidity
        document.getElementById('wind-speed').innerText = `${weatherData.wind.speed.toFixed(2)} km/h`; // Display wind speed
        
        // Capitalize the first letter of the weather description for better readability
        document.getElementById('weather-description').innerText = weatherData.weather[0].description.charAt(0).toUpperCase() + weatherData.weather[0].description.slice(1);

        // Automatically update the weather every 5 minutes (300000 milliseconds)
        setInterval(() => {
            // Get the current city input value or fallback to the default city
            const cityInput = document.getElementById('city-input').value || DEFAULT_CITY; 
            // Update the weather for the current input or default city
            updateWeather(cityInput);
        }, 300000); // 5 minutes

        // Set weather icon based on OpenWeather icon code
        const iconCode = weatherData.weather[0].icon; // Get the icon code from the weather data
        document.getElementById('weather-icon').src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`; // Set the default weather icon

        // Change the weather icon based on specific conditions
        if (iconCode === '01d' || iconCode === '01n') {
            document.getElementById('weather-icon').src = 'images/sun_icon.png'; // Use a custom sun icon for clear weather
        } else {
            document.getElementById('weather-icon').src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`; // Fallback to the OpenWeather icon
        }

        // Change background video based on the current weather condition
        const videoSource = document.getElementById('video-source'); // Reference to the video source element
        if (weatherCondition.includes('clear')) {
            videoSource.src = 'https://cdn.pixabay.com/video/2018/08/10/17723-284467863_large.mp4'; // Video for clear weather
        } else if (weatherCondition.includes('cloud')) {
            videoSource.src = 'https://cdn.pixabay.com/video/2024/09/09/230528_large.mp4'; // Video for cloudy weather
        } else if (weatherCondition.includes('rain')) {
            videoSource.src = 'https://cdn.pixabay.com/video/2023/02/22/151744-801455851_large.mp4'; // Video for rainy weather
        } else if (weatherCondition.includes('haze')) {
            videoSource.src = 'https://cdn.pixabay.com/video/2018/05/05/16011-268207201_large.mp4'; // Video for hazy weather
        } else if (weatherCondition.includes('mist')) {
            videoSource.src = 'https://cdn.pixabay.com/video/2018/05/05/16011-268207201_large.mp4'; // Video for misty weather
        } else if (weatherCondition.includes('fog')) {
            videoSource.src = 'https://cdn.pixabay.com/video/2018/05/05/16011-268207201_large.mp4'; // Video for foggy weather
        } else if (weatherCondition.includes('thunderstorm')) {
            videoSource.src = 'https://assets.mixkit.co/videos/48918/48918-720.mp4'; // Video for thunderstorm weather
        } else if (weatherCondition.includes('snow')) {
            videoSource.src = 'https://videos.pexels.com/video-files/6933537/6933537-uhd_2732_1440_24fps.mp4'; // Video for snowy weather
        } else if (weatherCondition.includes('tornado')) {
            videoSource.src = 'https://assets.mixkit.co/videos/9591/9591-720.mp4'; // Video for tornado weather
        } else {
            videoSource.src = 'https://cdn.pixabay.com/video/2019/05/22/23881-337972830_large.mp4'; // Default video for unspecified weather
        }

        // Load the new video source
        videoSource.parentElement.load();

        // Show the weather card once the data is loaded successfully
        document.getElementById('weather-card').classList.remove('hidden');
    } catch (error) {
        // Display error message if the weather data could not be fetched
        document.getElementById('error-message').innerText = error.message;
        document.getElementById('weather-card').classList.add('hidden'); // Hide the weather card if there is an error
    }
}

// Event listener for the search button
document.getElementById('search-btn').addEventListener('click', () => {
    // Get the city input value when the search button is clicked
    const cityInput = document.getElementById('city-input').value;
    // If there is an input value, update the weather for that city
    if (cityInput) {
        updateWeather(cityInput);
    }
});

// Fetch and display the default city weather on initial page load
updateWeather(DEFAULT_CITY);
