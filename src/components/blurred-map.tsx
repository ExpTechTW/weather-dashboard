import { ReactNode } from 'react';

interface BlurredMapProps {
  children: ReactNode;
  isBlurred: boolean;
}

function BlurredMap({ children, isBlurred }: BlurredMapProps) {
  return (
    <div className="relative h-full w-full">
      {children}
      {isBlurred && (
        <div className={`
          absolute inset-0 flex items-center justify-center backdrop-blur-sm
        `}
        >
          <div className="rounded-lg bg-gray-800 p-6 text-center">
            <p className="text-4xl font-bold text-white">
              目前沒有正在生效的天氣警特報
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default BlurredMap;
