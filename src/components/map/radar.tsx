'use client';

import { useEffect, useState } from 'react';
import { Map, RasterTileSource } from 'maplibre-gl';
import { Clock, Cloud } from 'lucide-react';

import { BaseMap } from '@/components/map/base';

const RADAR_API = 'https://api.exptech.dev/api/v1/tiles/radar/list';
const TILE_URL = 'https://api-1.exptech.dev/api/v1/tiles/radar';

function RadarMap() {
  const [radarTimes, setRadarTimes] = useState<string[]>([]);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [map, setMap] = useState<Map | null>(null);

  useEffect(() => {
    async function fetchRadarTimes() {
      try {
        const response = await fetch(RADAR_API);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const timeList: string[] = await response.json();
        setRadarTimes(timeList.slice(-12));
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
        paint: { 'raster-opacity': 0.7 },
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
    }, 500);

    return () => clearInterval(interval);
  }, [map, radarTimes, currentFrame]);

  function formatRadarTime(timestamp: string): string {
    const date = new Date(parseInt(timestamp));
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  }

  return (
    <div className="relative h-full w-full">
      <BaseMap onMapLoaded={setMap} />

      <div className="absolute left-4 top-4 flex flex-col space-y-2">
        <div className="rounded-lg bg-white/10 p-4 shadow-lg backdrop-blur-md">
          <div className="flex items-center space-x-2">
            <Clock className="h-6 w-6 text-white" />
            <span className="text-lg font-bold text-white">
              {radarTimes.length > 0 ? formatRadarTime(radarTimes[currentFrame]) : '載入中...'}
            </span>
          </div>
          <div className={`
            mt-2 h-2 w-48 overflow-hidden rounded-full bg-gray-600/50
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
          inline-flex w-fit items-center gap-2 rounded-lg bg-white/10 px-3 py-2
          shadow-lg backdrop-blur-md
        `}
        >
          <Cloud className="h-5 w-5 text-white" />
          <span className="text-sm font-medium text-white">
            雷達合成回波圖
          </span>
        </div>
      </div>
    </div>
  );
}

export default RadarMap;
