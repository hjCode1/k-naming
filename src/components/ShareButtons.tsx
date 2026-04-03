import { useState, type RefObject } from 'react';
import { exportNameCard } from '../lib/share';

interface ShareButtonsProps {
  cardRef: RefObject<HTMLDivElement | null>;
}

function ShareButtons({ cardRef }: ShareButtonsProps) {
  const [exporting, setExporting] = useState(false);

  const handleExportImage = async () => {
    if (!cardRef.current || exporting) return;
    setExporting(true);
    try {
      await exportNameCard(cardRef.current);
    } catch (err) {
      console.error('Image export failed:', err);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="flex justify-center">
      <button
        onClick={handleExportImage}
        className="w-full max-w-sm py-2.5 px-4 rounded-xl text-sm font-semibold transition-all active:scale-[0.97]
                   bg-[#8B6914] text-white hover:bg-[#7A5C10] shadow-md"
      >
        {exporting ? '저장 중...' : '이미지 저장'}
      </button>
    </div>
  );
}

export default ShareButtons;
