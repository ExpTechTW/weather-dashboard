import { useCallback, useEffect, useRef, useState } from 'react';
import { LngLatBounds, Map, Popup } from 'maplibre-gl';

import { BaseMap } from '@/components/map/base';
import { getIntensityColorBg, getIntensityColorText, getIntensityText } from '@/lib/utils';
import IntensityColors from '@/components/intensity-colors';
import { AreaData, IntensityDataType, RegionData } from '@/modal/intensity';

const MAP_BOUNDS = [[118.0, 21.2], [124.0, 25.8]] as [[number, number], [number, number]];

export function IntensityMap() {
  const [map, setMap] = useState<Map | null>(null);
  const [isStyleLoaded, setIsStyleLoaded] = useState(false);
  const popupsRef = useRef<Popup[]>([]);
  const [region, setRegion] = useState<RegionData>({});
  const [intensityData, setIntensityData] = useState<IntensityDataType[]>([]);
  const [currentDataIndex, setCurrentDataIndex] = useState(0);
  const lastDataRef = useRef<string>('');
  const intervalRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const fetchIntervalRef = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    if (intensityData.length > 1) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      intervalRef.current = setInterval(() => {
        setCurrentDataIndex((prevIndex) => (prevIndex + 1) % intensityData.length);
      }, 2000);
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [intensityData.length]);

  const currentData = intensityData[currentDataIndex] || intensityData[0];

  const zoomToMaxIntensityArea = useCallback(() => {
    if (!map || !isStyleLoaded || !intensityData.length) return;

    try {
      const bounds = new LngLatBounds();
      let hasValidFeatures = false;

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
          duration: 1000,
          maxZoom: 9,
        });
      }
      else {
        map.fitBounds(MAP_BOUNDS, {
          padding: 20,
          duration: 1000,
          maxZoom: 9,
        });
      }
    }
    catch (error) {
      console.log(error);
      map.fitBounds(MAP_BOUNDS, {
        padding: 20,
        duration: 1000,
        maxZoom: 9,
      });
    }
  }, [map, isStyleLoaded, intensityData]);

  const setupMap = useCallback((mapInstance: Map) => {
    async function fetchIntensityData() {
      try {
        const data = await fetch(`https://api.exptech.dev/api/v1/trem/intensity`);
        const json = await data.json() as IntensityDataType[];

        const newDataString = JSON.stringify(json);
        if (newDataString !== lastDataRef.current) {
          lastDataRef.current = newDataString;
          setIntensityData(json);
        }
      }
      catch (error) {
        console.error(error);
      }
    }

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
    void fetchIntensityData();

    if (fetchIntervalRef.current) {
      clearInterval(fetchIntervalRef.current);
    }

    fetchIntervalRef.current = setInterval(() => {
      void fetchIntensityData();
    }, 1000);

    void fetch('https://raw.githubusercontent.com/ExpTechTW/TREM-Lite/aed715aab833dcdf6c983d4d1310a35a81b5653d/src/resource/data/region.json')
      .then((res) => res.json())
      .then((data: RegionData) => {
        setRegion(data);
      });

    return () => {
      if (fetchIntervalRef.current) {
        clearInterval(fetchIntervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!map || !isStyleLoaded) return;

    const style = document.createElement('style');
    style.textContent = ``;
    document.head.appendChild(style);

    if (intensityData.length === 0) {
      map.setPaintProperty('town', 'fill-color', 'transparent');
      map.setPaintProperty('town', 'fill-outline-color', 'transparent');
      map.fitBounds(MAP_BOUNDS, {
        padding: 20,
        duration: 1000,
        maxZoom: 9,
      });
    }
    else {
      const colorExpression: Array<unknown> = ['case'];
      const outlineExpression: Array<unknown> = ['case'];
      Object.entries(intensityData[0].area).forEach(([intensity, codes]) => {
        const intensityColor = getIntensityColorBg(parseInt(intensity));
        codes.forEach((code: number) => {
          const areaData: AreaData = {
            code,
            color: intensityColor,
          };
          colorExpression.push(['==', ['get', 'CODE'], areaData.code]);
          colorExpression.push(areaData.color);
          outlineExpression.push(['==', ['get', 'CODE'], areaData.code]);
          outlineExpression.push('#000000');
        });
      });
      colorExpression.push('transparent');
      outlineExpression.push('transparent');
      map.setPaintProperty('town', 'fill-color', colorExpression);
      map.setPaintProperty('town', 'fill-outline-color', outlineExpression);

      setTimeout(() => {
        zoomToMaxIntensityArea();
      }, 500);
    }

    popupsRef.current.forEach((popup) => popup.remove());
    popupsRef.current = [];

    return () => {
      document.head.removeChild(style);
    };
  }, [map, isStyleLoaded, zoomToMaxIntensityArea, intensityData]);

  const handleCleanup = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = undefined;
    }
    if (fetchIntervalRef.current) {
      clearInterval(fetchIntervalRef.current);
      fetchIntervalRef.current = undefined;
    }
  }, []);

  return (
    <div className="relative h-full w-full">
      <BaseMap onMapLoaded={setupMap} onCleanup={handleCleanup} />
      <div className={`
        absolute left-2 top-2 flex flex-col space-y-2
        lg:left-4 lg:top-4
      `}
      >
        <div className={`
          inline-flex w-fit items-center gap-1 rounded-lg bg-gray-700 px-2
          py-1.5 shadow-lg backdrop-blur-md
          lg:gap-2 lg:px-3 lg:py-2
        `}
        >
          <span className="text-xl font-bold text-white">震度速報</span>
        </div>
        <div>
          <div className={`
            rounded-lg bg-gray-700 p-2 font-bold text-white
            ${currentData
      ? ''
      : `hidden`}
          `}
          >
            {currentData ? `ID:${currentData.id}` : ''}
          </div>
        </div>
      </div>
      <div className={`
        absolute right-2 top-2 flex flex-col space-y-2
        ${currentData ? '' : 'hidden'}
        lg:right-4 lg:top-4
      `}
      >
        <div className="rounded-lg bg-gray-700 p-2">
          {intensityData.length > 0 && (
            <div className="flex items-center justify-center">
              <div className="text-2xl font-bold text-white">
                {currentData.final === 1
                  ? '最終報'
                  : `第 ${currentData.serial} 報`}
              </div>
            </div>
          )}
        </div>
        <div className="rounded-lg bg-gray-700 p-2">
          <div>
            {intensityData.length > 0 && (
              <div className="flex items-center gap-2">
                <div
                  className={`
                    flex h-10 w-10 items-center justify-center rounded-lg
                  `}
                  style={{ backgroundColor: getIntensityColorBg(currentData.max) }}
                >
                  <span
                    className="text-2xl font-bold"
                    style={{ color: getIntensityColorText(currentData.max) }}
                  >
                    {getIntensityText(currentData.max)}
                  </span>
                </div>
                <div className="px-1">
                  <span className="text-lg font-bold text-white">目前最大震度</span>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="mt-2 flex flex-col gap-2">
          {currentData && (() => {
            const cityMaxIntensity: { [key: string]: number } = {};
            Object.entries(currentData.area).forEach(([intensity, codes]) => {
              const currentIntensity = parseInt(intensity);
              codes.forEach((code) => {
                let location = '';
                for (const [city, districts] of Object.entries(region)) {
                  for (const [, info] of Object.entries(districts)) {
                    if (info.code === code) {
                      location = city;
                      break;
                    }
                  }
                  if (location) break;
                }
                if (location) {
                  if (!cityMaxIntensity[location] || cityMaxIntensity[location] < currentIntensity) {
                    cityMaxIntensity[location] = currentIntensity;
                  }
                }
              });
            });
            return Object.entries(currentData.area)
              .sort(([a], [b]) => parseInt(b) - parseInt(a))
              .map(([intensity, codes]) => {
                const currentIntensity = parseInt(intensity);
                const citiesInThisIntensity = new Set<string>();
                codes.forEach((code) => {
                  let location = '';
                  for (const [city, districts] of Object.entries(region)) {
                    for (const [, info] of Object.entries(districts)) {
                      if (info.code === code) {
                        location = city;
                        break;
                      }
                    }
                    if (location) break;
                  }
                  if (location && cityMaxIntensity[location] === currentIntensity) {
                    citiesInThisIntensity.add(location);
                  }
                });

                if (citiesInThisIntensity.size === 0) return null;

                return (
                  <div key={intensity} className="rounded-lg bg-gray-700 p-2">
                    <div className="text-white">
                      <div className="flex items-center gap-2">
                        <div
                          className={`
                            flex h-10 w-10 items-center justify-center
                            rounded-sm
                          `}
                          style={{ backgroundColor: getIntensityColorBg(currentIntensity) }}
                        >
                          <span
                            className="text-2xl font-bold"
                            style={{ color: getIntensityColorText(currentIntensity) }}
                          >
                            {getIntensityText(currentIntensity)}
                          </span>
                        </div>
                        <div className="px-1 text-lg font-bold">
                          最大震度縣市
                        </div>
                      </div>
                      <div className="mx-9 mt-1">
                        <div className="grid grid-cols-2">
                          {Array.from(citiesInThisIntensity).sort().map((city) => (
                            <div key={city} className="text-sm">
                              {city}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }).filter(Boolean);
          })()}
        </div>
      </div>
      <div className={`
        absolute bottom-2 right-2 flex flex-col space-y-2
        lg:bottom-4 lg:right-4
      `}
      >
        <IntensityColors />
      </div>
      <div>
        <div className={`
          absolute bottom-2 left-2 flex flex-col space-y-2
          lg:bottom-4 lg:left-4
        `}
        >
          <div className="rounded-lg bg-gray-700 bg-opacity-80 px-2 py-1">
            <span className="text-sm text-white">僅供參考，以中央氣象署發布之內容為準</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default IntensityMap;
