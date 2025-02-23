import { useState } from 'react';
import { Droplet, Gauge } from 'lucide-react';

import type { FC } from 'react';

interface LocalData {
  temperature: number;
  pressure: number;
  humidity: number;
}

const LocalCard: FC = () => {
  const [localData] = useState<LocalData>({
    temperature: 23.9,
    pressure: 1008,
    humidity: 80,
  });

  return (
    <div className={`
      flex flex-col gap-4 overflow-hidden rounded-lg border border-gray-700
      bg-gray-900 p-2
      lg:p-4
    `}
    >

      {localData && (
        <div className="flex items-center justify-center gap-4 text-white">
          <div className="text-5xl font-extrabold">
            {localData.temperature.toFixed(1)}
            °
          </div>
        </div>
      )}

      {localData && (
        <div className={`
          grid grid-cols-2 gap-x-4 text-xs text-white
          lg:text-sm
        `}
        >
          <div className="flex flex-col space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Gauge className={`
                  h-3 w-3 text-yellow-400
                  lg:h-4 lg:w-4
                `}
                />
                氣壓
              </div>
              <strong>
                {localData.pressure}
                {' '}
                hPa
              </strong>
            </div>
          </div>

          <div className="flex flex-col space-y-1 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Droplet className={`
                  h-3 w-3 text-blue-400
                  lg:h-4 lg:w-4
                `}
                />
                <span>濕度</span>
              </div>
              <strong>
                {localData.humidity}
                %
              </strong>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
LocalCard.displayName = 'LocalCard';

export default LocalCard;
