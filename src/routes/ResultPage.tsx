import { useState, useRef, useMemo, useEffect, useCallback } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import type { BirthInput, SajuResult, HanjaEntry, AiNameRecommendation } from '../types';

function stripSurname(text: string, surname: string): string {
  return text.startsWith(surname) ? text.slice(surname.length) : text;
}
import { calculateSaju } from '../lib/saju';
import { getSurnameStrokes } from '../constants/surnames';
import { decodeFromURL } from '../lib/share';
import { useAiRecommend } from '../hooks/useAiRecommend';
import FourPillars from '../components/FourPillars';
import OhengChart from '../components/OhengChart';
import AiNameCard from '../components/AiNameCard';
import HanjaPicker from '../components/HanjaPicker';
import NameCard from '../components/NameCard';
import ShareButtons from '../components/ShareButtons';
import SuriScoreCard from '../components/SuriScoreCard';
import { calculateFourStyles } from '../lib/suri';

interface LocationState {
  input: BirthInput;
  result: SajuResult;
}

function ResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const cardRef = useRef<HTMLDivElement>(null);

  // Resolve input/result from either location state or URL params
  const { input, result } = useMemo(() => {
    const state = location.state as LocationState | undefined;
    if (state?.input && state?.result) {
      return state;
    }
    const decoded = decodeFromURL(searchParams);
    if (decoded) {
      return { input: decoded, result: calculateSaju(decoded) };
    }
    return { input: null, result: null };
  }, [location.state, searchParams]);

  // AI recommendations
  const { names: aiNames, isLoading: aiLoading, error: aiError, fetchRecommendations } = useAiRecommend();
  const [selectedAiName, setSelectedAiName] = useState<AiNameRecommendation | null>(null);

  // Manual name selection
  const [char1, setChar1] = useState<HanjaEntry | null>(null);
  const [char2, setChar2] = useState<HanjaEntry | null>(null);
  const [showManualPicker, setShowManualPicker] = useState(false);

  const surnameStrokes = input ? getSurnameStrokes(input.surname) : 8;

  // Suri for manual selection
  const manualSuriResult = useMemo(() => {
    if (!char1 || !char2) return null;
    return calculateFourStyles(surnameStrokes, char1.strokes, char2.strokes);
  }, [surnameStrokes, char1, char2]);

  // Fetch AI recommendations on mount
  useEffect(() => {
    if (input && result) {
      fetchRecommendations(input.surname, result, input.gender);
    }
  }, [input, result, fetchRecommendations]);

  // Redirect if no data
  useEffect(() => {
    if (!input || !result) {
      navigate('/', { replace: true });
    }
  }, [input, result, navigate]);

  const handleAiNameSelect = useCallback((name: AiNameRecommendation) => {
    setSelectedAiName(name);
    // Clear manual selection when AI name is chosen
    setChar1(null);
    setChar2(null);
  }, []);

  const handleManualNameSelected = useCallback((c1: HanjaEntry, c2: HanjaEntry) => {
    setChar1(c1);
    setChar2(c2);
    // Clear AI selection when manual name is chosen
    setSelectedAiName(null);
  }, []);

  const handleRetryAi = useCallback(() => {
    if (input && result) {
      fetchRecommendations(input.surname, result, input.gender);
    }
  }, [input, result, fetchRecommendations]);

  if (!input || !result) return null;

  // Determine which name card to show
  const showAiCard = selectedAiName !== null;
  const showManualCard = !showAiCard && char1 && char2 && manualSuriResult;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">
      {/* 헤더 */}
      <div className="text-center">
        <h2 className="text-2xl font-serif font-bold text-charcoal mb-1">
          분석 결과
        </h2>
        <p className="text-sm text-charcoal/50">
          {input.surname} 아이 ·{' '}
          {input.birthYear}년 {input.birthMonth}월 {input.birthDay}일 ·{' '}
          {input.gender === 'male' ? '남아' : '여아'}
        </p>
      </div>

      {/* 사주 */}
      <section className="bg-white rounded-2xl border border-peach/20 p-5 md:p-6">
        <FourPillars result={result} />
      </section>

      {/* 오행 */}
      <section className="bg-white rounded-2xl border border-peach/20 p-5 md:p-6">
        <OhengChart result={result} />
      </section>

      {/* AI 추천 이름 */}
      <section className="bg-white rounded-2xl border border-peach/20 p-5 md:p-6">
        <AiNameCard
          names={aiNames}
          isLoading={aiLoading}
          error={aiError}
          surname={input.surname}
          onSelect={handleAiNameSelect}
          onRetry={handleRetryAi}
          selectedHangul={selectedAiName?.hangul}
        />
      </section>

      {/* AI 선택 이름의 상세 카드 */}
      {showAiCard && (
        <section className="space-y-4">
          <div className="bg-gradient-to-br from-cream to-peach/20 rounded-2xl p-6 md:p-8 border border-peach/30 max-w-sm mx-auto text-center"
               ref={cardRef}
               style={{ fontFamily: '"Noto Serif KR", serif' }}>
            <div className="text-3xl font-bold text-charcoal tracking-wide mb-1">
              {input.surname}{stripSurname(selectedAiName.hangul, input.surname)}
            </div>
            <div className="text-lg text-charcoal/50 tracking-widest mb-4">
              {stripSurname(selectedAiName.hanja, input.surname)}
            </div>
            <div className="w-12 h-px bg-peach mx-auto mb-4" />
            <div className="text-sm text-charcoal/60 mb-2">{selectedAiName.meaning}</div>
            <div className="text-xs text-charcoal/45 leading-relaxed mb-4">{selectedAiName.reason}</div>
            <div className="text-center text-xs text-charcoal/50 mb-1">
              양력 {result.solarDate.year}.{result.solarDate.month}.{result.solarDate.day}
            </div>
            <div className="text-center text-xs text-charcoal/40">
              음력 {result.lunarDate.year}.{result.lunarDate.month}.{result.lunarDate.day}
            </div>
            <div className="text-center text-[9px] text-charcoal/20 mt-4">
              K-Naming · 우리 아이 이름 짓기
            </div>
          </div>
          <ShareButtons
            input={input}
            cardRef={cardRef}
          />
        </section>
      )}

      {/* 직접 조합하기 토글 */}
      <div className="text-center">
        <button
          onClick={() => setShowManualPicker(!showManualPicker)}
          className="text-sm text-charcoal/50 hover:text-charcoal/70 transition inline-flex items-center gap-1"
        >
          <span>{showManualPicker ? '▲' : '▼'}</span>
          직접 한자 조합하기
        </button>
      </div>

      {/* 직접 조합 */}
      {showManualPicker && (
        <section className="bg-white rounded-2xl border border-peach/20 p-5 md:p-6">
          <HanjaPicker
            surnameStrokes={surnameStrokes}
            deficientElements={result.deficientElements}
            onNameSelected={handleManualNameSelected}
          />
        </section>
      )}

      {/* 직접 조합 이름 카드 + 공유 */}
      {showManualCard && char1 && char2 && manualSuriResult && (
        <section className="space-y-4">
          <SuriScoreCard result={manualSuriResult} />
          <NameCard
            ref={cardRef}
            surname={input.surname}
            char1={char1}
            char2={char2}
            sajuResult={result}
            suriResult={manualSuriResult}
          />
          <ShareButtons
            input={input}
            name1Hanja={char1.hanja}
            name2Hanja={char2.hanja}
            cardRef={cardRef}
          />
        </section>
      )}

      {/* 다시 하기 */}
      <div className="text-center pt-4">
        <button
          onClick={() => navigate('/')}
          className="text-sm text-charcoal/40 hover:text-charcoal/60 underline transition"
        >
          다시 하기
        </button>
      </div>
    </div>
  );
}

export default ResultPage;
