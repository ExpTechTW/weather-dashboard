import { useEffect } from 'react';

import WeatherAlert from '@/modal/weather';

interface WeatherAlertsProps {
  alerts: WeatherAlert[];
  onAlertsChange: (alerts: WeatherAlert[]) => void;
}

const sampleAlerts: WeatherAlert[] = [
  // {
  //   title: '大雨特報',
  //   description: '東部地區及恆春半島有局部大雨發生的機率，請注意瞬間大雨、雷擊及強陣風。累積雨量24小時可達80毫米以上。',
  //   type: 'rain',
  //   severity: 'warning',
  // },
  // {
  //   title: '強風特報',
  //   description: '東北季風增強，北部、東北部（含蘭嶼、綠島）、澎湖、金門、馬祖沿海及空曠地區易有9至10級強陣風。',
  //   type: 'wind',
  //   severity: 'alert',
  // },
  // {
  //   title: '低溫特報',
  //   description: '台灣北部及中部地區氣溫可能降至攝氏10度以下，請注意保暖。',
  //   type: 'temperature',
  //   severity: 'notice',
  // },
];

function WeatherAlerts({ alerts, onAlertsChange }: WeatherAlertsProps) {
  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 100));
        onAlertsChange(sampleAlerts);
      }
      catch (error) {
        console.error('Error fetching alerts:', error);
      }
    };

    void fetchAlerts();
  }, [onAlertsChange]);

  if (alerts.length === 0) {
    return null;
  }

  const getAlertColor = (severity: WeatherAlert['severity']) => {
    switch (severity) {
      case 'warning':
        return 'bg-red-900/50';
      case 'alert':
        return 'bg-yellow-900/50';
      case 'notice':
        return 'bg-blue-900/50';
      default:
        return 'bg-gray-900/50';
    }
  };

  const getTextColor = (severity: WeatherAlert['severity']) => {
    switch (severity) {
      case 'warning':
        return 'text-red-300';
      case 'alert':
        return 'text-yellow-300';
      case 'notice':
        return 'text-blue-300';
      default:
        return 'text-gray-300';
    }
  };

  return (
    <div className="rounded-lg bg-gray-800 p-6 shadow-lg">
      <h2 className="mb-4 text-xl font-bold text-gray-100">天氣警報資訊</h2>
      <div className="space-y-4">
        {alerts.map((alert, index) => (
          <div
            key={index}
            className={`
              rounded-lg
              ${getAlertColor(alert.severity)}
              p-4
            `}
          >
            <h3 className={`
              font-semibold
              ${getTextColor(alert.severity)}
            `}
            >
              {alert.title}
            </h3>
            <p className="mt-2 text-sm text-gray-300">{alert.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WeatherAlerts;
