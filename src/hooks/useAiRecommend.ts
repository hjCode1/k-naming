import { useState, useCallback, useRef } from 'react';
import type { SajuResult, AiNameRecommendation, Gender } from '../types';

interface UseAiRecommendReturn {
  names: AiNameRecommendation[];
  isLoading: boolean;
  error: string | null;
  fetchRecommendations: (surname: string, sajuResult: SajuResult, gender: Gender) => Promise<void>;
}

export function useAiRecommend(): UseAiRecommendReturn {
  const [names, setNames] = useState<AiNameRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cacheKeyRef = useRef<string>('');
  const fetchingRef = useRef(false);

  const fetchRecommendations = useCallback(
    async (surname: string, sajuResult: SajuResult, gender: Gender) => {
      const key = `${surname}-${sajuResult.dayMaster}-${sajuResult.deficientElements.join(',')}-${gender}`;

      // 동일 요청 캐시 또는 이미 요청 중이면 스킵
      if (key === cacheKeyRef.current || fetchingRef.current) return;

      fetchingRef.current = true;
      setIsLoading(true);
      setError(null);

      try {
        const res = await fetch('/api/recommend', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            surname,
            dayMaster: sajuResult.dayMaster,
            dayMasterElement: sajuResult.dayMasterElement,
            ohpiengDistribution: sajuResult.ohpiengDistribution,
            deficientElements: sajuResult.deficientElements,
            gender,
          }),
        });

        if (!res.ok) {
          throw new Error('AI 추천을 불러올 수 없습니다');
        }

        const data = await res.json();
        setNames(data.names ?? []);
        cacheKeyRef.current = key;
      } catch (err) {
        setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다');
      } finally {
        setIsLoading(false);
        fetchingRef.current = false;
      }
    },
    [],
  );

  return { names, isLoading, error, fetchRecommendations };
}
