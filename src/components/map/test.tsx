import { useCallback } from 'react';

import { BaseMap } from '@/components/map/base';

import type { Map } from 'maplibre-gl';

export function SpeedEarthquakeMap() {
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
  }, []);

  return (
    <BaseMap onMapLoaded={setupMap} />
  );
}

export default SpeedEarthquakeMap;
