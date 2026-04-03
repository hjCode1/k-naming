import type { SajuResult } from '../types';
import PillarCard from './PillarCard';
import { GAN_KOREAN, OHENG_HANJA } from '../constants/oheng';

interface FourPillarsProps {
  result: SajuResult;
}

function FourPillars({ result }: FourPillarsProps) {
  return (
    <div>
      <h3 className="text-lg font-serif font-bold text-charcoal mb-3">
        사주 팔자 (四柱八字)
      </h3>

      <div className="grid grid-cols-4 gap-2 md:gap-3 mb-4">
        {result.hourPillar ? (
          <PillarCard pillar={result.hourPillar} label="시주" />
        ) : (
          <div className="rounded-xl p-3 text-center bg-gray-50 border border-dashed border-gray-200">
            <div className="text-xs text-charcoal/50 mb-2 font-medium">시주</div>
            <div className="text-2xl text-charcoal/20 my-4">?</div>
            <div className="text-[10px] text-charcoal/30">미상</div>
          </div>
        )}
        <PillarCard pillar={result.dayPillar} label="일주" highlight />
        <PillarCard pillar={result.monthPillar} label="월주" />
        <PillarCard pillar={result.yearPillar} label="년주" />
      </div>

      <div className="text-sm text-charcoal/60 bg-cream/80 rounded-lg px-4 py-2.5">
        <span className="font-medium">일간(Day Master):</span>{' '}
        <span className="font-serif text-base" style={{ color: `var(--oheng-color)` }}>
          {result.dayMaster}
        </span>{' '}
        ({GAN_KOREAN[result.dayMaster]}) —{' '}
        {OHENG_HANJA[result.dayMasterElement]} {result.dayMasterElement}
      </div>
    </div>
  );
}

export default FourPillars;
