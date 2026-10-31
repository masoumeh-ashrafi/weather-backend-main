import 'dotenv/config';

const required = ['OPENWEATHER_API_KEY'];

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

export const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  openWeather: {
    apiKey: process.env.OPENWEATHER_API_KEY,
    baseUrl: process.env.OPENWEATHER_BASE_URL || 'https://api.openweathermap.org/data/2.5/weather',
  },
  clientOrigin: process.env.CLIENT_ORIGIN || '*',
};
