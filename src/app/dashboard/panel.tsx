'use client';

import Clock from '@/components/clock';
import WeatherAlerts from '@/components/weather-alert';
import WeatherAlert from '@/modal/weather';
import BlurredMap from '@/components/blurred-map';
import { BaseMap } from '@/components/map/base';

interface DashboardPanelProps {
  alerts: WeatherAlert[];
  onAlertsChange: (alerts: WeatherAlert[]) => void;
}

export function DashboardPanel({
  alerts,
  onAlertsChange,
}: DashboardPanelProps) {
  const panelContent = (
    <div className="grid h-full w-full grid-cols-4 overflow-hidden bg-gray-900">
      <div className={`
        flex flex-col space-y-2 p-2
        lg:space-y-4 lg:p-4
      `}
      >
        <div className="relative">
          <Clock />
        </div>

        <div className="flex-grow" />

        <WeatherAlerts
          alerts={alerts}
          onAlertsChange={onAlertsChange}
        />
      </div>

      <div className="col-span-3">
        <BlurredMap isBlurred={true}>
          <BaseMap />
        </BlurredMap>
      </div>
    </div>
  );

  return (
    <div className="h-screen w-screen">
      {panelContent}
    </div>
  );
}
