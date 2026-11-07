// metaweather.com більше не працює, тому використано Open-Meteo (безкоштовне API без ключа)

// Координати Києва (якщо геолокація недоступна)
export const KYIV = { latitude: 50.4501, longitude: 30.5234 }

// Коди погоди Open-Meteo -> текст і смайлик
const WEATHER_CODES = {
  0: { text: 'Ясно', icon: '☀️' },
  1: { text: 'Переважно ясно', icon: '🌤️' },
  2: { text: 'Мінлива хмарність', icon: '⛅' },
  3: { text: 'Хмарно', icon: '☁️' },
  45: { text: 'Туман', icon: '🌫️' },
  48: { text: 'Паморозь', icon: '🌫️' },
  51: { text: 'Легка мряка', icon: '🌦️' },
  53: { text: 'Мряка', icon: '🌦️' },
  55: { text: 'Сильна мряка', icon: '🌦️' },
  61: { text: 'Невеликий дощ', icon: '🌧️' },
  63: { text: 'Дощ', icon: '🌧️' },
  65: { text: 'Сильний дощ', icon: '🌧️' },
  71: { text: 'Невеликий сніг', icon: '🌨️' },
  73: { text: 'Сніг', icon: '🌨️' },
  75: { text: 'Сильний сніг', icon: '❄️' },
  80: { text: 'Короткочасний дощ', icon: '🌦️' },
  81: { text: 'Злива', icon: '🌧️' },
  82: { text: 'Сильна злива', icon: '⛈️' },
  95: { text: 'Гроза', icon: '⛈️' },
  96: { text: 'Гроза з градом', icon: '⛈️' },
  99: { text: 'Сильна гроза з градом', icon: '⛈️' },
}

function getWeatherInfo(code) {
  return WEATHER_CODES[code] || { text: 'Невідомо', icon: '❓' }
}

// Завантажує прогноз на 5 днів і повертає масив об'єктів для карток
export async function loadWeather(latitude, longitude) {
  const url =
    'https://api.open-meteo.com/v1/forecast' +
    '?latitude=' + latitude +
    '&longitude=' + longitude +
    '&daily=weathercode,temperature_2m_max,temperature_2m_min,windspeed_10m_max,precipitation_probability_max' +
    '&timezone=auto&forecast_days=5'

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error('Сервер погоди повернув помилку: ' + response.status)
  }

  const data = await response.json()
  const daily = data.daily
  const days = []

  for (let i = 0; i < daily.time.length; i++) {
    const info = getWeatherInfo(daily.weathercode[i])
    days.push({
      date: daily.time[i],
      text: info.text,
      icon: info.icon,
      maxTemp: Math.round(daily.temperature_2m_max[i]),
      minTemp: Math.round(daily.temperature_2m_min[i]),
      wind: Math.round(daily.windspeed_10m_max[i]),
      rain: daily.precipitation_probability_max[i],
    })
  }

  return days
}
