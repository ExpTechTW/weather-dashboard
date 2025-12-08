export interface TyphoonRadius {
  '@dir': string;
  '#text': string;
}

export interface CircleData {
  radius: string;
  quadrant_radii?: {
    radius: TyphoonRadius[];
  };
}

export interface FixPoint {
  fix_time: string;
  coordinate: string;
  max_wind_speed: string;
  max_gust_speed: string;
  pressure: string;
  moving_speed: string;
  moving_direction: string;
  circle_of_15ms: CircleData | null;
  circle_of_25ms: CircleData | null;
  moving_prediction?: Array<{ '@lang': string; '#text': string }>;
}

export interface ForecastPoint {
  init_time: string;
  tau: string;
  coordinate: string;
  max_wind_speed?: string;
  max_gust_speed?: string;
  pressure: string;
  moving_speed: string;
  moving_direction: string;
  circle_of_15ms: CircleData | null;
  circle_of_25ms: CircleData | null;
  radius_of_70percent_probability: string;
  state_transfer?: Array<{ '@lang': string; '#text': string }>;
}

export interface TyphoonData {
  year: string;
  typhoon_name: string;
  cwa_typhoon_name: string;
  cwa_td_no: string;
  cwa_ty_no: string;
  analysis_data: {
    fix: FixPoint[];
  };
  forecast_data: {
    fix: ForecastPoint[];
  };
}

export interface TyphoonApiResponse {
  cwaopendata: {
    identifier: string;
    sender: string;
    sent: string;
    status: string;
    msgType: string;
    scope: string;
    dataset: {
      tropicalCyclones: {
        tropicalCyclone: TyphoonData;
      };
    };
  };
}
