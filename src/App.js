import React, { useState, useEffect } from 'react';
import Current from './components/current/current';
import Details from './components/details/details';
import Forecast from './components/forecast/forecast';
import './styles/main.css';

function App() {
  const apiKey = 'c3c63453083b47c5b00192121232711';
  const city = 'Калининград';
  const lang = 'ru';

  // forecast options
  const day = 1;
  const hour = 18;

  const urlCurrent = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&lang=${lang}`;
  const urlForecast = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&lang=${lang}&days=${day}&hour=${hour}`;

  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // current weather fetch
        const responseCurrent = await fetch(urlCurrent);
        if (!responseCurrent.ok) {
          throw new Error(`HTTP error! Status: ${responseCurrent.status}`);
        }
        const currentData = await responseCurrent.json();

        // daily forecast
        const responseForecast = await fetch(urlForecast);
        if (!responseForecast.ok) {
          throw new Error(`HTTP error! Status: ${responseForecast.status}`);
        }
        const forecastData = await responseForecast.json();

        // Combining current weather and forecast data
        setWeatherData( {
          location: currentData.location,
          current: currentData.current,
          forecast: forecastData.forecast,
        });
      } catch (error) {
        console.error('Fetch error:', error);
      }
    };

    fetchData();
  }, [urlCurrent, urlForecast]);

  console.log(weatherData);
  const renderWeather = () => {
    if (!weatherData) {
      return null;
    }

    return (
      <div className="weather__inner">
        <Current
          city={weatherData.location.name}
          description={weatherData.current.condition.text}
          temperature={weatherData.current.temp_c.toString()}
        />
        <Forecast />
        <Details />
      </div>
    );
  };

  return (
    <div className="weather">
      {renderWeather()}
    </div>
  );
}

export default App;
