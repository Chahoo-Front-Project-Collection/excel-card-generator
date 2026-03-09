import { useState } from "react";
import { downloadAllCards } from "../utils/captureCard";
import type { ExcelRow } from "../types";

interface Props {
  total: number;
  cardRefs: React.RefObject<(HTMLDivElement | null)[]>;
  cards: ExcelRow[][];
}

export function DownloadControls({ total, cardRefs, cards }: Props) {
  const [progress, setProgress] = useState<{
    current: number;
    total: number;
  } | null>(null);

  const handleDownloadAll = async () => {
    setProgress({ current: 0, total });
    try {
      await downloadAllCards(
        (i) => cardRefs.current[i] ?? null,
        total,
        (current, total) => setProgress({ current, total }),
        (i) => `${cards[i]?.[0]?.["제목"] || `card_${i + 1}`}.png`
      );
    } finally {
      setProgress(null);
    }
  };

  const isDownloading = progress !== null;

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        onClick={handleDownloadAll}
        disabled={isDownloading}
        className="flex flex-col items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
      >
        <div className="flex justify-around w-full">
          <div>
            {isDownloading
              ? `처리 중... (${progress!.current}/${progress!.total})`
              : `전체 다운로드 ZIP (${total}장)`}
          </div>
        </div>
      </button>
    </div>
  );
}
