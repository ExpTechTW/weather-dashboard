interface TimelineControlsProps {
  isPlaying: boolean;
  animationProgress: number;
  totalPoints: number;
  onPlayPause: () => void;
  onReset: () => void;
  onSliderChange: (value: number) => void;
}

export function TimelineControls({
  isPlaying,
  animationProgress,
  totalPoints,
  onPlayPause,
  onReset,
  onSliderChange,
}: TimelineControlsProps) {
  const currentPointIndex = Math.floor(animationProgress);

  return (
    <div className={`
      absolute right-2 bottom-2 left-2 flex flex-col space-y-2
      lg:right-4 lg:bottom-4 lg:left-4
    `}
    >
      <div className="bg-opacity-80 rounded-lg bg-gray-800 p-3 shadow-xl">
        <div className="flex items-center gap-3">
          <button
            onClick={onPlayPause}
            className={`
              rounded-lg bg-blue-600 px-4 py-2 font-bold text-white
              transition-all
              hover:bg-blue-700
            `}
          >
            {isPlaying ? '暫停' : '播放'}
          </button>
          <button
            onClick={onReset}
            className={`
              rounded-lg bg-gray-600 px-4 py-2 font-bold text-white
              transition-all
              hover:bg-gray-700
            `}
          >
            重置
          </button>
          <div className="flex-1">
            <input
              type="range"
              min="0"
              max={totalPoints - 1}
              step="0.01"
              value={animationProgress}
              onChange={(e) => onSliderChange(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>
          <div className="min-w-[80px] text-right">
            <span className="text-sm font-semibold text-white">
              {currentPointIndex + 1}
              {' '}
              /
              {' '}
              {totalPoints}
            </span>
          </div>
        </div>
      </div>
      <div>
        <div className={`
          absolute bottom-2 flex flex-col space-y-2
          lg:bottom-20
        `}
        >
          <div className="bg-opacity-80 rounded-lg bg-gray-700 px-2 py-1">
            <span className="text-sm text-white">僅供參考，以中央氣象署發布之內容為準</span>
          </div>
        </div>
      </div>
    </div>
  );
}
