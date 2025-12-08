export function parseCoordinate(coord: string): [number, number] {
  const [lng, lat] = coord.split(',').map(Number);
  return [lng, lat];
}

export function getWindSpeedColor(speed: number): string {
  if (speed >= 51) return '#FF0000';
  if (speed >= 33) return '#FF6B00';
  if (speed >= 18) return '#FFD700';
  return '#00BFFF';
}

export function getTyphoonCategory(speed: number): string {
  if (speed >= 51) return '強烈颱風';
  if (speed >= 33) return '中度颱風';
  if (speed >= 18) return '輕度颱風';
  return '熱帶低氣壓';
}

export function createCircle(
  centerCoord: [number, number],
  radiusInMeters: number,
  points = 64,
): [number, number][] {
  const coords: [number, number][] = [];
  const distanceX = radiusInMeters / (111320 * Math.cos((centerCoord[1] * Math.PI) / 180));
  const distanceY = radiusInMeters / 110540;

  for (let i = 0; i <= points; i++) {
    const theta = (i / points) * (2 * Math.PI);
    const x = distanceX * Math.cos(theta);
    const y = distanceY * Math.sin(theta);
    coords.push([centerCoord[0] + x, centerCoord[1] + y]);
  }
  return coords;
}
