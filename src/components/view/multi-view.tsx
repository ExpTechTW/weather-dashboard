'use client';

import { useState } from 'react';

import { DashboardPanel } from '@/app/dashboard/panel';
import WeatherAlert from '@/modal/weather';
import { BaseMap } from '@/components/map/base';
import RadarMap from '@/components/map/radar';
import BlurredMap from '@/components/blurred-map';

export function MultiViewDashboard() {
  const [alerts1, setAlerts1] = useState<WeatherAlert[]>([]);

  return (
    <>
      <DashboardPanel alerts={alerts1} onAlertsChange={setAlerts1} />
      <BlurredMap isBlurred={true}>
        <BaseMap />
      </BlurredMap>
      <RadarMap />
      <BlurredMap isBlurred={true}>
        <BaseMap />
      </BlurredMap>
    </>
  );
}
