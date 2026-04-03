import { useState, useCallback } from 'react';
import type { BirthInput, SajuResult } from '../types';
import { calculateSaju } from '../lib/saju';

export function useSaju() {
  const [result, setResult] = useState<SajuResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const calculate = useCallback(async (input: BirthInput): Promise<SajuResult> => {
    setIsCalculating(true);
    // Small delay to let UI show loading state
    await new Promise(r => setTimeout(r, 50));
    const sajuResult = calculateSaju(input);
    setResult(sajuResult);
    setIsCalculating(false);
    return sajuResult;
  }, []);

  const reset = useCallback(() => {
    setResult(null);
  }, []);

  return { result, isCalculating, calculate, reset };
}
