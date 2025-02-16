'use client';

import { useState } from 'react';

import { DashboardPanel } from '@/app/dashboard/panel';
import WeatherAlert from '@/modal/weather';

export function SingleViewDashboard() {
  const [alerts, setAlerts] = useState<WeatherAlert[]>([]);

  return (
    <DashboardPanel
      alerts={alerts}
      onAlertsChange={setAlerts}
    />
  );
}
