'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { LngLatBounds, Map, Popup } from 'maplibre-gl';

import { BaseMap } from './base';

import type { Feature, GeoJsonProperties, Geometry } from 'geojson';

interface WeatherAlert {
  code: number;
  color: string;
  type: string;
}

const ALERTS: WeatherAlert[] = [
  {
    code: 711,
    color: '#FFD700',
    type: '大雨特報',
  },
  {
    code: 807,
    color: '#FFD700',
    type: '大雨特報',
  },
];

const MAP_BOUNDS = [[118.0, 21.2], [124.0, 25.8]] as [[number, number], [number, number]];

function WeatherMap() {
  const [map, setMap] = useState<Map | null>(null);
  const [isStyleLoaded, setIsStyleLoaded] = useState(false);
  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);
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
    if (!map || !isStyleLoaded) return;

    const style = document.createElement('style');
    style.textContent = `
     .weather-alert-popup .maplibregl-popup-content {
       background: transparent;
       border: none;
       padding: 0;
       box-shadow: none;
     }
     .weather-alert-popup .maplibregl-popup-tip {
       display: none;
     }
   `;
    document.head.appendChild(style);

    const updateAlerts = () => {
      if (!map.isStyleLoaded()) {
        timeoutIdRef.current = setTimeout(() => updateAlerts(), 100);
        return;
      }

      try {
        const colorExpression: Array<unknown> = ['case'];
        ALERTS.forEach((alert) => {
          colorExpression.push(['==', ['get', 'CODE'], alert.code]);
          colorExpression.push(alert.color);
        });
        colorExpression.push('transparent');

        map.setPaintProperty('town', 'fill-color', colorExpression);

        popupsRef.current.forEach((popup) => popup.remove());
        popupsRef.current = [];

        const allBounds = new LngLatBounds();

        ALERTS.forEach((alert) => {
          const features = map.queryRenderedFeatures({
            layers: ['town'],
            filter: ['==', ['get', 'CODE'], alert.code],
          }) as Feature<Geometry, GeoJsonProperties>[];

          if (features.length > 0) {
            const alertFeature = features[0];
            const bounds = new LngLatBounds();

            if (alertFeature.geometry.type === 'Polygon') {
              const coordinates = alertFeature.geometry.coordinates[0] as [number, number][];
              coordinates.forEach((coord) => {
                bounds.extend(coord);
                allBounds.extend(coord);
              });
            }

            const center = bounds.getCenter();

            const newPopup = new Popup({
              closeButton: false,
              closeOnClick: false,
              className: 'weather-alert-popup',
              offset: 50,
            })
              .setLngLat([center.lng, center.lat])
              .setHTML(`
               <div class="flex items-center gap-2 bg-black/80 backdrop-blur-sm border border-yellow-500/50 px-3 py-2 rounded-lg shadow-lg">
                 <div class="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></div>
                 <span class="text-yellow-500 font-medium tracking-wider">${alert.type}</span>
               </div>
             `);

            newPopup.addTo(map);
            popupsRef.current.push(newPopup);
          }
        });

        map.fitBounds(allBounds, {
          padding: 100,
          duration: 1000,
        });
      }
      catch (error) { 
        console.error('Error updating alerts:', error);
      }
    };

    updateAlerts();

    return () => {
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
      }
      popupsRef.current.forEach((popup) => popup.remove());
      document.head.removeChild(style);
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
          <span className="text-xl font-bold text-white">天氣警特報</span>
        </div>
      </div>
    </div>
  );
}

export default WeatherMap;
