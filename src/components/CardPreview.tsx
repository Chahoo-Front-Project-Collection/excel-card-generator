import { forwardRef, useMemo } from "react";
import type { ExcelRow } from "../types";
import QrIcon from "../assets/QrIcon.svg?react";
import LoadImg from "../assets/LoadImg.svg?react";

interface Props {
  groupRows: ExcelRow[];
  headers: string[];
  groupIndex: number;
}

export const CardPreview = forwardRef<HTMLDivElement, Props>(
  ({ groupRows, headers }, ref) => {
    const displayHeaders = headers.filter(
      (h) => h !== "열" && h !== "행" && h !== "제목" && h !== "색칠",
    );

    // "행" 값이 변경되는 시점을 기준으로 그룹 나누기
    const rowGroups = useMemo(() => {
      const result = groupRows.reduce<{
        groups: ExcelRow[][];
        currentGroup: ExcelRow[];
        currentRowValue: string;
      }>(
        (acc, row) => {
          const rowValue = row["행"] || "";

          // "행" 값이 있는 경우
          if (rowValue.trim() !== "") {
            // 현재 "행" 값과 다르면 새로운 그룹 시작
            if (
              rowValue !== acc.currentRowValue &&
              acc.currentGroup.length > 0
            ) {
              return {
                groups: [...acc.groups, acc.currentGroup],
                currentGroup: [row],
                currentRowValue: rowValue,
              };
            }
            return {
              ...acc,
              currentGroup: [...acc.currentGroup, row],
              currentRowValue: rowValue,
            };
          } else {
            // "행" 값이 없으면 현재 그룹에 추가
            return {
              ...acc,
              currentGroup: [...acc.currentGroup, row],
            };
          }
        },
        { groups: [], currentGroup: [], currentRowValue: "" },
      );

      // 마지막 그룹 추가
      return result.currentGroup.length > 0
        ? [...result.groups, result.currentGroup]
        : result.groups;
    }, [groupRows]);

    // 모든 데이터를 필터링 (테이블용)
    const filteredRows = useMemo(() => {
      return groupRows.filter(
        (row) => row["위치번호"]?.trim() !== "" && row["위치번호"] !== "0",
      );
    }, [groupRows]);

    return (
      <div
        ref={ref}
        style={{
          width: 500,
        }}
        className="rounded-2xl shadow-lg overflow-hidden font-medium"
      >
        {/* 도로 번호 섹션 */}

        <LoadImg className="w-full h-fit" />
        <div className="bg-accent p-2">
          {rowGroups.map((group, groupIdx) => {
            // group의 첫 번째 행에 "제목" 값이 있으면 건너뛰기
            const hasTitle = group[0]?.["제목"]?.trim() !== "";
            if (hasTitle) return null;

            const maxCol = parseInt(
              groupRows[groupRows.length - 1]["열"] || "1",
            );

            return (
              <div
                key={groupIdx}
                style={{
                  display: "grid",
                  gridTemplateColumns: `repeat(${maxCol + 1}, minmax(0, 1fr))`,
                }}
                className="bg-accent/80 rounded-lg py-2"
              >
                {/* QR 아이콘 */}
                <div className="w-8 h-8 flex items-center justify-center">
                  <QrIcon className="w-6 h-6 text-white" />
                </div>

                {/* 번호들 - maxCol만큼 칸 생성 */}
                {Array.from({ length: maxCol }, (_, colIndex) => {
                  // 현재 colIndex와 일치하는 "열" 값을 가진 row 찾기
                  const matchedRow = group.find(
                    (row) => parseInt(row["열"]) === colIndex + 1,
                  );

                  const locationNum = matchedRow?.["위치번호"] || "";
                  const hasData = locationNum && locationNum !== "0";
                  // "색칠" 헤더 값이 있으면 하이라이트
                  const isHighlight = matchedRow?.["색칠"]?.trim() !== "";

                  return (
                    <div
                      key={colIndex}
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-medium ${
                        hasData
                          ? isHighlight
                            ? "bg-yellow-01 text-black-01"
                            : "bg-grey-01 text-white"
                          : "bg-transparent"
                      }`}
                    >
                      {hasData ? locationNum : ""}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Table */}
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-accent grid grid-cols-10">
              {displayHeaders.map((header, headerIdx) => (
                <th
                  key={header}
                  className={`p-3 text-white text-xs text-center font-medium ${headerIdx === 0 ? "col-span-2" : "col-span-4"}`}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="bg-white">
            {filteredRows.map((row, idx) => {
              return (
                <tr
                  key={idx}
                  className="grid grid-cols-10 border-b border-grey-02 last:border-b-0 text-center"
                >
                  {displayHeaders.map((item, itemIdx) => (
                    <td
                      key={item}
                      className={`py-2.5 px-3 text-black-01 text-xs ${itemIdx === 0 ? "col-span-2" : "col-span-4"}`}
                    >
                      {row[item] || <span className="text-black-01">-</span>}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  },
);

CardPreview.displayName = "CardPreview";
