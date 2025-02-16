'use client';

import { useEffect, useState } from 'react';
import { Map, RasterTileSource } from 'maplibre-gl';
import { Clock, Cloud } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

import { BaseMap } from '@/components/map/base';

const RADAR_API = 'https://api.exptech.dev/api/v1/tiles/radar/list';
const TILE_URL = 'https://api-1.exptech.dev/api/v1/tiles/radar';

function RadarMap() {
  const searchParams = useSearchParams();
  const [radarTimes, setRadarTimes] = useState<string[]>([]);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [map, setMap] = useState<Map | null>(null);

  useEffect(() => {
    async function fetchRadarTimes() {
      try {
        const response = await fetch(RADAR_API);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const timeList = (await response.json()) as string[];

        setRadarTimes(timeList.slice(-6 * Number(searchParams.get('radar-dispaly-hours') || '1')));
      }
      catch (error) {
        console.error('Error fetching radar times:', error instanceof Error ? error.message : error);
      }
    }

    void fetchRadarTimes();

    const interval = setInterval(() => {
      void fetchRadarTimes();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!map || radarTimes.length === 0) return;

    map.dragRotate.disable();
    map.dragPan.disable();
    map.scrollZoom.disable();
    map.boxZoom.disable();
    map.doubleClickZoom.disable();
    map.touchZoomRotate.disable();
    map.keyboard.disable();

    map.fitBounds([[118.0, 21.2], [124.0, 25.8]], { padding: 20, duration: 0 });

    if (!map.getSource('radarTiles')) {
      map.addSource('radarTiles', {
        type: 'raster',
        tiles: [`${TILE_URL}/${radarTimes[0]}/{z}/{x}/{y}.png`],
        tileSize: 256,
      });

      map.addLayer({
        id: 'radarLayer',
        type: 'raster',
        source: 'radarTiles',
        paint: { 'raster-opacity': 1 },
      });
    }

    const interval = setInterval(() => {
      setCurrentFrame((prev) => (prev + 1) % radarTimes.length);

      const source = map.getSource('radarTiles');
      if (source && 'setTiles' in source) {
        (source as RasterTileSource).setTiles([
          `${TILE_URL}/${radarTimes[currentFrame]}/{z}/{x}/{y}.png`,
        ]);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [map, radarTimes, currentFrame]);

  function formatRadarTime(timestamp: string): string {
    const date = new Date(parseInt(timestamp));
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  }

  return (
    <div className="relative h-full w-full">
      <BaseMap onMapLoaded={setMap} />

      <div className={`
        absolute left-2 top-2 flex flex-col space-y-2
        lg:left-4 lg:top-4
      `}
      >
        <div className={`
          rounded-lg bg-white/10 p-2 shadow-lg backdrop-blur-md
          lg:p-4
        `}
        >
          <div className="flex items-center space-x-2">
            <Clock className={`
              h-4 w-4 text-white
              lg:h-6 lg:w-6
            `}
            />
            <span className={`
              text-base font-bold text-white
              lg:text-lg
            `}
            >
              {radarTimes.length > 0 ? formatRadarTime(radarTimes[currentFrame]) : '載入中...'}
            </span>
          </div>
          <div className={`
            mt-1 h-1.5 w-32 overflow-hidden rounded-full bg-gray-600/50
            lg:mt-2 lg:h-2 lg:w-48
          `}
          >
            <div
              className={`
                h-full rounded-full bg-blue-400 transition-all duration-300
              `}
              style={{ width: `${((currentFrame + 1) / radarTimes.length) * 100}%` }}
            />
          </div>
        </div>

        <div className={`
          inline-flex w-fit items-center gap-1 rounded-lg bg-white/10 px-2
          py-1.5 shadow-lg backdrop-blur-md
          lg:gap-2 lg:px-3 lg:py-2
        `}
        >
          <Cloud className={`
            h-4 w-4 text-white
            lg:h-5 lg:w-5
          `}
          />
          <span className={`
            text-xs font-medium text-white
            lg:text-sm
          `}
          >
            雷達合成回波圖
          </span>
        </div>
      </div>
    </div>
  );
}

export default RadarMap;
