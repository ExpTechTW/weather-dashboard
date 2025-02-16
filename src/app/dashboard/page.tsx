'use client';

import dynamic from 'next/dynamic';
import { ReactNode, useEffect, useState } from 'react';

const MapComponent = dynamic(() => import('@/components/map'), {
  ssr: false,
});

interface WeatherAlert {
  title: string;
  description: string;
  type: 'rain' | 'wind' | 'temperature' | 'typhoon';
  severity: 'warning' | 'alert' | 'notice';
}

interface WeatherAlertsProps {
  alerts: WeatherAlert[];
  onAlertsChange: (alerts: WeatherAlert[]) => void;
}

interface BlurredMapProps {
  children: ReactNode;
  isBlurred: boolean;
}

// 示範警報資料
const sampleAlerts: WeatherAlert[] = [
  // {
  //   title: '大雨特報',
  //   description: '東部地區及恆春半島有局部大雨發生的機率，請注意瞬間大雨、雷擊及強陣風。累積雨量24小時可達80毫米以上。',
  //   type: 'rain',
  //   severity: 'warning',
  // },
  // {
  //   title: '強風特報',
  //   description: '東北季風增強，北部、東北部（含蘭嶼、綠島）、澎湖、金門、馬祖沿海及空曠地區易有9至10級強陣風。',
  //   type: 'wind',
  //   severity: 'alert',
  // },
  // {
  //   title: '低溫特報',
  //   description: '台灣北部及中部地區氣溫可能降至攝氏10度以下，請注意保暖。',
  //   type: 'temperature',
  //   severity: 'notice',
  // },
];

function Clock() {
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    setTime(
      new Date().toLocaleTimeString('zh-TW', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }),
    );

    const timer = setInterval(() => {
      setTime(
        new Date().toLocaleTimeString('zh-TW', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        }),
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className={`
      rounded-lg border border-gray-700 bg-gray-800/80 p-8 shadow-lg
    `}
    >
      <div className="space-y-4">
        <div className="mb-2 flex items-center justify-between text-gray-300">
          <div className="text-xl">
            {new Date().toLocaleDateString('zh-TW', {
              month: 'long',
              day: 'numeric',
            })}
            <span className="ml-2">
              {new Date().toLocaleDateString('zh-TW', { weekday: 'short' })}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-cyan-400">24°C</span>
            <span className="text-blue-400">78%</span>
          </div>
        </div>

        <div
          className="text-6xl font-bold tracking-wider text-white"
          suppressHydrationWarning
        >
          {time || '--:--:--'}
        </div>
      </div>
    </div>
  );
}

function WeatherAlerts({ alerts, onAlertsChange }: WeatherAlertsProps) {
  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 100));
        // 使用示範資料
        onAlertsChange(sampleAlerts);
      }
      catch (error) {
        console.error('Error fetching alerts:', error);
      }
    };

    void fetchAlerts();
  }, [onAlertsChange]);

  if (alerts.length === 0) {
    return null;
  }

  const getAlertColor = (severity: WeatherAlert['severity']) => {
    switch (severity) {
      case 'warning':
        return 'bg-red-900/50';
      case 'alert':
        return 'bg-yellow-900/50';
      case 'notice':
        return 'bg-blue-900/50';
      default:
        return 'bg-gray-900/50';
    }
  };

  const getTextColor = (severity: WeatherAlert['severity']) => {
    switch (severity) {
      case 'warning':
        return 'text-red-300';
      case 'alert':
        return 'text-yellow-300';
      case 'notice':
        return 'text-blue-300';
      default:
        return 'text-gray-300';
    }
  };

  return (
    <div className="rounded-lg bg-gray-800 p-6 shadow-lg">
      <h2 className="mb-4 text-xl font-bold text-gray-100">天氣警報資訊</h2>
      <div className="space-y-4">
        {alerts.map((alert, index) => (
          <div
            key={index}
            className={`
              rounded-lg
              ${getAlertColor(alert.severity)}
              p-4
            `}
          >
            <h3 className={`
              font-semibold
              ${getTextColor(alert.severity)}
            `}
            >
              {alert.title}
            </h3>
            <p className="mt-2 text-sm text-gray-300">{alert.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function BlurredMap({ children, isBlurred }: BlurredMapProps) {
  return (
    <div className="relative h-full w-full">
      {children}
      {isBlurred && (
        <div className={`
          absolute inset-0 flex items-center justify-center backdrop-blur-sm
        `}
        >
          <div className="rounded-lg bg-gray-800 p-6 text-center">
            <p className="text-xl font-bold text-white">
              目前指定區域沒有正在生效的天氣警特報
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function DashBoard() {
  const [alerts, setAlerts] = useState<WeatherAlert[]>([]);

  return (
    <div className="flex h-screen w-screen bg-gray-900">
      <div className="flex w-96 flex-col space-y-6 p-6">
        <div className="relative">
          <Clock />
        </div>

        <div className="flex-grow" />

        <WeatherAlerts
          alerts={alerts}
          onAlertsChange={setAlerts}
        />
      </div>

      <div className="flex-1">
        <BlurredMap isBlurred={alerts.length === 0}>
          <MapComponent />
        </BlurredMap>
      </div>
    </div>
  );
}
