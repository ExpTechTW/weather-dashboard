import { getIntensityColor } from '@/lib/utils';

export default function IntensityColors() {
  return (
    <div className="rounded-lg bg-white/10 p-2">
      <div className="grid grid-cols-1 gap-1">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded" style={{ backgroundColor: getIntensityColor(0) }} />
          <span className="text-sm text-white">0級 無感</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded" style={{ backgroundColor: getIntensityColor(1) }} />
          <span className="text-sm text-white">1級 微震</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded" style={{ backgroundColor: getIntensityColor(2) }} />
          <span className="text-sm text-white">2級 輕震</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded" style={{ backgroundColor: getIntensityColor(3) }} />
          <span className="text-sm text-white">3級 弱震</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded" style={{ backgroundColor: getIntensityColor(4) }} />
          <span className="text-sm text-white">4級 中震</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded" style={{ backgroundColor: getIntensityColor(5) }} />
          <span className="text-sm text-white">5級 強震</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded" style={{ backgroundColor: getIntensityColor(6) }} />
          <span className="text-sm text-white">6級 烈震</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded" style={{ backgroundColor: getIntensityColor(7) }} />
          <span className="text-sm text-white">7級 劇震</span>
        </div>
      </div>
    </div>
  );
}
