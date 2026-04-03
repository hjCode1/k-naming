import type { OhengElement, OhengDistribution } from '../types';
import { OHENG_LIST } from '../constants/oheng';

/** 오행 요소 배열에서 분포 집계 */
export function countElements(elements: OhengElement[]): OhengDistribution {
  const dist: OhengDistribution = { 목: 0, 화: 0, 토: 0, 금: 0, 수: 0 };
  for (const el of elements) {
    dist[el]++;
  }
  return dist;
}

/** 부족한 오행 (0개인 것) */
export function findDeficientElements(dist: OhengDistribution): OhengElement[] {
  return OHENG_LIST.filter(el => dist[el] === 0);
}

/** 강한 오행 (3개 이상) */
export function findStrongElements(dist: OhengDistribution): OhengElement[] {
  return OHENG_LIST.filter(el => dist[el] >= 3);
}

/** 보완이 필요한 오행 추천: 부족한 오행 우선, 없으면 일간 기준 약한 오행 */
export function getRecommendedElements(
  deficient: OhengElement[],
  _dayMasterElement: OhengElement,
): OhengElement[] {
  if (deficient.length > 0) return deficient;
  // 부족한 오행이 없으면 전체 오행 중 가장 적은 것을 추천
  return [];
}
