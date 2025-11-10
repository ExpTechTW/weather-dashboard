import { getTyphoonCategory, getWindSpeedColor } from '@/lib/typhoon';

import type { FixPoint, TyphoonData } from '@/modal/typhoon';

interface InfoPanelProps {
  typhoon: TyphoonData;
  currentFix: FixPoint;
}

export function InfoPanel({ typhoon, currentFix }: InfoPanelProps) {
  const windSpeed = parseInt(currentFix.max_wind_speed);
  const category = getTyphoonCategory(windSpeed);
  const color = getWindSpeedColor(windSpeed);

  return (
    <div className={`
      absolute top-2 left-2 flex flex-col space-y-2
      lg:top-4 lg:left-4
    `}
    >
      <div className={`
        bg-opacity-80 inline-flex w-fit items-center gap-1 rounded-lg
        bg-gray-800 px-3 py-2 shadow-xl
        lg:gap-2 lg:px-4 lg:py-2.5
      `}
      >
        <span className="text-xl font-bold text-white">🌀 颱風路徑</span>
      </div>
      <div className={`
        bg-opacity-80 rounded-lg bg-gray-800 p-3 text-white shadow-xl
      `}
      >
        <div className="space-y-2">
          <div className="text-lg font-bold">
            {typhoon.typhoon_name}
            {' '}
            (
            {typhoon.cwa_typhoon_name}
            )
          </div>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between gap-4">
              <span className="text-gray-300">年份:</span>
              <span className="font-semibold">{typhoon.year}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-gray-300">編號:</span>
              <span className="font-semibold">{typhoon.cwa_ty_no}</span>
            </div>
            <div className="mt-2 border-t border-gray-700 pt-2">
              <div
                className="inline-block rounded px-2 py-1 text-xs font-bold"
                style={{ backgroundColor: color }}
              >
                {category}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
