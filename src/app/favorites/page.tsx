"use client";

import React from "react";
import { useWeatherStore } from "@/store/useWeatherStore";
import Link from "next/link";
import { Button } from "react-bootstrap";
import { forecast } from "@/utils/api";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function HomePage() {
  const favorites = useWeatherStore((s) => s.favorites);
  const removeFavorite = useWeatherStore((s) => s.removeFavorite);

  const router = useRouter();

  const fetchForecast = async (lat: number, lon: number) => {
    const data = await forecast(lat, lon);

    console.log(data);
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <Link href="/">На главную</Link>

          {favorites.length > 0 ? (
            <div className="search_result mt-4">
              <h5 className="mb-3">Избранные города</h5>

              <ul className="list-group">
                {favorites.map((item) => (
                  <li
                    key={item.id}
                    className="list-group-item d-flex align-items-center"
                  >
                    <div
                      className="favorite-item-wrap flex-grow-1 d-flex align-items-center justify-content-between"
                      onClick={() => {
                        fetchForecast(item.coord.lat, item.coord.lon);
                        router.push(
                          `/weather/${encodeURIComponent(item.name)}?lat=${
                            item.coord.lat
                          }&lon=${item.coord.lon}`
                        );
                      }}
                    >
                      <div className="city-name">
                        {item.name}, {item.sys.country}{" "}
                        <Image
                          src={`https://openweathermap.org/images/flags/${item.sys.country.toLowerCase()}.png`}
                          alt={item.sys.country}
                          width={20}
                          height={14}
                          className="country-flag"
                        />
                      </div>

                      <div className="current-temp d-flex align-items-center">
                        <span className="temp-value">
                          {Math.round(item.main.temp)}°C
                        </span>
                        <Image
                          src={`https://openweathermap.org/img/wn/${item.weather[0].icon}.png`}
                          alt={item.weather[0].description}
                          className="weather-icon"
                          width={30}
                          height={30}
                        />
                      </div>

                      <small className="coordinates text-muted">
                        {item.coord.lat.toFixed(3)}, {item.coord.lon.toFixed(3)}
                      </small>
                    </div>

                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => removeFavorite(item.name)}
                      className="ms-4"
                    >
                      Удалить
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-muted">Список избранных пуст</p>
          )}
        </div>
      </div>
    </div>
  );
}
