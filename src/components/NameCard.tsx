import { forwardRef } from 'react';
import type { HanjaEntry, SajuResult, SuriResult } from '../types';
import { OHENG_COLORS, OHENG_HANJA, OHENG_LIST, GAN_KOREAN, ZHI_KOREAN } from '../constants/oheng';

interface NameCardProps {
  surname: string;
  char1: HanjaEntry;
  char2: HanjaEntry;
  sajuResult: SajuResult;
  suriResult: SuriResult;
}

const NameCard = forwardRef<HTMLDivElement, NameCardProps>(
  ({ surname, char1, char2, sajuResult, suriResult }, ref) => {
    const fullNameHangul = surname + char1.reading + char2.reading;
    const fullNameHanja = char1.hanja + char2.hanja;

    const formatPillar = (p: { gan: string; zhi: string }) =>
      `${GAN_KOREAN[p.gan]}${ZHI_KOREAN[p.zhi]}(${p.gan}${p.zhi})`;

    return (
      <div
        ref={ref}
        className="bg-gradient-to-br from-cream to-peach/20 rounded-2xl p-6 md:p-8 border border-peach/30 max-w-sm mx-auto"
        style={{ fontFamily: '"Noto Serif KR", serif' }}
      >
        {/* 이름 */}
        <div className="text-center mb-5">
          <div className="text-3xl font-bold text-charcoal tracking-wide mb-1">
            {fullNameHangul}
          </div>
          <div className="text-lg text-charcoal/50 tracking-widest">
            {fullNameHanja}
          </div>
        </div>

        {/* 구분선 */}
        <div className="w-12 h-px bg-peach mx-auto mb-5" />

        {/* 생년월일 */}
        <div className="text-center text-xs text-charcoal/50 mb-4">
          <div>
            양력 {sajuResult.solarDate.year}.{sajuResult.solarDate.month}.{sajuResult.solarDate.day}
          </div>
          <div>
            음력 {sajuResult.lunarDate.year}.{sajuResult.lunarDate.month}.{sajuResult.lunarDate.day}
          </div>
        </div>

        {/* 사주 요약 */}
        <div className="text-center text-xs text-charcoal/60 mb-4">
          {formatPillar(sajuResult.yearPillar)} · {formatPillar(sajuResult.monthPillar)} · {formatPillar(sajuResult.dayPillar)}
          {sajuResult.hourPillar && <> · {formatPillar(sajuResult.hourPillar)}</>}
        </div>

        {/* 오행 미니차트 */}
        <div className="flex justify-center gap-2 mb-4">
          {OHENG_LIST.map(el => {
            const count = sajuResult.ohpiengDistribution[el];
            return (
              <div key={el} className="text-center">
                <div
                  className="text-sm font-bold"
                  style={{ color: OHENG_COLORS[el], opacity: count === 0 ? 0.3 : 1 }}
                >
                  {OHENG_HANJA[el]}
                </div>
                <div className="text-[10px] text-charcoal/40">{count}</div>
              </div>
            );
          })}
        </div>

        {/* 수리 점수 */}
        <div className="text-center">
          <span className="text-xs text-charcoal/40">수리점수</span>{' '}
          <span className="text-lg font-bold text-charcoal">{suriResult.totalScore}</span>
          <span className="text-xs text-charcoal/40">/100</span>
        </div>

        {/* 워터마크 */}
        <div className="text-center text-[9px] text-charcoal/20 mt-4">
          K-Naming · 우리 아이 이름 짓기
        </div>
      </div>
    );
  },
);

NameCard.displayName = 'NameCard';

export default NameCard;
