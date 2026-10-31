import { getWeatherByCity } from '../services/weatherService.js';
import { AppError } from '../utils/AppError.js';

export async function fetchWeather(req, res, next) {
  try {
    const { city } = req.query;

    if (!city || !city.trim()) {
      throw new AppError('Query parameter "city" is required', 400);
    }

    const data = await getWeatherByCity(city.trim());

    res.status(200).json({
      success: true,
      data,
    });
  } catch (err) {
    next(err);
  }
}
