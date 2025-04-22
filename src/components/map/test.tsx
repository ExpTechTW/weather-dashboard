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

export function SpeedEarthquakeMap() {
  const [map, setMap] = useState<Map | null>(null);
  const [isStyleLoaded, setIsStyleLoaded] = useState(false);
  const popupsRef = useRef<Popup[]>([]);

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
    <BaseMap onMapLoaded={setupMap} />
  );
}

export default SpeedEarthquakeMap;
