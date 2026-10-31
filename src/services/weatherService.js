import { config } from '../config/index.js';
import { AppError } from '../utils/AppError.js';

/**
 * Fetches current weather for a given city from OpenWeatherMap.
 * The API key never leaves the server.
 * @param {string} city
 * @returns {Promise<object>} raw weather data from the provider
 */
export async function getWeatherByCity(city) {
  const url = new URL(config.openWeather.baseUrl);
  url.searchParams.set('q', city);
  url.searchParams.set('units', 'metric');
  url.searchParams.set('appid', config.openWeather.apiKey);

  let response;
  try {
    response = await fetch(url);
  } catch (err) {
    throw new AppError('Failed to reach weather provider', 502);
  }

  let data;
  try {
    data = await response.json();
  } catch (err) {
    throw new AppError('Received an invalid response from weather provider', 502);
  }

  if (!response.ok) {
    // OpenWeatherMap sends { cod, message } on errors (e.g. city not found, bad key)
    const message = data?.message || 'Failed to fetch weather data';
    throw new AppError(message, response.status);
  }

  return data;
}
