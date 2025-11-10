import type { FixPoint } from '@/modal/typhoon';

interface TyphoonPopupContentProps {
  fix: FixPoint;
  typhoonCategory: string;
}

export function TyphoonPopupContent({ fix, typhoonCategory }: TyphoonPopupContentProps) {
  return (
    <div className="min-w-[200px] rounded-lg bg-gray-800 p-2 text-white">
      <div className="mb-2 text-sm font-bold">
        {new Date(fix.fix_time).toLocaleString('zh-TW', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        })}
      </div>
      <div className="flex flex-col gap-1 text-xs">
        <div className="flex justify-between">
          <span>颱風等級:</span>
          <span className="font-bold">{typhoonCategory}</span>
        </div>
        <div className="flex justify-between">
          <span>最大風速:</span>
          <span className="font-bold text-red-500">
            {fix.max_wind_speed}
            {' '}
            m/s
          </span>
        </div>
        <div className="flex justify-between">
          <span>最大陣風:</span>
          <span className="font-bold text-orange-500">
            {fix.max_gust_speed}
            {' '}
            m/s
          </span>
        </div>
        <div className="flex justify-between">
          <span>中心氣壓:</span>
          <span>
            {fix.pressure}
            {' '}
            hPa
          </span>
        </div>
        <div className="flex justify-between">
          <span>移動速度:</span>
          <span>
            {fix.moving_speed}
            {' '}
            km/h
          </span>
        </div>
        <div className="flex justify-between">
          <span>移動方向:</span>
          <span>{fix.moving_direction}</span>
        </div>
      </div>
    </div>
  );
}
