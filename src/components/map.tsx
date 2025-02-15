'use client';

import { useEffect, useRef } from 'react';
import { Map } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

function MapComponent() {
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mapContainerRef.current === null) return;

    const map = new Map({
      container: mapContainerRef.current,
      style: {
        version: 8,
        name: 'ExpTech Studio',
        sources: {
          map: {
            type: 'vector',
            url: 'https://lb.exptech.dev/api/v1/map/tiles/tiles.json',
          },
        },
        sprite: '',
        glyphs: 'https://glyphs.geolonia.com/{fontstack}/{range}.pbf',
        layers: [
          {
            id: 'background',
            type: 'background',
            paint: {
              'background-color': '#1f2025',
            },
          },
          {
            'id': 'county',
            'type': 'fill',
            'source': 'map',
            'source-layer': 'city',
            'paint': {
              'fill-color': '#3F4045',
              'fill-opacity': 1,
            },
          },
          {
            'id': 'town',
            'type': 'fill',
            'source': 'map',
            'source-layer': 'town',
            'paint': {
              'fill-color': '#3F4045',
              'fill-opacity': 1,
            },
          },
          {
            'id': 'county-outline',
            'source': 'map',
            'source-layer': 'city',
            'type': 'line',
            'paint': {
              'line-color': '#a9b4bc',
            },
          },
          {
            'id': 'global',
            'type': 'fill',
            'source': 'map',
            'source-layer': 'global',
            'paint': {
              'fill-color': '#3F4045',
              'fill-opacity': 1,
            },
          },
          {
            'id': 'tsunami',
            'type': 'line',
            'source': 'map',
            'source-layer': 'tsunami',
            'paint': {
              'line-opacity': 0,
              'line-width': 3,
            },
          },
        ],
      },
      center: [121.6, 23.5],
      zoom: 6.8,
      attributionControl: false,
      pitchWithRotate: false,
      dragRotate: false,
      maxZoom: 12,
      minZoom: 4,
    });

    map.on('error', () => void 0);

    return () => map.remove();
  }, []);

  return <div ref={mapContainerRef} className="h-full w-full" />;
}

export default MapComponent;
