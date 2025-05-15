import axios from 'axios';

const API_KEY = process.env.NEXT_PUBLIC_OWM_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export interface ForecastResponse {
  cod: string;
  message: number;
  cnt: number;
  list: {
    dt: number;
    dt_txt: string;
    main: {
      temp: number;
      temp_min: number;
      temp_max: number;
    };
    weather: {
      id: number;
      main: string;
      description: string;
      icon: string;
    }[];
  }[];
  city: {
    name: string;
    country: string;
    coord: { lat: number; lon: number };
  };
}

export interface CitySearchResponse {
  message: string;
  cod: string;
  count: number;
  list: CityWeather[];
}

export interface CityWeather {
  id: number;
  name: string;
  coord: Coord;
  main: Main;
  dt: number;
  wind: Wind;
  sys: Sys;
  rain: null | Record<string, number>;
  snow: null | Record<string, number>;
  clouds: Clouds;
  weather: Weather[];
}

export interface Coord { lat: number; lon: number; }
export interface Main {
  temp: number; feels_like: number;
  temp_min: number; temp_max: number;
  pressure: number; humidity: number;
  sea_level: number; grnd_level: number;
}
export interface Wind { speed: number; deg: number; }
export interface Sys { country: string; }
export interface Clouds { all: number; }
export interface Weather {
  id: number; main: string;
  description: string; icon: string;
}

export async function searchCity(query: string): Promise<CitySearchResponse> {
  try {
    const { data } = await axios.get<CitySearchResponse>(`${BASE_URL}/find`, {
      params: { q: query, appid: API_KEY, units: 'metric', lang: 'ru' },
    });
    return data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      throw new Error(err.response?.data?.message || err.message);
    }
    if (err instanceof Error) {
      throw new Error(err.message);
    }
    throw new Error('Unknown error occurred during city search');
  }
}

export interface OneCallResponse {
  lat: number;
  lon: number;
  timezone: string;
  timezone_offset: number;
  current: Current;
  hourly: Hourly[];
  daily: Daily[];
}

export interface Current {
  dt: number;
  sunrise: number;
  sunset: number;
  temp: number;
  feels_like: number;
  pressure: number;
  humidity: number;
  dew_point: number;
  uvi: number;
  clouds: number;
  visibility: number;
  wind_speed: number;
  wind_deg: number;
  weather: Weather[];
}

export interface Hourly {
  dt: number;
  temp: number;
  feels_like: number;
  pressure: number;
  humidity: number;
  dew_point: number;
  uvi: number;
  clouds: number;
  visibility: number;
  wind_speed: number;
  wind_deg: number;
  pop: number;
  weather: Weather[];
}

export interface Daily {
  dt: number;
  sunrise: number;
  sunset: number;
  moonrise: number;
  moonset: number;
  moon_phase: number;
  temp: {
    day: number;
    min: number;
    max: number;
    night: number;
    eve: number;
    morn: number;
  };
  feels_like: {
    day: number;
    night: number;
    eve: number;
    morn: number;
  };
  pressure: number;
  humidity: number;
  dew_point: number;
  wind_speed: number;
  wind_deg: number;
  weather: Weather[];
  clouds: number;
  pop: number;
  rain?: number;
  uvi: number;
}

export async function forecast(
  lat: number,
  lon: number
): Promise<ForecastResponse> {
  const { data } = await axios.get<ForecastResponse>(
    `${BASE_URL}/forecast`,
    { params: { lat, lon, units: "metric", appid: API_KEY, lang: "ru" } }
  );
  return data;
}