import { useRef, useState } from "react";
import { FileUploader } from "./components/FileUploader";
import { CardList } from "./components/CardList";
import { DownloadControls } from "./components/DownloadControls";
import { parseExcel } from "./utils/parseExcel";
import type { ParsedExcel, ExcelRow } from "./types";

export default function App() {
  const [data, setData] = useState<ParsedExcel | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filename, setFilename] = useState<string>("");
  const [cardsCount, setCardsCount] = useState<number>(0);
  const [cards, setCards] = useState<ExcelRow[][]>([]);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleFile = async (file: File) => {
    setError(null);
    setData(null);
    setFilename(file.name);
    try {
      const result = await parseExcel(file);
      if (result.rows.length === 0) {
        setError(
          "데이터가 없습니다. 첫 행이 헤더인 엑셀 파일을 업로드해주세요.",
        );
        return;
      }
      // cardRefs 배열 크기를 충분히 크게 초기화 (최대 카드 수 예상)
      cardRefs.current = new Array(result.rows.length).fill(null);
      setData(result);
    } catch {
      setError(
        "파일을 읽는 중 오류가 발생했습니다. 올바른 엑셀 파일인지 확인해주세요.",
      );
    }
  };

  const handleReset = () => {
    setData(null);
    setError(null);
    setFilename("");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-gray-900">
              Excel → 카드 이미지
            </h1>
            <p className="text-xs text-gray-400">
              엑셀 행을 카드 이미지로 변환
            </p>
          </div>
          {data && (
            <button
              onClick={handleReset}
              className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
            >
              다시 업로드
            </button>
          )}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Upload */}
        {!data && (
          <section className="space-y-4">
            <FileUploader onFile={handleFile} />
            {error && (
              <p className="text-center text-sm text-red-500">{error}</p>
            )}
          </section>
        )}

        {/* Results */}
        {data && (
          <>
            {/* Stats + Download */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-gray-200">
              <div>
                <p className="font-semibold text-gray-800">{filename}</p>
                <p className="text-sm text-gray-400">
                  {data.rows.length}행 · {data.headers.length}열
                </p>
              </div>
              <DownloadControls
                total={cardsCount}
                cardRefs={cardRefs}
                cards={cards}
              />
            </div>

            {/* Card Grid */}
            <CardList
              headers={data.headers}
              rows={data.rows}
              cardRefs={cardRefs}
              onCardsCountChange={setCardsCount}
              onCardsChange={setCards}
            />
          </>
        )}

        {/* Empty state */}
        {!data && !error && (
          <p className="text-center text-xs text-gray-300 pt-4">
            첫 행을 헤더(컬럼명)로 인식합니다
          </p>
        )}
      </main>
    </div>
  );
}
