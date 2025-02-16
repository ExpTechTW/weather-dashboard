'use client';

import { Suspense, useState } from 'react';

import Clock from '@/components/clock';
import WeatherAlert from '@/modal/weather';
import WeatherAlerts from '@/components/weather-alert';
import RadarMap from '@/components/map/radar';

export default function DashBoard() {
  const [alerts, setAlerts] = useState<WeatherAlert[]>([]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
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
          {/* <BlurredMap isBlurred={alerts.length === 0}>
          <BaseMap />
        </BlurredMap> */}
          <RadarMap />
        </div>
      </div>
    </Suspense>
  );
}
