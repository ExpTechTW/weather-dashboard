import { useEffect, useState } from 'react';
import { ArrowUp, Cloud, CloudDrizzle, CloudFog, CloudLightning, CloudMoon, CloudRain, CloudSnow, CloudSun, Cloudy, Droplet, Moon, Snowflake, Sun, Thermometer } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

import type { LucideIcon } from 'lucide-react';

interface WeatherData {
  weather: {
    code: number;
    is_day: number;
    station: { county: string; town: string };
    data: {
      weather: string;
      wind: { speed: number; direction: number };
      air: { temperature: number; relative_humidity: number };
    };
    daily: {
      high: { temperature: number };
      low: { temperature: number };
    };
  };
}

function WeatherHeader() {
  const searchParams = useSearchParams();
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

        const station = (await response.json()) as WeatherData;

        const data: WeatherData = {
          weather: {
            ...station.weather,
            data: {
              ...station.weather.data,
              wind: {
                ...station.weather.data.wind,
                direction: (station.weather.data.wind.direction + 180) % 360,
              },
            },
          },
        };

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

  const WeatherIcon = weatherData ? getWeatherIcon(weatherData.weather.code, weatherData.weather.is_day) : Cloud;

  const dateStr = new Date().toLocaleDateString('zh-TW', {
    month: 'numeric',
    day: 'numeric',
    weekday: 'short',
  }).replace('週', '');

  const baseClasses = 'flex h-full w-full flex-col space-y-2 overflow-hidden rounded-lg border border-gray-700 bg-gray-900 shadow-lg';

  return (
    <div className={`
      ${baseClasses}
      p-2
      lg:p-4
    `}
    >
      <div className={`
        flex items-center justify-between text-xs text-gray-300
        sm:text-sm
      `}
      >
        <span className="truncate pl-2">{dateStr}</span>
        {weatherData && (
          <span className="truncate">
            {weatherData.weather.station.county}
            {weatherData.weather.station.town}
          </span>
        )}
      </div>

      {weatherData && (
        <div className="flex items-center justify-center space-x-4">
          <div className="flex flex-col items-center space-y-1">
            <WeatherIcon className={`
              h-8 w-8 text-blue-400
              lg:h-12 lg:w-12
            `}
            />
            <span className={`
              text-xs text-gray-300
              lg:text-sm
            `}
            >
              {weatherData.weather.data.weather}
            </span>
          </div>
          <div className="text-5xl font-extrabold text-cyan-400">
            {weatherData.weather.data.air.temperature.toFixed(1)}
            °C
          </div>
        </div>
      )}

      {weatherData && (
        <div className={`
          grid grid-cols-2 gap-x-4 text-xs
          lg:text-sm
        `}
        >
          <div className="flex flex-col space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Thermometer className={`
                  h-3 w-3 text-red-400
                  lg:h-4 lg:w-4
                `}
                />
                <span className="font-bold text-red-400">H</span>
              </div>
              <span className="font-bold text-red-400">
                {weatherData.weather.daily.high.temperature.toFixed(1)}
                °C
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Thermometer className={`
                  h-3 w-3 text-blue-400
                  lg:h-4 lg:w-4
                `}
                />
                <span className="font-bold text-blue-400">L</span>
              </div>
              <span className="font-bold text-blue-400">
                {weatherData.weather.daily.low.temperature.toFixed(1)}
                °C
              </span>
            </div>
          </div>

          <div className="flex flex-col space-y-1 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Droplet className={`
                  h-3 w-3 text-blue-400
                  lg:h-4 lg:w-4
                `}
                />
                <span>濕度</span>
              </div>
              <span>
                {weatherData.weather.data.air.relative_humidity}
                %
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <ArrowUp
                  className={`
                    h-3 w-3 text-green-400
                    lg:h-4 lg:w-4
                  `}
                  style={{
                    transform: `rotate(${weatherData.weather.data.wind.direction}deg)`,
                  }}
                />
                <span>風速</span>
              </div>
              <span>
                {weatherData.weather.data.wind.speed.toFixed(1)}
                m/s
              </span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default WeatherHeader;
