import { getTyphoonCategory } from '@/lib/typhoon';

import type { FixPoint } from '@/modal/typhoon';

interface CurrentInfoProps {
  currentFix: FixPoint;
  currentPointIndex: number;
  totalPoints: number;
}

export function CurrentInfo({ currentFix, currentPointIndex, totalPoints }: CurrentInfoProps) {
  const windSpeed = parseInt(currentFix.max_wind_speed);
  const category = getTyphoonCategory(windSpeed);

  return (
    <div className={`
      absolute top-2 right-2 flex flex-col space-y-2
      lg:top-4 lg:right-4
    `}
    >
      <div className={`
        bg-opacity-80 rounded-lg bg-gray-800 p-3 text-white shadow-xl
      `}
      >
        <div className="space-y-2">
          <div className="text-lg font-bold">
            {currentPointIndex === totalPoints - 1 ? '最新位置' : '歷史位置'}
          </div>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between gap-4">
              <span className="text-gray-300">時間:</span>
              <span className="font-semibold">
                {new Date(currentFix.fix_time).toLocaleString('zh-TW', {
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-gray-300">等級:</span>
              <span className="font-semibold">{category}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-gray-300">最大風速:</span>
              <span className="font-semibold text-red-400">
                {currentFix.max_wind_speed}
                {' '}
                m/s
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-gray-300">中心氣壓:</span>
              <span className="font-semibold">
                {currentFix.pressure}
                {' '}
                hPa
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
