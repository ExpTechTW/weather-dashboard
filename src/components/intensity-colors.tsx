import { getIntensityColor } from '@/lib/utils';

export default function IntensityColors() {
  return (
    <div className="rounded-lg bg-white/10 p-2">
      <div className="grid grid-cols-1 gap-1">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded" style={{ backgroundColor: getIntensityColor(0) }} />
          <span className="text-sm text-white">0級</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded" style={{ backgroundColor: getIntensityColor(1) }} />
          <span className="text-sm text-white">1級</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded" style={{ backgroundColor: getIntensityColor(2) }} />
          <span className="text-sm text-white">2級</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded" style={{ backgroundColor: getIntensityColor(3) }} />
          <span className="text-sm text-white">3級</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded" style={{ backgroundColor: getIntensityColor(4) }} />
          <span className="text-sm text-white">4級</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded" style={{ backgroundColor: getIntensityColor(5) }} />
          <span className="text-sm text-white">5蒻</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded" style={{ backgroundColor: getIntensityColor(6) }} />
          <span className="text-sm text-white">5強</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded" style={{ backgroundColor: getIntensityColor(7) }} />
          <span className="text-sm text-white">6弱</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded" style={{ backgroundColor: getIntensityColor(8) }} />
          <span className="text-sm text-white">6強</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded" style={{ backgroundColor: getIntensityColor(9) }} />
          <span className="text-sm text-white">7級</span>
        </div>
      </div>
    </div>
  );
}
