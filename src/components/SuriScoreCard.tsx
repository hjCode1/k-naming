import type { SuriResult, GyeokResult } from '../types';

interface SuriScoreCardProps {
  result: SuriResult;
}

function luckColor(luck: string): string {
  switch (luck) {
    case '대길': return 'text-green-600 bg-green-50 border-green-200';
    case '길': return 'text-green-500 bg-green-50 border-green-100';
    case '중길': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    case '반흉': return 'text-orange-500 bg-orange-50 border-orange-200';
    case '흉': return 'text-red-500 bg-red-50 border-red-200';
    case '대흉': return 'text-red-700 bg-red-50 border-red-300';
    default: return 'text-gray-500 bg-gray-50 border-gray-200';
  }
}

function scoreColor(score: number): string {
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-yellow-600';
  if (score >= 40) return 'text-orange-500';
  return 'text-red-500';
}

function GyeokRow({ label, gyeok }: { label: string; gyeok: GyeokResult }) {
  return (
    <div className="flex items-center gap-3 py-2">
      <span className="text-xs text-charcoal/50 w-10 shrink-0">{label}</span>
      <span className="text-sm font-mono text-charcoal/70 w-6 text-right">{gyeok.value}</span>
      <span className={`text-xs px-2 py-0.5 rounded border font-medium ${luckColor(gyeok.luck)}`}>
        {gyeok.luck}
      </span>
      <span className="text-xs text-charcoal/50 truncate">{gyeok.name}</span>
    </div>
  );
}

function SuriScoreCard({ result }: SuriScoreCardProps) {
  return (
    <div className="bg-white rounded-xl border border-peach/20 p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-medium text-charcoal">수리길흉 (數理吉凶)</h4>
        <div className="text-right">
          <span className={`text-2xl font-bold ${scoreColor(result.totalScore)}`}>
            {result.totalScore}
          </span>
          <span className="text-xs text-charcoal/40 ml-1">/ 100</span>
        </div>
      </div>

      <div className="divide-y divide-peach/10">
        <GyeokRow label="원격" gyeok={result.wonGyeok} />
        <GyeokRow label="형격" gyeok={result.hyeongGyeok} />
        <GyeokRow label="이격" gyeok={result.iGyeok} />
        <GyeokRow label="정격" gyeok={result.jeongGyeok} />
      </div>
    </div>
  );
}

export default SuriScoreCard;
