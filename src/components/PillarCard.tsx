import type { Pillar } from '../types';
import { OHENG_COLORS, GAN_KOREAN, ZHI_KOREAN } from '../constants/oheng';

interface PillarCardProps {
  pillar: Pillar;
  label: string;
  highlight?: boolean;
}

function PillarCard({ pillar, label, highlight }: PillarCardProps) {
  return (
    <div
      className={`rounded-xl p-3 text-center transition-all ${
        highlight
          ? 'bg-rose/10 border-2 border-rose/40 shadow-sm'
          : 'bg-white border border-peach/20'
      }`}
    >
      <div className="text-xs text-charcoal/50 mb-2 font-medium">{label}</div>

      {/* 천간 */}
      <div
        className="text-2xl md:text-3xl font-serif font-bold mb-0.5"
        style={{ color: OHENG_COLORS[pillar.ganElement] }}
      >
        {pillar.gan}
      </div>
      <div className="text-[10px] text-charcoal/40 mb-2">
        {GAN_KOREAN[pillar.gan]} ({pillar.ganElement})
      </div>

      {/* 지지 */}
      <div
        className="text-2xl md:text-3xl font-serif font-bold mb-0.5"
        style={{ color: OHENG_COLORS[pillar.zhiElement] }}
      >
        {pillar.zhi}
      </div>
      <div className="text-[10px] text-charcoal/40 mb-2">
        {ZHI_KOREAN[pillar.zhi]} ({pillar.zhiElement})
      </div>

      {/* 납음 */}
      <div className="text-[10px] text-charcoal/30 mt-1">{pillar.napiyin}</div>
    </div>
  );
}

export default PillarCard;
