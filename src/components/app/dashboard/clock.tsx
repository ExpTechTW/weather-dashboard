import { useEffect, useState } from 'react';

import { date, time } from '@/lib/utils';

const Clock: React.FC = () => {
  const [t, setTime] = useState(Date.now());

  useEffect(() => {
    const updateTime = () => setTime(Date.now());
    const t = setInterval(updateTime, 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div
      className="flex flex-col items-center gap-1 p-2 text-white"
    >
      <div className="text-6xl font-black">
        {time(t)}
      </div>
      <div className="text-xl font-bold">
        {date(t)}
      </div>
    </div>
  );
};
Clock.displayName = 'Clock';

export default Clock;
