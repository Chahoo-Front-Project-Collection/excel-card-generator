import AlertIcon from "../assets/AlertIcon.svg?react";
import HeaderIcon from "../assets/HeaderIcon.svg?react";
import CardInfoRightImg from "../assets/CardInfoRight.svg?react";
import CrossRoadsImg from "../assets/CrossRoads.svg?react";
import CrossArrowIcon from "../assets/CrossArrowIcon.svg?react";
import CrossLine1 from "../assets/CrossLine1.svg?react";
import CrossLine2 from "../assets/CrossLine2.svg?react";
import type { ExcelRow } from "../types";

interface Props {
  title: string;
  cardRows: ExcelRow[];
}

export function CardInfo({ title, cardRows }: Props) {
  const findRowQr = cardRows.find((row) => row["소유사"] === "qr");

  const northLabel = findRowQr?.["북"];
  const eastLabel = findRowQr?.["동"];
  const southLabel = findRowQr?.["남"];
  const westLabel = findRowQr?.["서"];
  const direction = findRowQr?.["방향"];

  const directionLabel = direction === "세로" ? eastLabel : southLabel;

  return (
    <div className="w-full max-w-[360px] space-y-6 font-medium bg-[#4F709C] px-4 py-6">
      {/* Header Section */}
      <div className="flex flex-col gap-6">
        <HeaderIcon className="w-[124px] h-[33.435px]" />
        {/* Title */}
        <div className="text-center">
          <h1 className="text-white text-[22px] font-extrabold">
            울산 유해화학물질 배관 정보
          </h1>
          <p className="text-white text-[18px] font-extrabold">
            (긴급신고 119)
          </p>
        </div>

        {/* Code Badge */}
        <div className="flex justify-center">
          <div className="bg-white/45 text-white rounded-xl px-5 py-3 inline-flex items-center gap-2">
            <div className="flex items-center gap-4  text-[22px] font-extrabold">
              {title?.split(`-`).map((item, index) => (
                <div key={item} className="flex items-center gap-2">
                  <span> {item.trim()} </span>
                  {index !== item.length - 1 ? <span>-</span> : null}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Info Sections */}
      <div className="flex flex-col gap-6">
        {/* Section 1: Left Side */}
        <div className="bg-white rounded-xl p-5">
          <div className="space-y-1">
            <h3 className="text-black-01 text-base">
              부착된 QR과 가장 가까운 배관이
            </h3>
            <div className="text-black-01 text-base space-y-0.5">
              1번 배관 입니다.
            </div>
          </div>

          <CardInfoRightImg className="w-[288px] h-[146px]" />
        </div>

        {/* Section 2: Right Side */}
        <div className="bg-white rounded-xl p-5">
          <div className="space-y-1 mb-3">
            <h3 className="text-black-01 text-base">
              사거리 지점별 방면 안내:
            </h3>
            <div className="text-black-01 text-base space-y-0.5">
              <p>
                현재 정보는
                <span className="text-red-01"> 붉은 점선으로 표시된</span>
              </p>
              <span className="font-semibold">{directionLabel} </span>
              방향 데이터입니다.
            </div>
          </div>

          <div className="w-[288px] h-[153px] rounded-xl relative">
            <CrossRoadsImg className="absolute top-0 left-0 w-[288px] h-[153px] rounded-xl" />

            {direction === "세로" ? (
              <div className="absolute top-[32%] right-[30%]">
                <CrossLine1 />
              </div>
            ) : (
              <div className="absolute bottom-11 left-1/2 -translate-x-1/2">
                <CrossLine2 />
              </div>
            )}

            {/* 북 - 상단 중앙 */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 flex flex-row items-center font-semibold text-white text-[14px]">
              <CrossArrowIcon width={22} height={22} className="rotate-90" />
              <div className="text-stroke-01" data-text={northLabel}>
                {northLabel}
              </div>
            </div>

            {/* 동 - 우측 중앙 */}
            <div className="absolute right-1 top-[42%] flex flex-row items-center font-semibold text-white text-[14px]">
              <div className="text-stroke-01" data-text={eastLabel}>
                {eastLabel}
              </div>
              <CrossArrowIcon width={22} height={22} className="rotate-180" />
            </div>

            {/* 남 - 하단 중앙 */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex flex-row items-center font-semibold text-white text-[14px]">
              <CrossArrowIcon width={22} height={22} className="-rotate-90" />
              <div className="text-stroke-01" data-text={southLabel}>
                {southLabel}
              </div>
            </div>

            {/* 서 - 좌측 중앙 */}
            <div className="absolute left-1 top-[42%] flex flex-row items-center font-semibold text-white text-[14px]">
              <CrossArrowIcon width={22} height={22} className="" />
              <div className="text-stroke-01" data-text={westLabel}>
                {westLabel}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 bg-white rounded-xl p-5 text-center">
          <div className="flex justify-center">
            <div className="w-6 h-6 text-grey-01">
              <AlertIcon />
            </div>
          </div>
          <p className="text-black-01 text-base">
            본 표지정보는 대략적인 <br />
            지하배관의 위치를 표시합니다.
          </p>
          <p className="text-black-01 text-base font-extrabold">
            본 정보를 활용하여 <br />
            <span className="text-red-01">굴착공사를 진행하지 마십시오.</span>
          </p>
        </div>
      </div>
    </div>
  );
}
