import React, { useEffect, useState } from 'react';

import WeatherHeader from '@/components/app/dashboard/weather-header';
import WeatherAlerts from '@/components/weather-alert';
import WeatherAlert from '@/modal/weather';
import RadarMap from '@/components/map/radar';
// import TsunamiMap from '@/components/map/tsunami';
import BlurredMap from '@/components/blurred-map';
import { BaseMap } from '@/components/map/base';

import Clock from './clock';

interface DashboardPanelProps {
  alerts: WeatherAlert[];
  onAlertsChange: (alerts: WeatherAlert[]) => void;
}

export function DashboardPanel({
  alerts,
  onAlertsChange,
}: DashboardPanelProps) {
  const [currentMapIndex, setCurrentMapIndex] = useState(0);

  const maps = [
    <RadarMap key="radar" />,
    // <TsunamiMap key="tsunami" />,
    <BlurredMap key="blurred" isBlurred={true}>
      <BaseMap />
    </BlurredMap>,
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMapIndex((prevIndex) => (prevIndex + 1) % maps.length);
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const panelContent = (
    <div className="grid h-full w-full grid-cols-4 overflow-hidden bg-gray-900">
      <div className={`
        flex flex-col space-y-2 p-2
        lg:space-y-4 lg:p-4
      `}
      >
        <div className="flex flex-col gap-2">
          <Clock />
          <WeatherHeader />
        </div>

        <div className="mt-auto">
          <WeatherAlerts
            alerts={alerts}
            onAlertsChange={onAlertsChange}
          />
        </div>
      </div>

      <div className="col-span-3">
        {maps[currentMapIndex]}
      </div>
    </div>
  );

  return (
    <div className="h-screen w-screen">
      {panelContent}
    </div>
  );
}

export default DashboardPanel;
