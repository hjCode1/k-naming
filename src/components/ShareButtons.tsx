import { useState, type RefObject } from 'react';
import type { BirthInput } from '../types';
import { encodeToURL, exportNameCard, copyToClipboard } from '../lib/share';

interface ShareButtonsProps {
  input: BirthInput;
  name1Hanja?: string;
  name2Hanja?: string;
  cardRef: RefObject<HTMLDivElement | null>;
}

function ShareButtons({ input, name1Hanja, name2Hanja, cardRef }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [exporting, setExporting] = useState(false);

  const handleCopyLink = async () => {
    const url = encodeToURL(input, name1Hanja, name2Hanja);
    const ok = await copyToClipboard(url);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleExportImage = async () => {
    if (!cardRef.current) return;
    setExporting(true);
    try {
      await exportNameCard(cardRef.current);
    } finally {
      setExporting(false);
    }
  };

  const btnClass =
    'flex-1 py-2.5 px-4 rounded-xl text-sm font-medium transition-all active:scale-[0.97]';

  return (
    <div className="flex gap-3">
      <button
        onClick={handleCopyLink}
        className={`${btnClass} bg-charcoal/5 text-charcoal hover:bg-charcoal/10`}
      >
        {copied ? '복사됨!' : '링크 복사'}
      </button>
      <button
        onClick={handleExportImage}
        disabled={!cardRef.current || exporting}
        className={`${btnClass} bg-rose text-white hover:bg-rose/90 disabled:opacity-50`}
      >
        {exporting ? '저장 중...' : '이미지 저장'}
      </button>
    </div>
  );
}

export default ShareButtons;
