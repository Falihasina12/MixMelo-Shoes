document.addEventListener('DOMContentLoaded', () => {
  const widget = document.getElementById('weather-widget');
  if (!widget) return;
  getWeather();
});

async function getUserLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('La géolocalisation n\'est pas prise en charge par ce navigateur.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      (error) => {
        reject(new Error(error.code === 1 ? 'Permission refusée pour la géolocalisation.' : 'Impossible de récupérer votre position.'));
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  });
}

async function getWeather() {
  const widget = document.getElementById('weather-widget');
  if (!widget) return;

  widget.innerHTML = '<p>Chargement de la météo...</p>';

  try {
    const coordinates = await getUserLocation();
    const weatherResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${coordinates.latitude}&longitude=${coordinates.longitude}&current=temperature_2m,weather_code,wind_speed_10m,relative_humidity_2m&timezone=auto`);

    if (!weatherResponse.ok) {
      throw new Error('API météo indisponible.');
    }

    const weatherData = await weatherResponse.json();
    const geocodeResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/reverse?latitude=${coordinates.latitude}&longitude=${coordinates.longitude}&language=fr`);
    const geocodeData = geocodeResponse.ok ? await geocodeResponse.json() : null;

    displayWeather(weatherData, geocodeData);
  } catch (error) {
    displayWeatherError(error.message);
  }
}

async function searchCity(city) {
  const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=fr&format=json`);
  if (!response.ok) throw new Error('Erreur lors de la recherche de ville.');
  const data = await response.json();
  if (!data.results || !data.results.length) {
    throw new Error('Ville introuvable.');
  }

  return data.results[0];
}

function displayWeather(weatherData, geocodeData) {
  const widget = document.getElementById('weather-widget');
  if (!widget || !weatherData?.current) return;

  const cityName = geocodeData?.results?.[0]?.name || 'Votre localisation';
  const temp = weatherData.current.temperature_2m;
  const condition = getWeatherLabel(weatherData.current.weather_code);
  const wind = weatherData.current.wind_speed_10m;
  const humidity = weatherData.current.relative_humidity_2m || 'N/A';
  const date = new Date().toLocaleString('fr-FR', { dateStyle: 'medium', timeStyle: 'short' });

  widget.innerHTML = `
    <div class="weather-card">
      <div class="weather-card__icon">${getWeatherIcon(weatherData.current.weather_code)}</div>
      <div>
        <div class="weather-card__meta">${cityName}</div>
        <div class="weather-card__temp">${Math.round(temp)}°C</div>
        <div class="weather-card__meta">${condition}</div>
      </div>
    </div>
    <div class="weather-card__meta">Vent : ${Math.round(wind)} km/h · Humidité : ${humidity}% · ${date}</div>
    <div class="weather-message">${getWeatherMessage(weatherData.current.temperature_2m, weatherData.current.weather_code)}</div>
    <button type="button" class="btn btn-secondary weather-button" id="refresh-weather-btn">Actualiser la météo</button>
  `;

  const refreshButton = document.getElementById('refresh-weather-btn');
  if (refreshButton) {
    refreshButton.addEventListener('click', getWeather);
  }
}

function displayWeatherError(message) {
  const widget = document.getElementById('weather-widget');
  if (!widget) return;

  widget.innerHTML = `
    <div class="empty-state">
      <p>Nous ne pouvons pas accéder à votre localisation.</p>
      <p>${message}</p>
      <div class="weather-city-search">
        <label for="cityInput" class="sr-only">Choisir une ville</label>
        <input id="cityInput" type="text" placeholder="Choisir une ville" />
        <button type="button" class="btn btn-primary" id="citySearchBtn">Rechercher</button>
      </div>
    </div>
  `;

  const citySearchBtn = document.getElementById('citySearchBtn');
  const cityInput = document.getElementById('cityInput');

  citySearchBtn?.addEventListener('click', async () => {
    const city = cityInput?.value.trim();
    if (!city) return;

    try {
      const cityData = await searchCity(city);
      const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${cityData.latitude}&longitude=${cityData.longitude}&current=temperature_2m,weather_code,wind_speed_10m,relative_humidity_2m&timezone=auto`);
      const weatherData = await response.json();
      displayWeather(weatherData, { results: [cityData] });
    } catch (error) {
      displayWeatherError(error.message);
    }
  });
}

function getWeatherLabel(code) {
  const map = {
    0: 'Ciel clair',
    1: 'Partiellement nuageux',
    2: 'Partiellement nuageux',
    3: 'Couvert',
    45: 'Brouillard',
    48: 'Brouillard givrant',
    51: 'Bruine légère',
    53: 'Bruine',
    55: 'Bruine forte',
    61: 'Pluie faible',
    63: 'Pluie modérée',
    65: 'Pluie forte',
    80: 'Averses',
    81: 'Averses fortes',
    82: 'Orages',
    71: 'Neige légère',
    73: 'Neige',
    75: 'Neige forte',
    95: 'Orage'
  };

  return map[code] || 'Conditions variées';
}

function getWeatherIcon(code) {
  if ([0, 1, 2].includes(code)) return '☀️';
  if ([45, 48].includes(code)) return '🌫️';
  if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return '🌧️';
  if ([71, 73, 75, 77].includes(code)) return '❄️';
  return '⛅';
}

function getWeatherMessage(temp, code) {
  if (temp >= 28) return '☀️ Temps chaud aujourd\'hui — découvrez nos chaussures respirantes.';
  if (code >= 51 && code <= 82) return '🌧️ Il pleut actuellement — découvrez notre sélection indoor.';
  if (temp <= 12) return '❄️ Temps frais — préparez votre prochaine session.';
  return '🏀 Conditions idéales pour une session de basket.';
}
