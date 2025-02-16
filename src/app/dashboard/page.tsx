'use client';

import { Suspense, useState } from 'react';

import Clock from '@/components/clock';
import WeatherAlerts from '@/components/weather-alert';
import RadarMap from '@/components/map/radar';
import OrientationHandler from '@/components/orientation-handler'; // 請確保路徑正確
import WeatherAlert from '@/modal/weather';

export default function DashBoard() {
  const [alerts, setAlerts] = useState<WeatherAlert[]>([]);

  return (
    <OrientationHandler>
      <Suspense fallback={<div>Loading...</div>}>
        <div className="flex h-screen w-screen overflow-hidden bg-gray-900">
          <div className={`
            flex min-w-[280px] max-w-[320px] flex-col space-y-4 p-4
            lg:w-96 lg:space-y-6 lg:p-6
          `}
          >
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
            <RadarMap />
          </div>
        </div>
      </Suspense>
    </OrientationHandler>
  );
}
