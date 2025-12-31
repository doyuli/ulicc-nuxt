import { tool } from 'ai'
import { z } from 'zod'

export function createWeatherTool() {
  return tool({
    description: 'A tool to get current weather information for a location',
    inputSchema: z.object({
      location: z
        .string()
        .describe('The city or location to get weather for, in English only'),
      units: z
        .enum(['metric', 'imperial'])
        .default('metric')
        .describe('Units of measurement (metric or imperial)'),
    }),
    execute: async ({ location, units }) => {
      try {
        const data = await getWeatherData(location, units)
        return data
      }
      catch {
        return null
      }
    },
  })
}

function getWeatherIcon(code: number): string {
  // WMO Weather interpretation codes (WW)
  // https://open-meteo.com/en/docs
  if (code === 0)
    return '☀️' // Clear sky
  if (code >= 1 && code <= 3)
    return '☁️' // Partly cloudy
  if (code >= 45 && code <= 48)
    return '🌫️' // Fog
  if (code >= 51 && code <= 55)
    return '🌧️' // Drizzle
  if (code >= 56 && code <= 57)
    return '🌨️' // Freezing drizzle
  if (code >= 61 && code <= 65)
    return '🌧️' // Rain
  if (code >= 66 && code <= 67)
    return '🌨️' // Freezing rain
  if (code >= 71 && code <= 77)
    return '❄️' // Snow
  if (code >= 80 && code <= 82)
    return '🌧️' // Rain showers
  if (code >= 85 && code <= 86)
    return '🌨️' // Snow showers
  if (code >= 95 && code <= 99)
    return '⛈️' // Thunderstorm
  return '❓' // Unknown
}

function getWeatherDescription(code: number): string {
  // WMO Weather interpretation codes (WW)
  // https://open-meteo.com/en/docs
  if (code === 0)
    return 'Clear sky'
  if (code >= 1 && code <= 3)
    return 'Partly cloudy'
  if (code >= 45 && code <= 48)
    return 'Foggy'
  if (code >= 51 && code <= 55)
    return 'Drizzle'
  if (code >= 56 && code <= 57)
    return 'Freezing drizzle'
  if (code >= 61 && code <= 65)
    return 'Rain'
  if (code >= 66 && code <= 67)
    return 'Freezing rain'
  if (code >= 71 && code <= 77)
    return 'Snow'
  if (code >= 80 && code <= 82)
    return 'Rain showers'
  if (code >= 85 && code <= 86)
    return 'Snow showers'
  if (code >= 95 && code <= 99)
    return 'Thunderstorm'
  return 'Unknown'
}

async function getWeatherData(location: string, units: string) {
  const resp = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1`)

  if (!resp.ok) {
    throw new Error('Failed to find location')
  }

  const geo = await resp.json()

  if (!geo.results?.[0]) {
    throw new Error('Location not found')
  }

  const { latitude, longitude } = geo.results[0]

  const weather = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&wind_speed_unit=${
      units === 'metric' ? 'ms' : 'mph'
    }&temperature_unit=${units === 'metric' ? 'celsius' : 'fahrenheit'}`,
  )

  if (!weather.ok) {
    throw new Error('Failed to fetch weather data')
  }

  const data = await weather.json()
  const current = data.current

  return {
    temperature: Math.round(current.temperature_2m),
    description: getWeatherDescription(current.weather_code),
    humidity: current.relative_humidity_2m,
    windSpeed: Math.round(current.wind_speed_10m),
    icon: getWeatherIcon(current.weather_code),
  }
}
