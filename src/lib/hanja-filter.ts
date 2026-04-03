import type { HanjaEntry, OhengElement } from '../types';
import rawHanja from '../data/hanja.json';

interface RawHanja {
  h: string;
  m: string;
  r: string;
  s: number;
  e: string;
}

/** 한자 데이터 로드 및 변환 */
export function loadHanjaData(): HanjaEntry[] {
  return (rawHanja as RawHanja[]).map(item => ({
    hanja: item.h,
    meaning: item.m,
    reading: item.r,
    strokes: item.s,
    element: item.e as OhengElement,
  }));
}

/** 오행으로 필터링 */
export function filterByElement(
  list: HanjaEntry[],
  elements: OhengElement[],
): HanjaEntry[] {
  if (elements.length === 0) return list;
  return list.filter(h => elements.includes(h.element));
}

/** 음(읽기)으로 필터링 */
export function filterByReading(
  list: HanjaEntry[],
  reading: string,
): HanjaEntry[] {
  if (!reading) return list;
  return list.filter(h => h.reading.includes(reading));
}

/** 추천 한자 정렬: 부족 오행 매칭 → 기타 */
export function getRecommendedHanja(
  list: HanjaEntry[],
  deficientElements: OhengElement[],
): HanjaEntry[] {
  if (deficientElements.length === 0) return list;

  const matching = list.filter(h => deficientElements.includes(h.element));
  const others = list.filter(h => !deficientElements.includes(h.element));

  return [...matching, ...others];
}
