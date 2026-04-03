import type { SajuResult } from '../types';
import { OHENG_COLORS, OHENG_HANJA, OHENG_LIST } from '../constants/oheng';

interface OhengChartProps {
  result: SajuResult;
}

function OhengChart({ result }: OhengChartProps) {
  const dist = result.ohpiengDistribution;
  const maxCount = Math.max(...OHENG_LIST.map(el => dist[el]), 1);

  return (
    <div>
      <h3 className="text-lg font-serif font-bold text-charcoal mb-3">
        오행 분포 (五行)
      </h3>

      <div className="space-y-2.5">
        {OHENG_LIST.map(el => {
          const count = dist[el];
          const pct = (count / maxCount) * 100;
          const isDeficient = result.deficientElements.includes(el);
          const isStrong = result.strongElements.includes(el);

          return (
            <div key={el} className="flex items-center gap-3">
              <div className="w-14 flex items-center gap-1 shrink-0">
                <span className="font-serif text-lg" style={{ color: OHENG_COLORS[el] }}>
                  {OHENG_HANJA[el]}
                </span>
                <span className="text-xs text-charcoal/50">{el}</span>
              </div>

              <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden relative">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.max(pct, 4)}%`,
                    backgroundColor: OHENG_COLORS[el],
                    opacity: isDeficient ? 0.4 : 1,
                  }}
                />
              </div>

              <div className="w-8 text-right text-sm font-medium text-charcoal/70">
                {count}
              </div>

              <div className="w-10">
                {isDeficient && (
                  <Badge text="부족" color="red" />
                )}
                {isStrong && (
                  <Badge text="강" color="blue" />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {result.deficientElements.length > 0 && (
        <p className="mt-4 text-sm text-charcoal/60 bg-red-50 rounded-lg px-4 py-2.5">
          부족한 오행:{' '}
          <strong>
            {result.deficientElements.map(el => `${OHENG_HANJA[el]}(${el})`).join(', ')}
          </strong>
          — 이름에서 보완하면 좋습니다.
        </p>
      )}
    </div>
  );
}

function Badge({ text, color }: { text: string; color: 'red' | 'blue' }) {
  const colors = color === 'red'
    ? 'bg-red-100 text-red-600 border-red-200'
    : 'bg-blue-100 text-blue-600 border-blue-200';
  return (
    <span className={`text-[10px] px-1.5 py-0.5 rounded border font-medium ${colors}`}>
      {text}
    </span>
  );
}

export default OhengChart;
