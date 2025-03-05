'use client';

import { useState } from 'react';

import { DashboardPanel } from '@/components/app/panel';

import WeatherAlert from '@/modal/weather';

export default function DashboardPage() {
  const [alerts, setAlerts] = useState<WeatherAlert[]>([]);

  return (
    <DashboardPanel
      alerts={alerts}
      onAlertsChange={setAlerts}
    />
  );
}
