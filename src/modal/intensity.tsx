export interface AreaData {
  code: number;
  color: string;
}

export interface IntensityDataType {
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
export interface RegionInfo {
  code: number;
  lat?: number;
  lon?: number;
  site?: number;
  area?: string;
}

export interface RegionData {
  [city: string]: {
    [district: string]: RegionInfo;
  };
}
