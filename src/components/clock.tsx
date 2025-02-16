import { useEffect, useState } from 'react';
import { Cloud, CloudDrizzle, CloudFog, CloudLightning, CloudMoon, CloudRain, CloudSnow, CloudSun, Cloudy, Droplet, Moon, Snowflake, Sun, Wind } from 'lucide-react';

import type { LucideIcon } from 'lucide-react';

interface WeatherData {
  weather: {
    code: number;
    is_day: number;
    station: { county: string; town: string };
    data: {
      weather: string;
      wind: { speed: number };
      air: { temperature: number; relative_humidity: number };
    };
    daily: {
      high: { temperature: number };
      low: { temperature: number };
    };
  };
}

function Clock() {
  const [time, setTime] = useState<string>('');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);

  const getWeatherIcon = (code: number, isDay: number): LucideIcon => {
    const iconMap: Record<number, LucideIcon> = {
      100: isDay ? Sun : Moon,
      103: CloudLightning,
      105: CloudFog,
      106: CloudRain,
      107: CloudSnow,
      108: Snowflake,
      111: CloudDrizzle,
      114: CloudLightning,
      200: isDay ? CloudSun : CloudMoon,
      300: Cloudy,
    };
    return iconMap[code] || Cloud;
  };

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch('https://api-1.exptech.dev/api/v2/weather/realtime/711');
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data: WeatherData = await response.json();
        setWeatherData(data);
      }
      catch (error) {
        console.error('Error fetching weather:', error);
      }
    };

    void fetchWeather();
    const weatherTimer = setInterval(() => void fetchWeather(), 60000);
    return () => clearInterval(weatherTimer);
  }, []);

  useEffect(() => {
    const updateTime = () => {
      setTime(new Date().toLocaleTimeString('zh-TW', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }));
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const WeatherIcon = weatherData ? getWeatherIcon(weatherData.weather.code, weatherData.weather.is_day) : Cloud;

  return (
    <div className={`
      mx-auto max-w-xs rounded-lg border border-gray-700 bg-gray-900 p-4 text-sm
      text-gray-300 shadow-lg
    `}
    >
      <div className="flex items-center justify-between">
        <span>{new Date().toLocaleDateString('zh-TW', { month: 'long', day: 'numeric', weekday: 'short' })}</span>
        {weatherData && (
          <span>
            {weatherData.weather.station.county}
            {' '}
            {weatherData.weather.station.town}
          </span>
        )}
      </div>
      {weatherData && (
        <div className="mt-2 flex items-center justify-between">
          <div className="flex flex-col items-center text-base">
            <WeatherIcon className="h-12 w-12 text-blue-400" />
            <span className="text-lg font-medium">{weatherData.weather.data.weather}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xl font-bold text-red-400">
              {weatherData.weather.daily.high.temperature.toFixed(1)}
              °C
            </span>
            <span className="text-base font-bold text-blue-400">
              {weatherData.weather.daily.low.temperature.toFixed(1)}
              °C
            </span>
          </div>
          <div className="text-4xl font-extrabold text-cyan-400">
            {weatherData.weather.data.air.temperature.toFixed(1)}
            °C
          </div>
        </div>
      )}
      <div className="mt-2 flex justify-between text-base">
        <div className="flex items-center gap-1">
          <Droplet className="h-4 w-4 text-blue-400" />
          <span>
            濕度:
            {weatherData?.weather.data.air.relative_humidity}
            %
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Wind className="h-4 w-4 text-green-400" />
          <span>
            風速:
            {weatherData?.weather.data.wind.speed.toFixed(1)}
            {' '}
            m/s
          </span>
        </div>
      </div>
      <div className={`
        mt-2 text-center text-6xl font-bold tracking-wider text-white
      `}
      >
        {time || '--:--:--'}
      </div>
    </div>
  );
}

export default Clock;
