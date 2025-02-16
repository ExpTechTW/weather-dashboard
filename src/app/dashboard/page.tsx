'use client';

import { Suspense, useState } from 'react';

import OrientationHandler from '@/components/orientation-handler';
import WeatherAlert from '@/modal/weather';

import { DashboardPanel } from './panel';

export default function DashboardPage() {
  const [alerts, setAlerts] = useState<WeatherAlert[]>([]);

  return (
    <OrientationHandler>
      <Suspense fallback={<div>Loading...</div>}>
        <DashboardPanel
          alerts={alerts}
          onAlertsChange={setAlerts}
        />
      </Suspense>
    </OrientationHandler>
  );
}
