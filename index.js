const mustache = require('mustache');
const fs = require('fs');
const fetch = require('node-fetch');

const MUSTACHE_MAIN_DIR = './main.mustache';

// Replace these with your actual OpenWeatherMap API details if you want real weather
// You can get a free API key at https://openweathermap.org/
const WEATHER_API_KEY = 'YOUR_OPEN_WEATHER_API_KEY';
const CITY = 'Dhaka'; 

let DATA = {
  date: new Date().toUTCString(),
  weather: 'Clear',       // Fallback data
  temperature: '25',      // Fallback data
  sun_rise: '06:00',      // Fallback data
  sun_set: '18:00',       // Fallback data
};

async function setWeatherInformation() {
  if (WEATHER_API_KEY === 'YOUR_OPEN_WEATHER_API_KEY') return; // Skip if no key provided

  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&appid=${WEATHER_API_KEY}&units=metric`
  );
  const weatherData = await response.json();
  
  // Format sunrise and sunset times
  const sunrise = new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString('en-GB');
  const sunset = new Date(weatherData.sys.sunset * 1000).toLocaleTimeString('en-GB');

  DATA.weather = weatherData.weather[0].description;
  DATA.temperature = Math.round(weatherData.main.temp);
  DATA.sun_rise = sunrise;
  DATA.sun_set = sunset;
}

async function generateReadMe() {
  await fs.readFile(MUSTACHE_MAIN_DIR, (err, data) => {
    if (err) throw err;
    const output = mustache.render(data.toString(), DATA);
    fs.writeFileSync('README.md', output);
    console.log('README.md has been generated successfully!');
  });
}

async function action() {
  await setWeatherInformation();
  await generateReadMe();
}

action();