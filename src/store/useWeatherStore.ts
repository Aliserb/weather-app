import { create } from "zustand";
import { WeatherData } from "../utils/api";

type State = {
  favorites: WeatherData[];
  searchResults: WeatherData | null;
  addFavorite: (w: WeatherData) => void;
  removeFavorite: (city: string) => void;
  setSearchResults: (w: WeatherData | null) => void;
};

export const useWeatherStore = create<State>((set) => ({
  favorites: [],
  searchResults: null,
  addFavorite: (weather) =>
    set((state) => ({
      favorites: state.favorites.find((w) => w.name === weather.name)
        ? state.favorites
        : [...state.favorites, weather],
    })),
  removeFavorite: (city) =>
    set((state) => ({
      favorites: state.favorites.filter((w) => w.name !== city),
    })),
  setSearchResults: (weather) => set({ searchResults: weather }),
}));