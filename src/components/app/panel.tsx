import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

import WeatherCard from '@/components/app/weather-header';
import BlurredMap from '@/components/blurred-map';
import WeatherMap from '@/components/map/local-alert';
// import RadarMap from '@/components/map/radar';
// import TsunamiMap from '@/components/map/tsunami';

export function DashboardPanel() {
  const Clock = dynamic(() => import('@/components/app/clock'), {
    ssr: false,
  });
  const [currentMapIndex, setCurrentMapIndex] = useState(0);

  const maps = [
    // <RadarMap key="radar" />,
    // <TsunamiMap key="tsunami" />,
    <BlurredMap key="blurred" isBlurred={false}>
      <WeatherMap />
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
      <div
        className={`
          flex flex-col space-y-2 p-2
          lg:space-y-4 lg:p-4
        `}
      >
        <div className="flex flex-col gap-2">
          <Clock />
          <WeatherCard />
        </div>
      </div>

      <div className="col-span-3">{maps[currentMapIndex]}</div>
    </div>
  );

  return <div className="h-screen w-screen">{panelContent}</div>;
}

export default DashboardPanel;
