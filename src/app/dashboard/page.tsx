'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

import OrientationHandler from '@/components/orientation-handler';
import { SingleViewDashboard } from '@/components/view/single-view';
import { MultiViewDashboard } from '@/components/view/multi-view';

function DashboardContent() {
  const searchParams = useSearchParams();
  const isMixinMode = searchParams.get('mode') === 'mixin';

  return isMixinMode
    ? (
        <div className="grid h-screen w-screen grid-cols-2 grid-rows-2">
          <MultiViewDashboard />
        </div>
      )
    : (
        <SingleViewDashboard />
      );
}

export default function DashboardPage() {
  return (
    <OrientationHandler>
      <Suspense fallback={<div>Loading...</div>}>
        <DashboardContent />
      </Suspense>
    </OrientationHandler>
  );
}
