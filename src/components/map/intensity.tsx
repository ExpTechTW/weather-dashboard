import { useCallback, useEffect, useRef, useState } from 'react';
import { LngLatBounds, Map, Popup } from 'maplibre-gl';

import { BaseMap } from '@/components/map/base';
import { getIntensityColor } from '@/lib/utils';
import IntensityColors from '@/components/intensity-colors';

const MAP_BOUNDS = [[118.0, 21.2], [124.0, 25.8]] as [[number, number], [number, number]];

interface AreaData {
  code: number;
  color: string;
}

interface IntensityDataType {
  type: string;
  author: string;
  id: number;
  alert: number;
  serial: number;
  final: number;
  area: {
    [key: string]: number[];
  };
  max: number;
}
interface RegionInfo {
  code: number;
  lat?: number;
  lon?: number;
  site?: number;
  area?: string;
}

interface RegionData {
  [city: string]: {
    [district: string]: RegionInfo;
  };
}

export function IntensityMap() {
  const [map, setMap] = useState<Map | null>(null);
  const [isStyleLoaded, setIsStyleLoaded] = useState(false);
  const popupsRef = useRef<Popup[]>([]);
  const [maxIntensity, setMaxIntensity] = useState(0);
  const hasZoomedRef = useRef(false);
  const [region, setRegion] = useState<RegionData>({});
  const [intensityData, setIntensityData] = useState<IntensityDataType[]>([]);
  const [tesnumber, setTesnumber] = useState(1746281445527);

  const zoomToMaxIntensityArea = useCallback(() => {
    if (!map || !isStyleLoaded || !intensityData.length || hasZoomedRef.current) return;

    try {
      const bounds = new LngLatBounds();
      let hasValidFeatures = false;

      Object.entries(intensityData[0].area).forEach(([_, codes]) => {
        codes.forEach((code: number) => {
          const features = map.queryRenderedFeatures({
            layers: ['town'],
            filter: ['==', ['get', 'CODE'], code],
          });

          features.forEach((feature) => {
            if (feature.geometry.type === 'Polygon') {
              const coordinates = feature.geometry.coordinates[0] as [number, number][];
              coordinates.forEach((coord) => {
                bounds.extend(coord);
              });
              hasValidFeatures = true;
            }
          });
        });
      });

      if (hasValidFeatures) {
        map.fitBounds(bounds, {
          padding: 150,
          duration: 1500,
        });
        hasZoomedRef.current = true;
      }
    }
    catch (error) {
      console.log(error);
    }
  }, [map, isStyleLoaded, intensityData]);

  useEffect(() => {
    const maxIntensity = intensityData.reduce((max: number, item: IntensityDataType) => Math.max(max, item.max), 0);
    setMaxIntensity(maxIntensity);
  }, [intensityData]);

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

    void fetch('https://raw.githubusercontent.com/ExpTechTW/TREM-Lite/aed715aab833dcdf6c983d4d1310a35a81b5653d/src/resource/data/region.json')
      .then((res) => res.json())
      .then((data: RegionData) => {
        setRegion(data);
      });
    console.log(123);

    setInterval(() => {
      void (async () => {
        const data = await fetch(`https://api.exptech.dev/api/v1/trem/intensity/${tesnumber}`);
        const json = await data.json() as IntensityDataType[];
        setIntensityData(json);
        setTesnumber(tesnumber + 1000);
      })();
    }, 1000);
  }, []);

  useEffect(() => {
    if (!map || !isStyleLoaded) return;

    const style = document.createElement('style');
    style.textContent = ``;
    document.head.appendChild(style);

    const colorExpression: Array<unknown> = ['case'];
    if (intensityData.length > 0) {
      Object.entries(intensityData[0].area).forEach(([intensity, codes]: [string, number[]]) => {
        const intensityColor = getIntensityColor(parseInt(intensity));
        codes.forEach((code: number) => {
          const areaData: AreaData = {
            code,
            color: intensityColor,
          };
          colorExpression.push(['==', ['get', 'CODE'], areaData.code]);
          colorExpression.push(areaData.color);
        });
      });
    }
    colorExpression.push('transparent');

    map.setPaintProperty('town', 'fill-color', colorExpression);

    setTimeout(() => {
      zoomToMaxIntensityArea();
    }, 1000);

    popupsRef.current.forEach((popup) => popup.remove());
    popupsRef.current = [];

    return () => {
      document.head.removeChild(style);
    };
  }, [map, isStyleLoaded, zoomToMaxIntensityArea, intensityData]);

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
            {intensityData.length > 0 && (
              <div className="flex items-center gap-2">
                <div
                  className={`
                    flex h-10 w-10 items-center justify-center rounded-lg
                  `}
                  style={{ backgroundColor: getIntensityColor(maxIntensity) }}
                >
                  <span className="text-2xl font-bold text-black">{maxIntensity}</span>
                </div>
                <div className="px-2">
                  <span className="text-lg font-bold text-white">目前最大震度</span>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="mt-2 flex flex-col gap-2">
          {intensityData.map((i: IntensityDataType) => (
            Object.entries(i.area)
              .sort(([a], [b]) => parseInt(b) - parseInt(a))
              .map(([intensity, codes]: [string, number[]]) => (
                <div key={intensity} className="rounded-lg bg-white/10 p-2">
                  <div className="text-white">
                    <div className="flex items-center gap-2">
                      <div
                        className={`
                          flex h-7 w-7 items-center justify-center rounded-sm
                        `}
                        style={{ backgroundColor: getIntensityColor(parseInt(intensity)) }}
                      >
                        <span className="text-2xl font-bold text-black">{intensity}</span>
                      </div>
                      <div className="font-bold">
                        震度
                      </div>
                    </div>
                    <div className="ml-2">
                      {codes.map((code) => {
                        let location = '';
                        for (const [city, districts] of Object.entries(region)) {
                          for (const [district, info] of Object.entries(districts)) {
                            if (info.code === code) {
                              location = `${city} ${district}`;
                              break;
                            }
                          }
                          if (location) break;
                        }
                        return (
                          <div key={code} className="text-sm">
                            {location || code}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))
          ))}
        </div>
      </div>
      <div className={`
        absolute bottom-2 right-2 flex flex-col space-y-2
        lg:bottom-4 lg:right-4
      `}
      >
        <IntensityColors />
      </div>
    </div>
  );
}

export default IntensityMap;
