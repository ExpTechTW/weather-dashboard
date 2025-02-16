'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';

import Clock from '@/components/clock';
import WeatherAlert from '@/modal/weather';
import WeatherAlerts from '@/components/weather-alert';
import BlurredMap from '@/components/blurred-map';

const MapComponent = dynamic(() => import('@/components/map'), {
  ssr: false,
});

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
