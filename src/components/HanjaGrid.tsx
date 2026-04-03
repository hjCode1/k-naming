import type { HanjaEntry, OhengElement } from '../types';
import { OHENG_COLORS } from '../constants/oheng';

interface HanjaGridProps {
  hanjaList: HanjaEntry[];
  onSelect: (entry: HanjaEntry) => void;
  selectedHanja?: string;
}

function HanjaGrid({ hanjaList, onSelect, selectedHanja }: HanjaGridProps) {
  if (hanjaList.length === 0) {
    return <p className="text-sm text-charcoal/40 text-center py-4">표시할 한자가 없습니다</p>;
  }

  return (
    <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2">
      {hanjaList.map((entry, i) => {
        const isSelected = selectedHanja === entry.hanja + entry.reading;
        return (
          <button
            key={`${entry.hanja}-${entry.reading}-${i}`}
            onClick={() => onSelect(entry)}
            className={`rounded-lg p-2 text-center transition-all hover:shadow-md cursor-pointer ${
              isSelected
                ? 'ring-2 ring-rose bg-rose/5'
                : 'bg-white border border-peach/20 hover:border-rose/40'
            }`}
          >
            <div className="text-xl font-serif font-bold text-charcoal">{entry.hanja}</div>
            <div className="text-xs text-charcoal/70 mt-0.5">{entry.reading}</div>
            <div className="text-[10px] text-charcoal/40 truncate">{entry.meaning}</div>
            <div className="flex items-center justify-center gap-1 mt-1">
              <ElementDot element={entry.element} />
              <span className="text-[9px] text-charcoal/35">{entry.strokes}획</span>
            </div>
          </button>
        );
      })}
    </div>
  );
}

function ElementDot({ element }: { element: OhengElement }) {
  return (
    <span
      className="w-2 h-2 rounded-full inline-block"
      style={{ backgroundColor: OHENG_COLORS[element] }}
    />
  );
}

export default HanjaGrid;
