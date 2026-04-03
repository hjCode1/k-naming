import { useCallback } from 'react';
import type { HanjaEntry, SuriResult } from '../types';
import { calculateFourStyles } from '../lib/suri';

export function useNameScore(surnameStrokes: number) {
  const calculateScore = useCallback(
    (char1: HanjaEntry, char2: HanjaEntry): SuriResult => {
      return calculateFourStyles(surnameStrokes, char1.strokes, char2.strokes);
    },
    [surnameStrokes],
  );

  return { calculateScore };
}
