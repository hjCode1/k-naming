import { useState, useMemo } from 'react';
import type { HanjaEntry, OhengElement, SuriResult } from '../types';
import { loadHanjaData, filterByElement, filterByReading, getRecommendedHanja } from '../lib/hanja-filter';
import { calculateFourStyles } from '../lib/suri';
import HanjaGrid from './HanjaGrid';
import SuriScoreCard from './SuriScoreCard';
import { OHENG_COLORS, OHENG_HANJA, OHENG_LIST } from '../constants/oheng';

interface HanjaPickerProps {
  surnameStrokes: number;
  deficientElements: OhengElement[];
  onNameSelected: (char1: HanjaEntry, char2: HanjaEntry) => void;
}

function HanjaPicker({ surnameStrokes, deficientElements, onNameSelected }: HanjaPickerProps) {
  const allHanja = useMemo(() => loadHanjaData(), []);

  const [char1, setChar1] = useState<HanjaEntry | null>(null);
  const [char2, setChar2] = useState<HanjaEntry | null>(null);
  const [activeSlot, setActiveSlot] = useState<1 | 2>(1);
  const [readingFilter, setReadingFilter] = useState('');
  const [elementFilter, setElementFilter] = useState<OhengElement[]>(deficientElements);

  // Filter and sort hanja list
  const filteredHanja = useMemo(() => {
    let list = allHanja;
    list = filterByElement(list, elementFilter);
    list = filterByReading(list, readingFilter);
    list = getRecommendedHanja(list, deficientElements);
    return list.slice(0, 60); // show max 60
  }, [allHanja, elementFilter, readingFilter, deficientElements]);

  // Calculate suri when both chars selected
  const suriResult: SuriResult | null = useMemo(() => {
    if (!char1 || !char2) return null;
    return calculateFourStyles(surnameStrokes, char1.strokes, char2.strokes);
  }, [surnameStrokes, char1, char2]);

  // Notify parent when both selected
  const handleSelect = (entry: HanjaEntry) => {
    if (activeSlot === 1) {
      setChar1(entry);
      setActiveSlot(2);
    } else {
      setChar2(entry);
      if (char1) {
        onNameSelected(char1, entry);
      }
    }
  };

  const toggleElementFilter = (el: OhengElement) => {
    setElementFilter(prev =>
      prev.includes(el) ? prev.filter(e => e !== el) : [...prev, el],
    );
  };

  return (
    <div>
      <h3 className="text-lg font-serif font-bold text-charcoal mb-3">
        이름 한자 조합
      </h3>

      {/* 선택 슬롯 */}
      <div className="flex gap-3 mb-4">
        <SlotButton
          label="첫째 자"
          entry={char1}
          isActive={activeSlot === 1}
          onClick={() => setActiveSlot(1)}
          onClear={() => { setChar1(null); setActiveSlot(1); }}
        />
        <SlotButton
          label="둘째 자"
          entry={char2}
          isActive={activeSlot === 2}
          onClick={() => setActiveSlot(2)}
          onClear={() => { setChar2(null); setActiveSlot(2); }}
        />
      </div>

      {/* 수리 결과 (둘 다 선택됐을 때) */}
      {suriResult && (
        <div className="mb-4">
          <SuriScoreCard result={suriResult} />
        </div>
      )}

      {/* 필터 */}
      <div className="flex flex-wrap gap-2 mb-3">
        {/* 오행 필터 */}
        {OHENG_LIST.map(el => (
          <button
            key={el}
            onClick={() => toggleElementFilter(el)}
            className={`text-xs px-2.5 py-1 rounded-full border transition ${
              elementFilter.includes(el)
                ? 'text-white border-transparent'
                : 'text-charcoal/50 border-charcoal/15 bg-white'
            }`}
            style={elementFilter.includes(el) ? { backgroundColor: OHENG_COLORS[el] } : {}}
          >
            {OHENG_HANJA[el]} {el}
          </button>
        ))}

        {/* 음 검색 */}
        <input
          type="text"
          placeholder="음 검색 (예: 민)"
          value={readingFilter}
          onChange={e => setReadingFilter(e.target.value)}
          className="text-xs px-3 py-1 rounded-full border border-charcoal/15 bg-white
                     focus:outline-none focus:ring-1 focus:ring-rose/40 w-28"
        />
      </div>

      {/* 한자 그리드 */}
      <HanjaGrid
        hanjaList={filteredHanja}
        onSelect={handleSelect}
        selectedHanja={
          activeSlot === 1
            ? char1 ? char1.hanja + char1.reading : undefined
            : char2 ? char2.hanja + char2.reading : undefined
        }
      />
    </div>
  );
}

function SlotButton({
  label,
  entry,
  isActive,
  onClick,
  onClear,
}: {
  label: string;
  entry: HanjaEntry | null;
  isActive: boolean;
  onClick: () => void;
  onClear: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`flex-1 rounded-xl p-3 text-center cursor-pointer transition-all ${
        isActive
          ? 'ring-2 ring-rose bg-rose/5'
          : 'bg-white border border-peach/20'
      }`}
    >
      <div className="text-[10px] text-charcoal/40 mb-1">{label}</div>
      {entry ? (
        <>
          <div className="text-2xl font-serif font-bold text-charcoal">{entry.hanja}</div>
          <div className="text-xs text-charcoal/60">{entry.reading} · {entry.meaning}</div>
          <button
            onClick={e => { e.stopPropagation(); onClear(); }}
            className="text-[10px] text-red-400 mt-1 hover:underline"
          >
            취소
          </button>
        </>
      ) : (
        <div className="text-2xl text-charcoal/15 my-1">?</div>
      )}
    </div>
  );
}

export default HanjaPicker;
