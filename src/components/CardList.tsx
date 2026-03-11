import { useState, useMemo } from "react";
import type { ExcelRow } from "../types";
import { CardPreview } from "./CardPreview";
import { CardInfo } from "./CardInfo";
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
  const [downloadingFont, setDownloadingFont] = useState<number | null>(null);

  // "제목" 값을 기준으로 카드(그룹) 나누기
  const cards = useMemo(() => {
    const result: ExcelRow[][] = [];
    let currentCard: ExcelRow[] = [];
    let currentTitle = "";

    rows.forEach((row) => {
      // 모든 헤더 값이 빈 문자열인지 확인
      const hasAnyValue = Object.values(row).some(
        (value) => value && value.toString().trim() !== "",
      );

      // 모든 값이 비어있으면 건너뛰기
      if (!hasAnyValue) {
        return;
      }

      const title = row["제목"] || "";

      // "제목" 값이 있고, 이전 제목과 다르면 새로운 카드 시작
      if (title.trim() !== "") {
        // 제목이 변경되었고, 현재 카드에 데이터가 있으면 저장
        if (title !== currentTitle && currentCard.length > 0) {
          result.push(currentCard);
          currentCard = [];
        }
        currentTitle = title;
      }

      // 현재 카드에 행 추가
      currentCard.push(row);
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
      await downloadSingleCard(el, `${cardRows[0]["제목"]}.png`, false);
    } finally {
      setDownloading(null);
    }
  };
  const handleDownloadOneFont = async (
    cardRows: ExcelRow[],
    cardIndex: number,
  ) => {
    const globalIndex = pageOffset + cardIndex;
    const el = cardRefs.current[globalIndex];
    if (!el) return;
    setDownloadingFont(cardIndex);

    try {
      await downloadSingleCard(el, `${cardRows[0]["제목"]}.png`, true);
    } finally {
      setDownloadingFont(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {currentPageCards.map((cardRows, i) => {
          const globalIndex = pageOffset + i;

          return (
            <div key={globalIndex} className="flex flex-col w-[360px]">
              <div
                ref={(el) => {
                  cardRefs.current[globalIndex] = el;
                }}
                className="bg-[#D9E4F4] flex flex-col pb-4"
              >
                <CardInfo title={cardRows[0]["제목"] || "No Title"} />
                <CardPreview
                  groupRows={cardRows}
                  headers={headers}
                  groupIndex={globalIndex}
                />
              </div>

              <div className="flex justify-between gap-2 mt-6">
                <button
                  onClick={() => handleDownloadOne(cardRows, i)}
                  disabled={downloading === i}
                  className="flex-1 text-xs text-center py-1.5 rounded-lg bg-gray-100 hover:bg-blue-50 hover:text-blue-600 text-gray-500 transition-colors disabled:opacity-50"
                >
                  {downloading === i
                    ? "캡처 중..."
                    : "이미지 다운 (폰트X/속도빠름)"}
                </button>

                <button
                  onClick={() => handleDownloadOneFont(cardRows, i)}
                  disabled={downloadingFont === i}
                  className="flex-1 text-xs text-center py-1.5 rounded-lg bg-gray-100 hover:bg-blue-50 hover:text-blue-600 text-gray-500 transition-colors disabled:opacity-50"
                >
                  {downloadingFont === i
                    ? "캡처 중..."
                    : "이미지 다운 (폰트포함/속도느림)"}
                </button>
              </div>
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
