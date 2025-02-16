interface WeatherAlert {
  title: string;
  description: string;
  type: 'rain' | 'wind' | 'temperature' | 'typhoon';
  severity: 'warning' | 'alert' | 'notice';
}

export default WeatherAlert;
