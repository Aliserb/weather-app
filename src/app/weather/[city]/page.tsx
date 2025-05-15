"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { forecast, ForecastResponse } from '@/utils/api';
import {
  Container,
  Row,
  Col,
  Card,
  Spinner,
  Alert,
  Button,
} from "react-bootstrap";
import { format, parseISO } from "date-fns";
import { ru } from "date-fns/locale";
import Link from "next/link";
import { useWeatherStore } from "@/store/useWeatherStore";
import Image from "next/image";

export default function WeatherPage() {
  const searchResults = useWeatherStore((s) => s.searchResults);

  const favorites = useWeatherStore((s) => s.favorites);
  const addFavorite = useWeatherStore((s) => s.addFavorite);
  const removeFavorite = useWeatherStore((s) => s.removeFavorite);
  const isFavorite = Boolean(
    searchResults &&
      favorites.some(
        (f) =>
          f.coord.lat === searchResults.coord.lat &&
          f.coord.lon === searchResults.coord.lon
      )
  );

  const params = useSearchParams();
  const lat = params.get("lat");
  const lon = params.get("lon");

  const [forecastData, setForecastData] = useState<ForecastResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await forecast(Number(lat), Number(lon));
        setForecastData(data);

        console.log(data);
      } catch (err) {
        setError("Не удалось загрузить прогноз");
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    if (lat && lon) fetchData();
  }, [lat, lon]);

  type ForecastItem = ForecastResponse['list'][0];
  
  interface GroupedForecast {
    date: string;
    dayName: string;
    items: ForecastItem[];
    temp_max: number;
    temp_min: number;
  }

  interface HourForecast {
    dt: number;
    dt_txt: string;
    main: {
      temp: number;
    };
    weather: Array<{
      icon: string;
      description: string;
    }>;
  }
  
  const groupByDay = (): GroupedForecast[] => {
    if (!forecastData) return [];
  
    const grouped: Record<string, ForecastItem[]> = {};
  
    forecastData.list.forEach((item) => {
      const date = item.dt_txt.split(" ")[0];
      grouped[date] = grouped[date] || [];
      grouped[date].push(item);
    });
  
    return Object.entries(grouped).map(([date, items]) => ({
      date,
      dayName: format(parseISO(date), "EEEE", { locale: ru }),
      items,
      temp_max: Math.round(Math.max(...items.map(i => i.main.temp))),
      temp_min: Math.round(Math.min(...items.map(i => i.main.temp))),
    }));
  };  

  const dailyForecasts = groupByDay();

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }
  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  if (!forecastData) {
    return (
      <Container className="py-5">
        <Alert variant="warning">Данные прогноза не найдены.</Alert>
      </Container>
    );
  }
  
  return (
    <Container className="py-4">
      <Link href="/">Вернуться на главную</Link>

      <div className="forecast_header mb-4 d-flex align-items-center justify-content-center">
        <h2 className="text-center me-4">
          Прогноз для {forecastData.city.name}, {forecastData.city.country}
        </h2>

        {searchResults && (
          <Button
            variant={isFavorite ? "danger" : "primary"}
            onClick={() => {
              if (!searchResults) return;
              if (isFavorite) {
                removeFavorite(searchResults.name);
              } else {
                addFavorite(searchResults);
              }
            }}
          >
            {isFavorite ? "Удалить из избранного" : "Добавить в избранное"}
          </Button>
        )}
      </div>

      <Row xs={1} md={3} className="g-4">
        {dailyForecasts.map((day) => (
          <Col key={day.date}>
            <Card className="h-100 shadow-sm">
              <Card.Header className="text-center bg-light">
                <h5 className="mb-0">
                  {day.dayName.charAt(0).toUpperCase() + day.dayName.slice(1)}
                  <br />
                  <small>{format(parseISO(day.date), "dd.MM.yyyy")}</small>
                </h5>
              </Card.Header>
              <Card.Body className="text-center">
                <div className="d-flex justify-content-around mb-3">
                  <div>
                    <div className="text-muted">Макс</div>
                    <div className="h4">{day.temp_max}°C</div>
                  </div>
                  <div>
                    <div className="text-muted">Мин</div>
                    <div className="h4">{day.temp_min}°C</div>
                  </div>
                </div>

                <div className="mb-3">
                  <Image
                    src={`https://openweathermap.org/img/wn/${day.items[0].weather[0].icon}@2x.png`}
                    alt={day.items[0].weather[0].description}
                    width={50}
                    height={50}
                  />
                  <div className="text-capitalize">
                    {day.items[0].weather[0].description}
                  </div>
                </div>

                <div className="hourly-forecast">
                  {day.items.map((hour: HourForecast) => (
                    <div
                      key={hour.dt}
                      className="d-flex justify-content-between border-bottom py-2"
                    >
                      <span>{format(parseISO(hour.dt_txt), "HH:mm")}</span>
                      <span className="fw-bold">
                        {Math.round(hour.main.temp)}°C
                      </span>
                      <span>
                        <Image
                          src={`https://openweathermap.org/img/wn/${hour.weather[0].icon}.png`}
                          alt={hour.weather[0].description}
                          width={30}
                          height={30}
                        />
                      </span>
                    </div>
                  ))}
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}
