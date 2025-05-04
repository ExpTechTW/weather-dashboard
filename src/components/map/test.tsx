import { useCallback, useEffect, useRef, useState } from 'react';

import { BaseMap } from '@/components/map/base';

import type { Map, Popup } from 'maplibre-gl';

const MAP_BOUNDS = [[118.0, 21.2], [124.0, 25.8]] as [[number, number], [number, number]];

const data = {
  4713608: {
    code: 704,
    I: 0.6,
    info: {
      lat: 23.0102131,
      lon: 120.1822197,
    },
    color: '#FF0000',
  },
  4714736: {
    code: 614,
    I: 0.6,
    info: {
      lat: 23.427536,
      lon: 120.187914,
    },
    color: '#00FF00',
  },
};

const data2 = [
  {
    type: 'intensity',
    author: 'trem',
    id: 1746281386215,
    alert: 0,
    serial: 1,
    final: 0,
    area: {
      1: [
        970,
        971,
        973,
      ],
      2: [
        270,
        272,
      ],
    },
    max: 2,
  },
];

export function SpeedEarthquakeMap() {
  const [map, setMap] = useState<Map | null>(null);
  const [isStyleLoaded, setIsStyleLoaded] = useState(false);
  const popupsRef = useRef<Popup[]>([]);
  const [maxIntensity, setMaxIntensity] = useState(0);

  useEffect(() => {
    const maxIntensity = data2.reduce((max, item) => Math.max(max, item.max), 0);
    setMaxIntensity(maxIntensity);
  }, []);

  const setupMap = useCallback((mapInstance: Map) => {
    const interactions = [
      mapInstance.dragRotate,
      mapInstance.dragPan,
      mapInstance.scrollZoom,
      mapInstance.boxZoom,
      mapInstance.doubleClickZoom,
      mapInstance.touchZoomRotate,
      mapInstance.keyboard,
    ];

    interactions.forEach((interaction) => interaction.disable());

    void mapInstance.fitBounds(MAP_BOUNDS, { padding: 20, duration: 0 });
    mapInstance.setMaxZoom(9);

    if (mapInstance.isStyleLoaded()) {
      setIsStyleLoaded(true);
    }
    else {
      void mapInstance.once('style.load', () => {
        setIsStyleLoaded(true);
      });
    }
    setMap(mapInstance);
  }, []);

  useEffect(() => {
    if (!map) return;

    const styleLoadHandler = () => {
      setIsStyleLoaded(true);
    };

    if (map.isStyleLoaded()) {
      setIsStyleLoaded(true);
    }
    else {
      map.on('style.load', styleLoadHandler);
    }

    return () => {
      map.off('style.load', styleLoadHandler);
    };
  }, [map]);

  useEffect(() => {
    if (!map || !isStyleLoaded) return;

    const style = document.createElement('style');
    style.textContent = ``;
    document.head.appendChild(style);

    const colorExpression: Array<unknown> = ['case'];
    Object.values(data).forEach((alert) => {
      colorExpression.push(['==', ['get', 'CODE'], alert.code]);
      colorExpression.push(alert.color);
    });
    colorExpression.push('transparent');

    map.setPaintProperty('town', 'fill-color', colorExpression);

    popupsRef.current.forEach((popup) => popup.remove());
    popupsRef.current = [];
  }, [map, isStyleLoaded]);

  return (
    <div className="relative h-full w-full">
      <BaseMap onMapLoaded={setupMap} />
      <div className={`
        absolute left-2 top-2 flex flex-col space-y-2
        lg:left-4 lg:top-4
      `}
      >
        <div className={`
          inline-flex w-fit items-center gap-1 rounded-lg bg-white/10 px-2
          py-1.5 shadow-lg backdrop-blur-md
          lg:gap-2 lg:px-3 lg:py-2
        `}
        >
          <span className="text-xl font-bold text-white">震度速報</span>
        </div>
      </div>
      <div className={`
        absolute right-2 top-2 flex flex-col space-y-2
        lg:right-4 lg:top-4
      `}
      >
        <div className="rounded-lg bg-white/10 p-2">
          <div className="flex items-center">
            <div className={`
              flex h-10 w-10 items-center justify-center rounded-lg bg-green-600
            `}
            >
              <span className="text-2xl font-bold text-white">{maxIntensity}</span>
            </div>
            <div className="px-2">
              <span className="text-lg font-bold text-white">目前最大震度</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SpeedEarthquakeMap;
