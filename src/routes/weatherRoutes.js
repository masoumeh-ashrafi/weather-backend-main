import { Router } from 'express';
import { fetchWeather } from '../controllers/weatherController.js';

const router = Router();

// GET /api/weather?city=Kathmandu
router.get('/', fetchWeather);

export default router;
