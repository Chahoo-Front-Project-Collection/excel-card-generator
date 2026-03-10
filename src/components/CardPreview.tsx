import { forwardRef, useMemo } from "react";
import type { ExcelRow } from "../types";
import QrIcon from "../assets/QrIcon.svg?react";
import LoadImg from "../assets/LoadImg.svg?react";
import QrIconLarge from "../assets/QrIconLarge.svg?react";

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

    const qrRow = groupRows.find((row) => row["소유사"] === "qr");
    const qrColIndex = qrRow ? parseInt(qrRow["열"] || "0") : -1;

    const maxColumn = groupRows.reduce((max, row) => {
      return Math.max(max, parseInt(row["열"] || "0"));
    }, 0);

    const maxCol = qrColIndex === 0 ? maxColumn + 1 : maxColumn + 1;

    return (
      <div ref={ref} className="rounded-xl overflow-hidden font-medium px-4">
        {/* 도로 번호 섹션 */}
        <div className="flex items-center gap-3 font-extrabold text-[18px] py-6">
          <QrIconLarge className="w-6 h-6" />

          <div className="flex items-center gap-2">
            {groupRows[0]["제목"]?.split(`-`).map((item, index) => (
              <div key={item} className="flex items-center gap-2">
                <span> {item.trim()} </span>
                {index !== item.length - 1 ? <span>-</span> : null}
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {rowGroups.map((group, groupIdx) => {
            if (groupIdx === 0) return null;
            // const maxCol = parseInt(
            //   groupRows[groupRows.length - 1]["열"] || "1",
            // );

            return (
              <div
                key={groupIdx}
                className="rounded-xl"
                style={{
                  boxShadow: `1.188px 2.966px 9.489px 0 rgba(0, 0, 0, 0.25)`,
                }}
              >
                {groupIdx === 1 ? (
                  <LoadImg className="w-full h-fit rounded-t-xl" />
                ) : null}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: `repeat(${qrColIndex === 0 ? maxCol : maxCol - 1}, minmax(0, 1fr))`,
                    borderRadius: `${groupIdx === 1 ? `0px 0px 12px 12px` : `12px`}`,
                  }}
                  className="bg-accent py-2 px-1 h-fit"
                >
                  {/* 모든 칸을 순회하며 QR 또는 번호 배치 */}
                  {Array.from({ length: maxCol }, (_, colIndex) => {
                    if (qrColIndex !== 0 && colIndex === 0) {
                      return null;
                    }
                    if (colIndex === qrColIndex) {
                      return (
                        <div
                          key={colIndex}
                          className="flex items-center justify-center"
                        >
                          <QrIcon className="w-4 h-4 text-white" />
                        </div>
                      );
                    }

                    // QR이 아니면 위치번호 찾기
                    const matchedRow = group.find(
                      (row) =>
                        parseInt(row["열"]) === colIndex &&
                        row["소유사"] !== "qr",
                    );

                    const locationNum = matchedRow?.["위치번호"] || "";
                    const hasData = locationNum && locationNum !== "0";
                    const isHighlight = matchedRow?.["색칠"] === "1" || false;

                    return (
                      <div
                        key={colIndex}
                        className={`flex items-center justify-center `}
                      >
                        <div
                          className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-medium ${
                            hasData
                              ? isHighlight
                                ? "bg-yellow-01 text-black-01"
                                : "bg-grey-01 text-white"
                              : "bg-transparent"
                          }`}
                        >
                          {hasData ? locationNum : ""}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Table */}
        <div className="flex items-center gap-3 font-extrabold text-[18px] py-6">
          <QrIconLarge className="w-6 h-6" />
          <div className="flex items-center gap-2">
            {groupRows[0]["제목"]?.split(`-`).map((item, index) => (
              <div key={item} className="flex items-center gap-2">
                <span> {item.trim()} </span>
                {index !== item.length - 1 ? <span>-</span> : null}
              </div>
            ))}
          </div>
        </div>

        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-accent grid grid-cols-10 rounded-t-xl">
              {displayHeaders.map((header, headerIdx) => (
                <th
                  key={header}
                  className={`px-[6px] py-[4px] text-white text-[13px] text-center font-medium ${headerIdx === 0 ? "col-span-2" : "col-span-4"}`}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="">
            {filteredRows.map((row, idx) => {
              return (
                <tr
                  key={idx}
                  className={`bg-white grid grid-cols-10 border-b border-grey-02 last:border-b-0 text-center ${idx === filteredRows.length - 1 ? "rounded-b-xl" : ""}`}
                >
                  {displayHeaders.map((item, itemIdx) => (
                    <td
                      key={item}
                      className={`flex items-center justify-center p-[6px] text-black-01 text-[13px] ${itemIdx === 0 ? "col-span-2" : "col-span-4"}`}
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
