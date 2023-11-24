import Current from './components/current/current';
import Details from './components/details/details';
import Forecast from './components/forecast/forecast';
import './styles/main.css';

function App() {
  return (
    <div className="weather">
      <div className="weather__inner">
        <Current city="Калининград" description="Дождь" temperature="4" />

        <Forecast />

        <Details />
      </div>
    </div>
  );
}

export default App;
