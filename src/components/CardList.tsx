import { useState, useMemo } from "react";
import type { ExcelRow } from "../types";
import { CardPreview } from "./CardPreview";
import { downloadSingleCard } from "../utils/captureCard";

interface Props {
  headers: string[];
  rows: ExcelRow[];
  cardRefs: React.RefObject<(HTMLDivElement | null)[]>;
  onCardsCountChange?: (count: number) => void;
  onCardsChange?: (cards: ExcelRow[][]) => void;
}

export function CardList({
  headers,
  rows,
  cardRefs,
  onCardsCountChange,
  onCardsChange,
}: Props) {
  const [page, setPage] = useState(0);
  const [downloading, setDownloading] = useState<number | null>(null);

  // "제목" 값을 기준으로 카드(그룹) 나누기
  const cards = useMemo(() => {
    const result: ExcelRow[][] = [];
    let currentCard: ExcelRow[] = [];

    rows.forEach((row) => {
      const title = row["제목"] || "";

      // "제목" 값이 있으면 새로운 카드 시작
      if (title.trim() !== "") {
        if (currentCard.length > 0) {
          result.push(currentCard);
        }
        currentCard = [row];
      } else {
        // "제목" 값이 없으면 현재 카드에 추가
        currentCard.push(row);
      }
    });

    // 마지막 카드 추가
    if (currentCard.length > 0) {
      result.push(currentCard);
    }

    // 카드 수를 상위 컴포넌트로 전달
    onCardsCountChange?.(result.length);
    // 카드 배열을 상위 컴포넌트로 전달
    onCardsChange?.(result);

    return result;
  }, [rows, onCardsCountChange, onCardsChange]);

  const totalPages = Math.ceil(cards.length / 12);
  const PAGE_SIZE = 12;
  const currentPageCards = cards.slice(
    page * PAGE_SIZE,
    (page + 1) * PAGE_SIZE,
  );
  const pageOffset = page * PAGE_SIZE;

  const handleDownloadOne = async (cardRows: ExcelRow[], cardIndex: number) => {
    const globalIndex = pageOffset + cardIndex;
    const el = cardRefs.current[globalIndex];
    if (!el) return;
    setDownloading(cardIndex);

    try {
      await downloadSingleCard(el, `${cardRows[0]["제목"]}.png`);
    } finally {
      setDownloading(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {currentPageCards.map((cardRows, i) => {
          const globalIndex = pageOffset + i;

          return (
            <div key={globalIndex} className="flex flex-col gap-2">
              <div className="font-medium">{cardRows[0]["제목"]}</div>

              <CardPreview
                ref={(el) => {
                  cardRefs.current[globalIndex] = el;
                }}
                groupRows={cardRows}
                headers={headers}
                groupIndex={globalIndex}
              />
              <button
                onClick={() => handleDownloadOne(cardRows, i)}
                disabled={downloading === i}
                className="text-xs text-center py-1.5 rounded-lg bg-gray-100 hover:bg-blue-50 hover:text-blue-600 text-gray-500 transition-colors disabled:opacity-50"
              >
                {downloading === i ? "캡처 중..." : "이미지 다운"}
              </button>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="px-3 py-1.5 rounded-lg text-sm bg-white border border-gray-200 hover:border-blue-400 disabled:opacity-40 transition-colors"
          >
            이전
          </button>
          <span className="text-sm text-gray-500">
            {page + 1} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page === totalPages - 1}
            className="px-3 py-1.5 rounded-lg text-sm bg-white border border-gray-200 hover:border-blue-400 disabled:opacity-40 transition-colors"
          >
            다음
          </button>
        </div>
      )}
    </div>
  );
}
