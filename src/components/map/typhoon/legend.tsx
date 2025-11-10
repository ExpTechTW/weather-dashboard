export function Legend() {
  return (
    <div className={`
      absolute right-2 bottom-20 flex flex-col space-y-2
      lg:right-4 lg:bottom-24
    `}
    >
      <div className={`
        bg-opacity-80 rounded-lg bg-gray-800 p-3 text-sm text-white shadow-xl
      `}
      >
        <div className="mb-2 font-bold">圖例</div>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="h-1 w-4 rounded bg-white"></div>
            <span>歷史路徑</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`
              h-1 w-4 rounded border-2 border-dashed border-yellow-400
            `}
            >
            </div>
            <span>預測路徑</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-red-500"></div>
            <span>強烈颱風 (≥51 m/s)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-orange-600"></div>
            <span>中度颱風 (33-50 m/s)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
            <span>輕度颱風 (18-32 m/s)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-sky-400"></div>
            <span>熱帶低氣壓 (&lt;18 m/s)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
