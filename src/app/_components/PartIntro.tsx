"use client";

import Image from "next/image";
import { useState } from "react";
import backendIcon from "../../assets/icons/backend.svg";
import chevronIcon from "../../assets/icons/chevron.svg";
import designIcon from "../../assets/icons/design.svg";
import frontendIcon from "../../assets/icons/frontend.svg";
import hrIcon from "../../assets/icons/hr.svg";
import productIcon from "../../assets/icons/product.svg";

const PART_CARD_GRADIENT =
  "linear-gradient(54.28deg, #6197ee 3.19%, #45b5e9 50.1%, #10d7e2 91.44%)";

const PART_CARD_BACK_GRADIENT = `linear-gradient(rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.25)), ${PART_CARD_GRADIENT}`;

const VISIBLE_COUNT = 4;

const PARTS = [
  {
    label: "Product",
    description:
      "프로젝트의 방향과 일정을 관리합니다. 파트 간 협업이 매끄럽게 굴러가도록 조율합니다.\n 아이디어가 실제 서비스로 완성되게 이끕니다.",
    icon: productIcon,
  },
  {
    label: "Design",
    description:
      "서비스의 화면과 사용자 경험을 설계합니다.\n보기 좋고 쓰기 편한 인터페이스를 디자인합니다. IT지원위원회의 시각적 정체성을 만듭니다.",
    icon: designIcon,
  },
  {
    label: "Backend",
    description:
      "서비스의 데이터와 핵심 로직을 담당합니다. 서버가 안정적으로 돌아가도록 관리합니다.\n눈에 안 보이는 곳에서 서비스를 떠받칩니다.",
    icon: backendIcon,
  },
  {
    label: "Frontend",
    description:
      "디자인을 실제 동작하는 화면으로 구현합니다. 사용자와 서비스가 만나는 접점을 만듭니다.\n빠르고 편안한 사용 경험을 완성합니다.",
    icon: frontendIcon,
  },
  {
    label: "HR",
    description:
      "위원 리크루팅과 조직 관리를 담당합니다.\nIT지원위원회의 문화와 팀워크를 가꿉니다. 사람과 조직이 함께 성장하게 돕습니다.",
    icon: hrIcon,
  },
];

export const PartIntro = () => {
  const [start, setStart] = useState(0);
  const maxStart = PARTS.length - VISIBLE_COUNT;

  const goPrev = () => setStart((prev) => Math.max(0, prev - 1));
  const goNext = () => setStart((prev) => Math.min(maxStart, prev + 1));

  return (
    <div className="relative px-4 py-32">
      <div className="absolute top-0 left-8">
        <p
          aria-hidden
          className="pointer-events-none select-none text-[9.375rem] font-bold leading-none text-[#dddddd]/[0.14]"
        >
          Part
        </p>
        <h2 className="absolute inset-0 flex items-end justify-center whitespace-nowrap pb-4 text-5xl leading-none font-bold text-white">
          파트 소개
        </h2>
      </div>

      <div className="relative mx-auto flex max-w-5xl items-center justify-end">
        <div className="flex h-9 w-[4.6875rem] items-center justify-center gap-7 rounded-[1.25rem] border border-white p-2">
          <button
            type="button"
            onClick={goPrev}
            disabled={start === 0}
            aria-label="이전 파트"
            className="disabled:opacity-30"
          >
            <Image
              src={chevronIcon}
              alt=""
              width={9}
              height={30}
              className="rotate-180 cursor-pointer"
            />
          </button>
          <button
            type="button"
            onClick={goNext}
            disabled={start === maxStart}
            aria-label="다음 파트"
            className="disabled:opacity-30"
          >
            <Image
              src={chevronIcon}
              alt=""
              width={9}
              height={30}
              className="cursor-pointer"
            />
          </button>
        </div>
      </div>

      <div className="relative mx-auto mt-16 max-w-5xl overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            width: `${(PARTS.length / VISIBLE_COUNT) * 100}%`,
            transform: `translateX(-${start * (100 / PARTS.length)}%)`,
          }}
        >
          {PARTS.map((part) => (
            <div
              key={part.label}
              className="group h-68 shrink-0 px-4 perspective-[1000px]"
              style={{ width: `${100 / PARTS.length}%` }}
            >
              <div className="relative h-full w-full transition-transform duration-700 ease-in-out transform-3d group-hover:rotate-y-180">
                <div
                  className="absolute inset-0 flex flex-col justify-between rounded-lg py-5 px-6 shadow-[6px_6px_4px_2px_#303030] backface-hidden"
                  style={{ backgroundImage: PART_CARD_GRADIENT }}
                >
                  <p className="text-4xl font-semibold text-[#2f2f2f]">
                    {part.label}
                  </p>
                  <div className="flex w-full justify-end">
                    <Image src={part.icon} alt="" width={54} height={54} />
                  </div>
                </div>

                <div
                  className="absolute inset-0 flex rotate-y-180 flex-col gap-3 rounded-lg py-5 px-6 shadow-[6px_6px_4px_2px_#303030] backface-hidden"
                  style={{ backgroundImage: PART_CARD_BACK_GRADIENT }}
                >
                  <p className="text-4xl font-semibold text-white">
                    {part.label}
                  </p>
                  <p className="whitespace-pre-line text-base leading-relaxed font-medium text-white">
                    {part.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
