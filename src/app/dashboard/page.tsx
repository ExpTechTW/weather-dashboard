'use client';

import { Suspense } from 'react';

import { DashboardPanel } from '@/components/app/panel';

export default function DashboardPage() {
  return (
    <Suspense>
      <DashboardPanel />
    </Suspense>
  );
}
