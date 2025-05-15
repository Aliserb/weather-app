import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CityWeather, ForecastResponse } from '../utils/api';

interface State {
  favorites: CityWeather[];
  searchResults: CityWeather | null;
  forecastData: ForecastResponse | null;

  addFavorite: (city: CityWeather) => void;
  removeFavorite: (name: string) => void;
  setSearchResults: (city: CityWeather | null) => void;
  setForecastData: (data: ForecastResponse | null) => void;
}

export const useWeatherStore = create<State>()(
  persist(
    (set) => ({
      favorites: [],
      searchResults: null,
      forecastData: null,

      addFavorite: (city) =>
        set((state) => ({
          favorites: state.favorites.find((c) => c.name === city.name)
            ? state.favorites
            : [...state.favorites, city],
        })),

      removeFavorite: (name) =>
        set((state) => ({
          favorites: state.favorites.filter((c) => c.name !== name),
        })),

      setSearchResults: (city) => set({ searchResults: city }),

      setForecastData: (data) => set({ forecastData: data }),
    }),
    {
      name: 'weather-storage',
      partialize: (state) => ({
        favorites: state.favorites,
      }),
    }
  )
);