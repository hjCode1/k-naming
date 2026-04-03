import type { AiNameRecommendation } from '../types';

/** Gemini가 성씨를 포함해서 반환할 경우 제거 */
function stripSurname(text: string, surname: string): string {
  if (text.startsWith(surname)) {
    return text.slice(surname.length);
  }
  return text;
}

interface AiNameCardProps {
  names: AiNameRecommendation[];
  isLoading: boolean;
  error: string | null;
  surname: string;
  onSelect: (name: AiNameRecommendation) => void;
  onRetry: () => void;
  selectedHangul?: string;
}

function AiNameCard({ names, isLoading, error, surname, onSelect, onRetry, selectedHangul }: AiNameCardProps) {
  return (
    <div>
      <h3 className="text-lg font-serif font-bold text-charcoal mb-1">
        AI 추천 이름
      </h3>
      <p className="text-xs text-charcoal/40 mb-4">
        사주와 오행 분석을 기반으로 Gemini AI가 추천한 이름입니다
      </p>

      {/* 로딩 */}
      {isLoading && (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="rounded-xl border border-peach/20 p-4 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-16 h-10 bg-peach/20 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-peach/20 rounded w-24" />
                  <div className="h-2.5 bg-peach/10 rounded w-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 에러 */}
      {error && !isLoading && (
        <div className="text-center py-6 bg-red-50 rounded-xl border border-red-100">
          <p className="text-sm text-red-500 mb-3">{error}</p>
          <button
            onClick={onRetry}
            className="text-sm px-4 py-1.5 rounded-lg bg-white border border-red-200 text-red-500 hover:bg-red-50 transition"
          >
            다시 시도
          </button>
        </div>
      )}

      {/* 결과 */}
      {!isLoading && !error && names.length > 0 && (
        <div className="space-y-3">
          {names.map((name, i) => {
            const isSelected = selectedHangul === name.hangul;
            return (
              <button
                key={`${name.hangul}-${i}`}
                onClick={() => onSelect(name)}
                className={`w-full text-left rounded-xl border p-4 transition-all hover:shadow-md ${
                  isSelected
                    ? 'border-rose ring-2 ring-rose/30 bg-rose/5'
                    : 'border-peach/20 bg-white hover:border-rose/40'
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* 이름 */}
                  <div className="text-center shrink-0">
                    <div className="text-xl font-serif font-bold text-charcoal">
                      {surname}{stripSurname(name.hangul, surname)}
                    </div>
                    <div className="text-xs text-charcoal/40 mt-0.5">
                      {stripSurname(name.hanja, surname)}
                    </div>
                  </div>

                  {/* 설명 */}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-charcoal/70 mb-1">
                      {name.meaning}
                    </div>
                    <div className="text-xs text-charcoal/45 leading-relaxed">
                      {name.reason}
                    </div>
                  </div>
                </div>

                {isSelected && (
                  <div className="mt-2 text-xs text-rose font-medium text-right">
                    선택됨
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* 빈 상태 */}
      {!isLoading && !error && names.length === 0 && (
        <div className="text-center py-6 text-sm text-charcoal/40">
          추천 이름을 불러오는 중...
        </div>
      )}
    </div>
  );
}

export default AiNameCard;
