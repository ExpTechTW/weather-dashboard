import { useEffect, useState } from 'react';
import { ArrowUp, Cloud, CloudDrizzle, CloudFog, CloudLightning, CloudMoon, CloudRain, CloudSnow, CloudSun, Cloudy, Droplet, Moon, Snowflake, Sun, Thermometer } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

import pkg from '@/../package.json';

import type { FC } from 'react';
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

const WeatherCard: FC = () => {
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

  return (
    <div className={`
      flex flex-col gap-4 overflow-hidden rounded-lg border border-gray-700
      bg-gray-900 p-2
      lg:p-4
    `}
    >
      <div className={`
        flex items-center justify-between text-xs text-gray-300
        sm:text-sm
      `}
      >
        <span className="truncate pl-2">
          v
          {pkg.version}
        </span>
        {weatherData && (
          <span className="truncate">
            {weatherData.weather.station.county}
            {weatherData.weather.station.town}
          </span>
        )}
      </div>

      {weatherData && (
        <div className="flex items-center justify-center gap-4 text-white">
          <div className="flex flex-col items-center">
            <WeatherIcon className={`
              h-8 w-8
              lg:h-12 lg:w-12
            `}
            />
            <span className={`
              text-xs
              lg:text-sm
            `}
            >
              {weatherData.weather.data.weather}
            </span>
          </div>
          <div className="text-5xl font-extrabold">
            {weatherData.weather.data.air.temperature.toFixed(1)}
            °
          </div>
        </div>
      )}

      {weatherData && (
        <div className={`
          grid grid-cols-2 gap-x-4 text-xs text-white
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
                最高
              </div>
              <strong>
                {weatherData.weather.daily.high.temperature.toFixed(1)}
                °
              </strong>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Thermometer className={`
                  h-3 w-3 text-blue-400
                  lg:h-4 lg:w-4
                `}
                />
                最低
              </div>
              <span className="font-bold">
                {weatherData.weather.daily.low.temperature.toFixed(1)}
                °
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
              <strong>
                {weatherData.weather.data.air.relative_humidity}
                %
              </strong>
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
              <strong>
                {weatherData.weather.data.wind.speed.toFixed(1)}
                m/s
              </strong>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
WeatherCard.displayName = 'WeatherCard';

export default WeatherCard;
