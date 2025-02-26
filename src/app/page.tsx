'use client';

import { useState } from 'react';

import WeatherAlert from '@/modal/weather';
import { DashboardPanel } from '@/components/app/panel';

export default function DashboardPage() {
  const [alerts, setAlerts] = useState<WeatherAlert[]>([]);

  return (
    <DashboardPanel
      alerts={alerts}
      onAlertsChange={setAlerts}
    />
  );
}
