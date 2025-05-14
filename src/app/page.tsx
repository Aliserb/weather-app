"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { searchCity, CityWeather, forecast } from "../utils/api";
import { useWeatherStore } from "../store/useWeatherStore";
import Link from "next/link";

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<CityWeather[]>([]);
  const [error, setError] = useState<string | null>(null);

  const setSearchResults = useWeatherStore((s) => s.setSearchResults);
  
  const favorites = useWeatherStore(s => s.favorites);

  const router = useRouter();

  const onSearch = async () => {
    if (!query.trim()) {
      setError("Пожалуйста, введите название города");
      setResults([]);
      return;
    }
    setError(null);

    try {
      const data = await searchCity(query);
      setResults(data.list);

      if (data.list.length > 0) {
        setSearchResults(data.list[0]);
      }
    } catch (e: any) {
      setError(e.message);
      setResults([]);
    }
  };

  const fetchForecast = async (lat: number, lon: number) => {
    const data = await forecast(lat, lon);

    console.log(data);
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <Link href="/favorites/">Избранные города ({favorites ? favorites.length : 0})</Link>
          
          <h1 className="mb-4 text-center">Поиск города</h1>

          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Введите название города"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onSearch()}
            />
            <button className="btn btn-primary" onClick={onSearch}>
              Найти
            </button>
          </div>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          {(results.length > 0) ? 
            <div className="search_result mt-4">
              <h5 className="mb-3">Результаты поиска</h5>

              <ul className="list-group">
                {results.map((item) => (
                  <li
                    key={item.id}
                    className="list-group-item d-flex justify-content-between align-items-center"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setSearchResults(item);
                      fetchForecast(item.coord.lat, item.coord.lon)
                      router.push(
                        `/weather/${encodeURIComponent(item.name)}?lat=${item.coord.lat}&lon=${item.coord.lon}`
                      );
                    }}
                  >
                    <div>
                      {item.name}, {item.sys.country}{" "}
                      <img
                        src={`https://openweathermap.org/images/flags/${item.sys.country.toLowerCase()}.png`}
                        alt={item.sys.country}
                        style={{ width: 20, marginLeft: 4 }}
                      />
                    </div>

                    <div className="d-flex align-items-center">
                      <span className="me-2">
                        {Math.round(item.main.temp)}°C
                      </span>
                      <img
                        src={`https://openweathermap.org/img/wn/${item.weather[0].icon}.png`}
                        alt={item.weather[0].description}
                        width={30}
                        height={30}
                      />
                    </div>

                    <small className="text-muted">
                      {item.coord.lat.toFixed(3)}, {item.coord.lon.toFixed(3)}
                    </small>

                    {favorites.some(fav => fav.coord.lat === item.coord.lat && fav.coord.lon === item.coord.lon) && (
                      <div className="text-muted">В избранном</div>
                    )}
                    
                  </li>
                ))}
              </ul>
            </div> : <p className="text-muted">Ничего не найдено</p>
          }
        </div>
      </div>
    </div>
  );
}