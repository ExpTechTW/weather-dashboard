'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const MapComponent = dynamic(() => import('@/components/map'), {
  ssr: false,
});

function Clock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={`
      rounded-lg border border-gray-700 bg-gray-800/80 p-8 shadow-lg
      backdrop-blur-sm
    `}
    >
      <div className="space-y-4">
        {/* 日期和溫度濕度行 */}
        <div className="mb-2 flex items-center justify-between text-gray-300">
          <div className="text-xl">
            {time.toLocaleDateString('zh-TW', {
              month: 'long',
              day: 'numeric',
            })}
            <span className="ml-2">
              {time.toLocaleDateString('zh-TW', { weekday: 'short' })}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-cyan-400">24°C</span>
            <span className="text-blue-400">78%</span>
          </div>
        </div>

        {/* 時間行 */}
        <div className="text-6xl font-bold tracking-wider text-white">
          {time.toLocaleTimeString('zh-TW', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
          })}
        </div>
      </div>
    </div>
  );
}

function WeatherAlerts() {
  return (
    <div className="rounded-lg bg-gray-800 p-6 shadow-lg">
      <h2 className="mb-4 text-xl font-bold text-gray-100">天氣警報資訊</h2>
      <div className="space-y-4">
        <div className="rounded-lg bg-red-900/50 p-4">
          <h3 className="font-semibold text-red-300">強風特報</h3>
          <p className="mt-2 text-sm text-gray-300">
            台灣北部地區今日下午將出現強風，請注意防範。
          </p>
        </div>
        <div className="rounded-lg bg-yellow-900/50 p-4">
          <h3 className="font-semibold text-yellow-300">大雨特報</h3>
          <p className="mt-2 text-sm text-gray-300">
            東部地區預計降雨量達80mm，請做好防護準備。
          </p>
        </div>
      </div>
    </div>
  );
}

export default function DashBoard() {
  return (
    <div className="flex h-screen w-screen bg-gray-900">
      {/* 左側面板 */}
      <div className="flex w-96 flex-col space-y-6 p-6">
        {/* 時鐘區域 */}
        <div className="relative">
          <Clock />
        </div>

        {/* 彈性空間 */}
        <div className="flex-grow" />

        {/* 警報資訊區域 */}
        <WeatherAlerts />
      </div>

      {/* 右側地圖 */}
      <div className="flex-1">
        <MapComponent />
      </div>
    </div>
  );
}
