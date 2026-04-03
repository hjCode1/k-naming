import type { SuriResult, GyeokResult } from '../types';
import { SURI_TABLE, type SuriEntry } from '../constants/suri';

/** 수리 번호 정규화 (1-81 범위) */
function normalize(n: number): number {
  if (n <= 0) return 1;
  if (n > 81) return ((n - 1) % 81) + 1;
  return n;
}

/** 수리표에서 조회 */
function lookupSuri(n: number): SuriEntry {
  const idx = normalize(n);
  return SURI_TABLE[idx - 1];
}

/** 길흉 등급을 점수로 환산 */
function luckToScore(luck: string): number {
  switch (luck) {
    case '대길': return 100;
    case '길': return 80;
    case '중길': return 60;
    case '반흉': return 40;
    case '흉': return 20;
    case '대흉': return 0;
    default: return 50;
  }
}

function toGyeokResult(n: number): GyeokResult {
  const entry = lookupSuri(n);
  return {
    value: normalize(n),
    luck: entry.luck,
    name: entry.name,
    description: entry.description,
  };
}

/**
 * 4격 수리길흉 계산
 * S = 성씨 획수, A = 이름 첫째자 획수, B = 이름 둘째자 획수
 *
 * 원격(元格) = A + B (이름 총획)
 * 형격(亨格) = S + A (성 + 이름 첫째자)
 * 이격(利格) = S + B (성 + 이름 둘째자)
 * 정격(貞格) = S + A + B (총획)
 */
export function calculateFourStyles(
  surnameStrokes: number,
  char1Strokes: number,
  char2Strokes: number,
): SuriResult {
  const S = surnameStrokes;
  const A = char1Strokes;
  const B = char2Strokes;

  const wonGyeok = toGyeokResult(A + B);
  const hyeongGyeok = toGyeokResult(S + A);
  const iGyeok = toGyeokResult(S + B);
  const jeongGyeok = toGyeokResult(S + A + B);

  // 종합 점수: 4격의 가중 평균 (형격 30%, 이격 30%, 원격 20%, 정격 20%)
  const totalScore = Math.round(
    luckToScore(hyeongGyeok.luck) * 0.3 +
    luckToScore(iGyeok.luck) * 0.3 +
    luckToScore(wonGyeok.luck) * 0.2 +
    luckToScore(jeongGyeok.luck) * 0.2
  );

  return { wonGyeok, hyeongGyeok, iGyeok, jeongGyeok, totalScore };
}
