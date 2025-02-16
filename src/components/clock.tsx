import { useEffect, useState } from 'react';
import { Cloud, CloudDrizzle, CloudFog, CloudLightning, CloudMoon, CloudRain, CloudSnow, CloudSun, Cloudy, Droplet, Moon, Snowflake, Sun, Wind } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

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
  const searchParams = useSearchParams();
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
        const response = await fetch(`https://api-1.exptech.dev/api/v2/weather/realtime/${searchParams.get('region') || '711'}`);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const data = (await response.json()) as WeatherData;

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
      mx-auto w-full rounded-lg border border-gray-700 bg-gray-900 p-2 text-xs
      text-gray-300 shadow-lg
      lg:max-w-xs lg:p-4 lg:text-sm
    `}
    >
      <div className={`
        flex items-center justify-between text-xs
        lg:text-sm
      `}
      >
        <span className="truncate">{new Date().toLocaleDateString('zh-TW', { month: 'long', day: 'numeric', weekday: 'short' })}</span>
        {weatherData && (
          <span className="truncate pl-2">
            {weatherData.weather.station.county}
            {' '}
            {weatherData.weather.station.town}
          </span>
        )}
      </div>

      {weatherData && (
        <div className={`
          mt-1.5 flex items-center justify-between
          lg:mt-2
        `}
        >
          <div className="flex flex-col items-center justify-center space-y-1">
            <WeatherIcon className={`
              h-8 w-8 text-blue-400
              lg:h-12 lg:w-12
            `}
            />
            <span className={`
              text-center text-xs font-medium
              lg:text-base
            `}
            >
              {weatherData.weather.data.weather}
            </span>
          </div>

          <div className="flex flex-col items-center justify-center">
            <span className={`
              text-base font-bold text-red-400
              lg:text-xl
            `}
            >
              {weatherData.weather.daily.high.temperature.toFixed(1)}
              °C
            </span>
            <span className={`
              text-xs font-bold text-blue-400
              lg:text-base
            `}
            >
              {weatherData.weather.daily.low.temperature.toFixed(1)}
              °C
            </span>
          </div>

          <div className={`
            text-2xl font-extrabold text-cyan-400
            lg:text-3xl
          `}
          >
            {weatherData.weather.data.air.temperature.toFixed(1)}
            °C
          </div>
        </div>
      )}

      <div className={`
        mt-1.5 flex justify-between text-xs
        lg:mt-2 lg:text-sm
      `}
      >
        <div className="flex items-center gap-1">
          <Droplet className={`
            h-3 w-3 text-blue-400
            lg:h-4 lg:w-4
          `}
          />
          <span className="whitespace-nowrap">
            濕度:
            {' '}
            {weatherData?.weather.data.air.relative_humidity}
            %
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Wind className={`
            h-3 w-3 text-green-400
            lg:h-4 lg:w-4
          `}
          />
          <span className="whitespace-nowrap">
            風速:
            {' '}
            {weatherData?.weather.data.wind.speed.toFixed(1)}
            {' '}
            m/s
          </span>
        </div>
      </div>

      <div className={`
        mt-1.5 text-center text-3xl font-bold tracking-wider text-white
        lg:mt-2 lg:text-6xl
      `}
      >
        {time || '--:--:--'}
      </div>
    </div>
  );
}

export default Clock;
