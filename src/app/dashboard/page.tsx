'use client';

import { Suspense, useState } from 'react';

import { DashboardPanel } from '@/components/app/dashboard/panel';
import OrientationHandler from '@/components/orientation-handler';
import WeatherAlert from '@/modal/weather';

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
