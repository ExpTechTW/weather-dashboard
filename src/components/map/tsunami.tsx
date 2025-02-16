'use client';

import { useCallback, useEffect, useState } from 'react';

import { BaseMap } from '@/components/map/base';

import type { Map } from 'maplibre-gl';

function TsunamiMap() {
  const [map, setMap] = useState<Map | null>(null);
  const [isStyleLoaded, setIsStyleLoaded] = useState(false);

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

    void mapInstance.fitBounds([[118.0, 21.2], [124.0, 25.8]], { padding: 20, duration: 0 });

    if (mapInstance.isStyleLoaded()) {
      setIsStyleLoaded(true);
      addTsunamiLayer(mapInstance);
    }
    else {
      void mapInstance.once('style.load', () => {
        setIsStyleLoaded(true);
        addTsunamiLayer(mapInstance);
      });
    }
    setMap(mapInstance);
  }, []);

  const addTsunamiLayer = useCallback((mapInstance: Map) => {
    if (!mapInstance.getSource('map')) {
      console.warn('Source "map" not found');
      return;
    }

    try {
      mapInstance.addLayer({
        'id': 'tsunami',
        'type': 'line',
        'source': 'map',
        'source-layer': 'tsunami',
        'layout': {},
        'paint': {
          'line-color': [
            'match',
            ['get', 'AREANAME'],
            '東部沿海地區', '#f350f3',
            '北部沿海地區', 'red',
            'gold',
          ],
          'line-width': 10,
          'line-opacity': 1,
        },
      });
    }
    catch (error) {
      console.error('Error adding tsunami layer:', error);
    }
  }, []);

  useEffect(() => {
    if (!map || !isStyleLoaded) return;

    let timeoutId: NodeJS.Timeout;
    let isOn = true;

    const updateOpacity = () => {
      if (!map.isStyleLoaded()) {
        timeoutId = setTimeout(updateOpacity, 100);
        return;
      }

      try {
        map.setPaintProperty('tsunami', 'line-opacity', isOn ? 1 : 0);
        timeoutId = setTimeout(() => {
          isOn = !isOn;
          updateOpacity();
        }, isOn ? 3000 : 1000);
      }
      catch (error) {
        console.error('Error updating line opacity:', error);
        timeoutId = setTimeout(updateOpacity, 100);
      }
    };

    updateOpacity();

    return () => {
      clearTimeout(timeoutId);
    };
  }, [map, isStyleLoaded]);

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
          <span className="text-xl font-bold text-white">海嘯資訊</span>
        </div>
      </div>
    </div>
  );
}

export default TsunamiMap;
