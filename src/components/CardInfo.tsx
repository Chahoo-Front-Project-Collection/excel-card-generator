import AlertIcon from "../assets/AlertIcon.svg?react";
import HeaderIcon from "../assets/HeaderIcon.svg?react";
import CardInfoLeftImg from "../assets/CardInfoLeft.svg?react";
import CardInfoRightImg from "../assets/CardInfoRight.svg?react";

interface Props {
  title: string;
}

export function CardInfo({ title }: Props) {
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
            <h3 className="text-black-01 font-extrabold text-base">
              도로 좌측의 경우,
            </h3>
            <div className="text-black-01 text-base space-y-0.5">
              <p>부착된 QR과 가장 가까운 배관이</p>
              <p>1번 배관 입니다.</p>
            </div>
          </div>

          <CardInfoLeftImg className="w-[288px] h-[146px]" />
        </div>

        {/* Section 2: Right Side */}
        <div className="bg-white rounded-xl p-5">
          <div className="space-y-1">
            <h3 className="text-black-01 font-extrabold text-base">
              도로 우측의 경우,
            </h3>
            <div className="text-black-01 text-base space-y-0.5">
              <p>부착된 QR과 가장 가까운 배관이</p>
              <p>1번 배관 입니다.</p>
            </div>
          </div>

          <CardInfoRightImg className="w-[288px] h-[146px]" />
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
