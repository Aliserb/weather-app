import axios from "axios";

const API_KEY = process.env.NEXT_PUBLIC_OWM_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5";

export interface WeatherData {
  name: string;
  main: { temp: number; humidity: number };
  weather: { description: string; icon: string }[];
}

export async function fetchWeather(city: string): Promise<WeatherData> {
  try {
    const { data } = await axios.get<WeatherData>(`${BASE_URL}/weather`, {
      params: { q: city, appid: API_KEY, units: "metric" },
    });
    return data;
  } catch (err: any) {
    // можно различать ошибки по err.response.status
    throw new Error(err.response?.data?.message || err.message);
  }
}