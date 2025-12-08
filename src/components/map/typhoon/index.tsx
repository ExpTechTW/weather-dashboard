'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { LngLatBounds, Map, Popup } from 'maplibre-gl';

import { BaseMap } from '@/components/map/base';
import { createCircle, getTyphoonCategory, getWindSpeedColor, parseCoordinate } from '@/lib/typhoon';

import { TyphoonPopupContent } from './popup-content';
import { InfoPanel } from './info-panel';
import { CurrentInfo } from './current-info';
import { Legend } from './legend';
import { TimelineControls } from './timeline-controls';

import type { FixPoint, ForecastPoint, TyphoonApiResponse } from '@/modal/typhoon';

const MAP_BOUNDS = [[105.0, 0.0], [150.0, 30.0]] as [[number, number], [number, number]];

export function TyphoonMap() {
  const [map, setMap] = useState<Map | null>(null);
  const [isStyleLoaded, setIsStyleLoaded] = useState(false);
  const [typhoonData, setTyphoonData] = useState<TyphoonApiResponse | null>(null);
  const [animationProgress, setAnimationProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const animationRef = useRef<number | null>(null);
  const popupRef = useRef<Popup | null>(null);

  const setupMap = useCallback((mapInstance: Map) => {
    async function fetchTyphoonData() {
      try {
        const response = await fetch('/W-C0034-005.json');
        const json = await response.json() as TyphoonApiResponse;
        setTyphoonData(json);
      }
      catch (error) {
        console.error('Failed to fetch typhoon data:', error);
      }
    }

    const interactions = [
      mapInstance.dragRotate,
    ];

    interactions.forEach((interaction) => interaction.disable());

    void mapInstance.fitBounds(MAP_BOUNDS, { padding: 50, duration: 0 });
    mapInstance.setMaxZoom(10);
    mapInstance.setMinZoom(4);

    if (mapInstance.isStyleLoaded()) {
      setIsStyleLoaded(true);
    }
    else {
      void mapInstance.once('style.load', () => {
        setIsStyleLoaded(true);
      });
    }

    const style = document.createElement('style');
    style.textContent = `
      .typhoon-popup .maplibregl-popup-content {
        background: transparent !important;
        padding: 0 !important;
        box-shadow: none !important;
      }
      .typhoon-popup .maplibregl-popup-tip {
        border-top-color: #1f2937 !important;
      }
      .typhoon-popup .maplibregl-popup-close-button {
        color: white !important;
        font-size: 20px !important;
        padding: 4px 8px !important;
        right: 2px !important;
        top: 2px !important;
      }
      .typhoon-popup .maplibregl-popup-close-button:hover {
        background-color: rgba(255, 255, 255, 0.1) !important;
      }
    `;
    document.head.appendChild(style);

    setMap(mapInstance);
    void fetchTyphoonData();
  }, []);

  useEffect(() => {
    if (!typhoonData || !isPlaying) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      return;
    }

    const totalPoints = typhoonData.cwaopendata.dataset.tropicalCyclones.tropicalCyclone.analysis_data.fix.length;
    const animationDuration = 800;
    const totalDuration = totalPoints * animationDuration;

    let startTime: number | null = null;
    const startProgress = animationProgress;

    const animate = (currentTime: number) => {
      if (startTime === null) {
        startTime = currentTime;
      }

      const elapsed = currentTime - startTime;
      const remainingProgress = (totalPoints - 1) - startProgress;
      const remainingDuration = (remainingProgress / (totalPoints - 1)) * totalDuration;
      const progress = Math.min(elapsed / remainingDuration, 1);

      const newProgress = startProgress + progress * remainingProgress;
      setAnimationProgress(newProgress);

      if (newProgress < totalPoints - 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
      else {
        setIsPlaying(false);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [typhoonData, isPlaying]);

  useEffect(() => {
    if (!map || !isStyleLoaded || !typhoonData) return;

    if (!map.getSource('typhoon-path-source')) {
      map.addSource('typhoon-path-source', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: [],
          },
        },
      });

      map.addLayer({
        id: 'typhoon-path-glow',
        type: 'line',
        source: 'typhoon-path-source',
        paint: {
          'line-color': '#FFFFFF',
          'line-width': 8,
          'line-blur': 4,
          'line-opacity': 0.4,
        },
      });

      map.addLayer({
        id: 'typhoon-path',
        type: 'line',
        source: 'typhoon-path-source',
        paint: {
          'line-color': '#FFFFFF',
          'line-width': 4,
        },
      });
    }

    if (!map.getSource('typhoon-points-source')) {
      map.addSource('typhoon-points-source', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [],
        },
      });

      map.addLayer({
        id: 'typhoon-points',
        type: 'circle',
        source: 'typhoon-points-source',
        paint: {
          'circle-radius': 6,
          'circle-color': ['get', 'color'],
          'circle-opacity': ['get', 'opacity'],
          'circle-stroke-width': 2,
          'circle-stroke-color': '#FFFFFF',
          'circle-stroke-opacity': ['get', 'opacity'],
        },
      });
    }

    if (!map.getSource('typhoon-current-source')) {
      map.addSource('typhoon-current-source', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'Point',
            coordinates: [0, 0],
          },
        },
      });

      map.addLayer({
        id: 'typhoon-current-glow',
        type: 'circle',
        source: 'typhoon-current-source',
        paint: {
          'circle-radius': 20,
          'circle-color': ['get', 'color'],
          'circle-opacity': 0.3,
          'circle-blur': 1,
        },
      });

      map.addLayer({
        id: 'typhoon-current-point',
        type: 'circle',
        source: 'typhoon-current-source',
        paint: {
          'circle-radius': 12,
          'circle-color': ['get', 'color'],
          'circle-stroke-width': 4,
          'circle-stroke-color': '#FFFFFF',
        },
      });
    }

    if (!map.getSource('wind-circle-15-source')) {
      map.addSource('wind-circle-15-source', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'Polygon',
            coordinates: [[]],
          },
        },
      });

      map.addLayer({
        id: 'wind-circle-15',
        type: 'fill',
        source: 'wind-circle-15-source',
        paint: {
          'fill-color': '#FFD700',
          'fill-opacity': 0.15,
        },
      });

      map.addLayer({
        id: 'wind-circle-15-outline',
        type: 'line',
        source: 'wind-circle-15-source',
        paint: {
          'line-color': '#FFD700',
          'line-width': 2,
          'line-dasharray': [4, 2],
        },
      });
    }

    if (!map.getSource('wind-circle-25-source')) {
      map.addSource('wind-circle-25-source', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'Polygon',
            coordinates: [[]],
          },
        },
      });

      map.addLayer({
        id: 'wind-circle-25',
        type: 'fill',
        source: 'wind-circle-25-source',
        paint: {
          'fill-color': '#FF4500',
          'fill-opacity': 0.2,
        },
      });

      map.addLayer({
        id: 'wind-circle-25-outline',
        type: 'line',
        source: 'wind-circle-25-source',
        paint: {
          'line-color': '#FF4500',
          'line-width': 2,
          'line-dasharray': [4, 2],
        },
      });
    }

    if (!map.getSource('typhoon-forecast-source')) {
      map.addSource('typhoon-forecast-source', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: [],
          },
        },
      });

      map.addLayer({
        id: 'typhoon-forecast-path-glow',
        type: 'line',
        source: 'typhoon-forecast-source',
        paint: {
          'line-color': '#FFFF00',
          'line-width': 8,
          'line-blur': 4,
          'line-opacity': 0.3,
          'line-dasharray': [2, 2],
        },
      });

      map.addLayer({
        id: 'typhoon-forecast-path',
        type: 'line',
        source: 'typhoon-forecast-source',
        paint: {
          'line-color': '#FFFF00',
          'line-width': 4,
          'line-dasharray': [2, 2],
        },
      });
    }

    if (!map.getSource('forecast-uncertainty-source')) {
      map.addSource('forecast-uncertainty-source', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [],
        },
      });

      map.addLayer({
        id: 'forecast-uncertainty',
        type: 'fill',
        source: 'forecast-uncertainty-source',
        paint: {
          'fill-color': '#FFFF00',
          'fill-opacity': 0.1,
        },
      });

      map.addLayer({
        id: 'forecast-uncertainty-outline',
        type: 'line',
        source: 'forecast-uncertainty-source',
        paint: {
          'line-color': '#FFFF00',
          'line-width': 1,
          'line-opacity': 0.5,
          'line-dasharray': [3, 3],
        },
      });
    }

    if (!map.getSource('typhoon-forecast-points-source')) {
      map.addSource('typhoon-forecast-points-source', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [],
        },
      });

      map.addLayer({
        id: 'typhoon-forecast-points',
        type: 'circle',
        source: 'typhoon-forecast-points-source',
        paint: {
          'circle-radius': 6,
          'circle-color': '#FFFF00',
          'circle-opacity': 0.8,
          'circle-stroke-width': 2,
          'circle-stroke-color': '#FFFFFF',
        },
      });
    }

    const handlePointClick = (e: maplibregl.MapMouseEvent) => {
      const features = map.queryRenderedFeatures(e.point, {
        layers: ['typhoon-points'],
      });

      if (features.length > 0 && typhoonData) {
        const feature = features[0];
        const pointIndex = (feature.properties as { pointIndex?: number }).pointIndex;

        if (pointIndex !== undefined) {
          const typhoon = typhoonData.cwaopendata.dataset.tropicalCyclones.tropicalCyclone;
          const fix = typhoon.analysis_data.fix[pointIndex];
          const coord = parseCoordinate(fix.coordinate);
          const windSpeed = parseInt(fix.max_wind_speed);

          if (popupRef.current) {
            popupRef.current.remove();
          }

          const popupNode = document.createElement('div');

          const popup = new Popup({
            closeButton: true,
            closeOnClick: false,
            maxWidth: '300px',
            className: 'typhoon-popup',
          })
            .setLngLat(coord)
            .setDOMContent(popupNode)
            .addTo(map);

          const root = createRoot(popupNode);
          root.render(
            <TyphoonPopupContent
              fix={fix}
              typhoonCategory={getTyphoonCategory(windSpeed)}
            />,
          );

          popupRef.current = popup;
        }
      }
    };

    map.on('click', 'typhoon-points', handlePointClick);

    map.on('mouseenter', 'typhoon-points', () => {
      map.getCanvas().style.cursor = 'pointer';
    });

    map.on('mouseleave', 'typhoon-points', () => {
      map.getCanvas().style.cursor = '';
    });

    return () => {
      map.off('click', 'typhoon-points', handlePointClick);
      map.off('mouseenter', 'typhoon-points', () => {
        map.getCanvas().style.cursor = 'pointer';
      });
      map.off('mouseleave', 'typhoon-points', () => {
        map.getCanvas().style.cursor = '';
      });
    };
  }, [map, isStyleLoaded, typhoonData]);

  useEffect(() => {
    if (!map || !isStyleLoaded || !typhoonData) return;

    const typhoon = typhoonData.cwaopendata.dataset.tropicalCyclones.tropicalCyclone;
    const analysisFixes = typhoon.analysis_data.fix;
    const forecastFixes = typhoon.forecast_data.fix;

    const currentPointIndex = Math.floor(animationProgress);
    const progressFraction = animationProgress - currentPointIndex;

    const visibleFixes = analysisFixes.slice(0, currentPointIndex + 1);
    const analysisCoordinates = visibleFixes.map((fix: FixPoint) => parseCoordinate(fix.coordinate));

    if (progressFraction > 0 && currentPointIndex < analysisFixes.length - 1) {
      const currentCoord = parseCoordinate(analysisFixes[currentPointIndex].coordinate);
      const nextCoord = parseCoordinate(analysisFixes[currentPointIndex + 1].coordinate);

      const interpolatedCoord: [number, number] = [
        currentCoord[0] + (nextCoord[0] - currentCoord[0]) * progressFraction,
        currentCoord[1] + (nextCoord[1] - currentCoord[1]) * progressFraction,
      ];

      analysisCoordinates.push(interpolatedCoord);
    }

    const pathSource = map.getSource('typhoon-path-source') as maplibregl.GeoJSONSource;
    if (pathSource) {
      pathSource.setData({
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: analysisCoordinates.length >= 2 ? analysisCoordinates : (analysisCoordinates.length === 1 ? [analysisCoordinates[0], analysisCoordinates[0]] : []),
        },
      });
    }

    const analysisPoints = visibleFixes.map((fix: FixPoint, index: number) => {
      const windSpeed = parseInt(fix.max_wind_speed);
      return {
        type: 'Feature' as const,
        properties: {
          pointIndex: index,
          time: fix.fix_time,
          wind_speed: windSpeed,
          pressure: fix.pressure,
          color: getWindSpeedColor(windSpeed),
          opacity: 0.3 + (index / visibleFixes.length) * 0.7,
        },
        geometry: {
          type: 'Point' as const,
          coordinates: parseCoordinate(fix.coordinate),
        },
      };
    });

    const pointsSource = map.getSource('typhoon-points-source') as maplibregl.GeoJSONSource;
    if (pointsSource) {
      pointsSource.setData({
        type: 'FeatureCollection',
        features: analysisPoints,
      });
    }

    if (currentPointIndex < analysisFixes.length) {
      const currentFix = analysisFixes[currentPointIndex];
      let currentPosition = parseCoordinate(currentFix.coordinate);

      if (progressFraction > 0 && currentPointIndex < analysisFixes.length - 1) {
        const nextCoord = parseCoordinate(analysisFixes[currentPointIndex + 1].coordinate);
        currentPosition = [
          currentPosition[0] + (nextCoord[0] - currentPosition[0]) * progressFraction,
          currentPosition[1] + (nextCoord[1] - currentPosition[1]) * progressFraction,
        ];
      }

      const currentWindSpeed = parseInt(currentFix.max_wind_speed);
      const currentColor = getWindSpeedColor(currentWindSpeed);

      const currentSource = map.getSource('typhoon-current-source') as maplibregl.GeoJSONSource;
      if (currentSource) {
        currentSource.setData({
          type: 'Feature',
          properties: {
            wind_speed: currentWindSpeed,
            color: currentColor,
          },
          geometry: {
            type: 'Point',
            coordinates: currentPosition,
          },
        });
      }

      const wind15Source = map.getSource('wind-circle-15-source') as maplibregl.GeoJSONSource;
      if (wind15Source) {
        if (currentFix.circle_of_15ms) {
          const radius15 = parseFloat(currentFix.circle_of_15ms.radius) * 1000;
          wind15Source.setData({
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'Polygon',
              coordinates: [createCircle(currentPosition, radius15)],
            },
          });
        }
        else {
          wind15Source.setData({
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'Polygon',
              coordinates: [[]],
            },
          });
        }
      }

      const wind25Source = map.getSource('wind-circle-25-source') as maplibregl.GeoJSONSource;
      if (wind25Source) {
        if (currentFix.circle_of_25ms) {
          const radius25 = parseFloat(currentFix.circle_of_25ms.radius) * 1000;
          wind25Source.setData({
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'Polygon',
              coordinates: [createCircle(currentPosition, radius25)],
            },
          });
        }
        else {
          wind25Source.setData({
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'Polygon',
              coordinates: [[]],
            },
          });
        }
      }
    }

    const forecastSource = map.getSource('typhoon-forecast-source') as maplibregl.GeoJSONSource;
    const uncertaintySource = map.getSource('forecast-uncertainty-source') as maplibregl.GeoJSONSource;
    const forecastPointsSource = map.getSource('typhoon-forecast-points-source') as maplibregl.GeoJSONSource;

    if (currentPointIndex === analysisFixes.length - 1) {
      const lastAnalysisCoord = analysisCoordinates[analysisCoordinates.length - 1];
      const forecastCoordinates = [lastAnalysisCoord, ...forecastFixes.map((fix: ForecastPoint) => parseCoordinate(fix.coordinate))];

      if (forecastSource) {
        forecastSource.setData({
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: forecastCoordinates,
          },
        });
      }

      const uncertaintyCircles = forecastFixes.map((fix: ForecastPoint) => {
        const radiusInMeters = parseFloat(fix.radius_of_70percent_probability) * 1000;
        const center = parseCoordinate(fix.coordinate);

        return {
          type: 'Feature' as const,
          properties: {},
          geometry: {
            type: 'Polygon' as const,
            coordinates: [createCircle(center, radiusInMeters, 32)],
          },
        };
      });

      if (uncertaintySource) {
        uncertaintySource.setData({
          type: 'FeatureCollection',
          features: uncertaintyCircles,
        });
      }

      const forecastPoints = forecastFixes.map((fix: ForecastPoint) => ({
        type: 'Feature' as const,
        properties: {
          time: fix.init_time,
          tau: fix.tau,
          wind_speed: fix.max_wind_speed || 'N/A',
          pressure: fix.pressure,
        },
        geometry: {
          type: 'Point' as const,
          coordinates: parseCoordinate(fix.coordinate),
        },
      }));

      if (forecastPointsSource) {
        forecastPointsSource.setData({
          type: 'FeatureCollection',
          features: forecastPoints,
        });
      }
    }
    else {
      if (forecastSource) {
        forecastSource.setData({
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: [],
          },
        });
      }
      if (uncertaintySource) {
        uncertaintySource.setData({
          type: 'FeatureCollection',
          features: [],
        });
      }
      if (forecastPointsSource) {
        forecastPointsSource.setData({
          type: 'FeatureCollection',
          features: [],
        });
      }
    }

    if (analysisCoordinates.length > 0 && currentPointIndex < analysisFixes.length) {
      const currentPosition = analysisCoordinates[analysisCoordinates.length - 1];

      if (currentPointIndex === analysisFixes.length - 1) {
        const bounds = new LngLatBounds();

        analysisCoordinates.forEach((coord) => {
          bounds.extend(coord);
        });

        if (forecastFixes.length > 0) {
          forecastFixes.forEach((fix: ForecastPoint) => {
            const coord = parseCoordinate(fix.coordinate);
            bounds.extend(coord);
          });
        }

        map.fitBounds(bounds, {
          padding: { top: 120, bottom: 120, left: 120, right: 450 },
          duration: 1000,
          maxZoom: 8,
        });
      }
      else {
        const progress = currentPointIndex / (analysisFixes.length - 1);
        const startZoom = 5.5;
        const endZoom = 7.5;
        const targetZoom = startZoom + (endZoom - startZoom) * progress;

        map.easeTo({
          center: [currentPosition[0], currentPosition[1]],
          zoom: targetZoom,
          duration: 300,
          easing: (t) => t,
        });
      }
    }
  }, [map, isStyleLoaded, typhoonData, animationProgress]);

  const typhoon = typhoonData?.cwaopendata.dataset.tropicalCyclones.tropicalCyclone;
  const totalPoints = typhoon?.analysis_data.fix.length || 0;
  const currentPointIndex = Math.floor(animationProgress);
  const currentFix = typhoon?.analysis_data.fix[currentPointIndex];

  const handlePlayPause = () => {
    if (!isPlaying && animationProgress >= totalPoints - 1) {
      setAnimationProgress(0);
      setIsPlaying(true);
    }
    else {
      setIsPlaying(!isPlaying);
    }
  };

  const handleReset = () => {
    setAnimationProgress(0);
    setIsPlaying(true);
  };

  const handleSliderChange = (value: number) => {
    setAnimationProgress(value);
    setIsPlaying(false);
  };

  return (
    <div className="relative h-full w-full">
      <BaseMap onMapLoaded={setupMap} />
      {typhoon && currentFix && (
        <>
          <InfoPanel typhoon={typhoon} currentFix={currentFix} />
          <CurrentInfo
            currentFix={currentFix}
            currentPointIndex={currentPointIndex}
            totalPoints={totalPoints}
          />
          <Legend />
          <TimelineControls
            isPlaying={isPlaying}
            animationProgress={animationProgress}
            totalPoints={totalPoints}
            onPlayPause={handlePlayPause}
            onReset={handleReset}
            onSliderChange={handleSliderChange}
          />
        </>
      )}
    </div>
  );
}

export default TyphoonMap;
