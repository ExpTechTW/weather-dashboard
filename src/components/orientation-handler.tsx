import React, { ReactNode, useEffect, useState } from 'react';
import { RotateCcw } from 'lucide-react';

interface OrientationHandlerProps {
  children: ReactNode;
}

const OrientationHandler: React.FC<OrientationHandlerProps> = ({ children }) => {
  const [isPortrait, setIsPortrait] = useState(false);

  useEffect(() => {
    const checkOrientation = () => {
      setIsPortrait(window.innerHeight > window.innerWidth);
    };

    checkOrientation();

    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);

    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, []);

  if (!isPortrait) {
    return <>{children}</>;
  }

  return (
    <div className="relative h-screen w-screen">
      <div
        className={`
          fixed inset-0 z-50 flex flex-col items-center justify-center
          bg-gray-900 px-6 text-center
        `}
      >
        <RotateCcw className="h-16 w-16 animate-spin text-cyan-400" />
        <h2 className="mt-6 text-2xl font-bold text-white">請旋轉裝置</h2>
        <p className="mt-2 text-gray-300">
          為了獲得最佳體驗，請將手機橫向使用
        </p>
      </div>

      <div className="h-full w-full">
        {children}
      </div>
    </div>
  );
};

export default OrientationHandler;
