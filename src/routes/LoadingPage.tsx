import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { BirthInput } from '../types';
import { calculateSaju } from '../lib/saju';

const ELEMENTS = [
  { char: '木', color: '#6B9F6B', label: '목' },
  { char: '火', color: '#E07A5F', label: '화' },
  { char: '土', color: '#D4A843', label: '토' },
  { char: '金', color: '#B8B8B8', label: '금' },
  { char: '水', color: '#4A7DA8', label: '수' },
];

function LoadingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const input = location.state as BirthInput | undefined;

  useEffect(() => {
    if (!input) {
      navigate('/', { replace: true });
      return;
    }

    const timer = setTimeout(() => {
      const result = calculateSaju(input);
      navigate('/result', { state: { input, result }, replace: true });
    }, 2500);

    return () => clearTimeout(timer);
  }, [input, navigate]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center">
        {/* 오행 문자 애니메이션 */}
        <div className="flex justify-center gap-4 mb-8">
          {ELEMENTS.map((el, i) => (
            <span
              key={el.char}
              className="text-3xl md:text-4xl font-serif animate-bounce"
              style={{
                color: el.color,
                animationDelay: `${i * 0.15}s`,
                animationDuration: '1.2s',
              }}
            >
              {el.char}
            </span>
          ))}
        </div>

        <p className="text-lg text-charcoal/70 mb-2">
          아이의 사주를 분석 중입니다...
        </p>
        <p className="text-sm text-charcoal/40">
          오행의 균형을 살펴보고 있어요
        </p>

        {/* 프로그레스 바 */}
        <div className="mt-8 w-48 mx-auto h-1 bg-peach/30 rounded-full overflow-hidden">
          <div
            className="h-full bg-rose rounded-full"
            style={{
              animation: 'loading-progress 2.5s ease-in-out forwards',
            }}
          />
        </div>

        <style>{`
          @keyframes loading-progress {
            0% { width: 0%; }
            100% { width: 100%; }
          }
        `}</style>
      </div>
    </div>
  );
}

export default LoadingPage;
