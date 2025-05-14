'use client';

import { useState } from 'react';
import { fetchWeather } from '../utils/api';
import { useWeatherStore } from '../store/useWeatherStore';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const [city, setCity] = useState('');
  const [error, setError] = useState<string | null>(null);
  const setSearchResults = useWeatherStore(s => s.setSearchResults);
  const router = useRouter();

  const onSearch = async () => {
    setError(null);
    try {
      const data = await fetchWeather(city);
      setSearchResults(data);
      // Переходим на маршрут /weather/[city]
      router.push(`/weather/${encodeURIComponent(data.name)}`);
    } catch (e: any) {
      setError(e.message);
    }
  };

  return (
    <div className="container">
      <h1>Поиск города</h1>
      <input
        type="text"
        value={city}
        onChange={e => setCity(e.target.value)}
        placeholder="Введите название города"
      />
      <button onClick={onSearch}>Найти</button>
      {error && <p className="error">Ошибка: {error}</p>}
    </div>
  );
}