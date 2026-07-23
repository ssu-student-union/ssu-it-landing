"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import toggleCharacterBlackImage from "../../../assets/images/toggle_character_black.webp";
import toggleCharacterWhiteImage from "../../../assets/images/toggle_character_white.webp";
import {
  checkApplicationActiveClient,
  isApplicationActive,
} from "../../../data/recruitingSchedule";

export const RecruitingToggleFAB = () => {
  const [mounted, setMounted] = useState(false);
  const [active, setActive] = useState(isApplicationActive());

  useEffect(() => {
    setActive(checkApplicationActiveClient());
    setMounted(true);
  }, []);

  const handleToggle = () => {
    window.sessionStorage.setItem("MOCK_RECRUITING_ACTIVE", String(!active));
    window.location.reload();
  };

  // 마운트되기 전(SSR)에는 서버 렌더 결과(isApplicationActive())와 일치시키고,
  // 마운트된 이후에만 client-side(sessionStorage 오버라이드 포함) 값을 사용해 렌더링합니다.
  const displayActive = mounted ? active : isApplicationActive();

  const characterImage = displayActive
    ? toggleCharacterWhiteImage
    : toggleCharacterBlackImage;
  const bgColor = displayActive ? "bg-white" : "bg-black";
  const borderClass = displayActive
    ? "border border-neutral-200"
    : "border border-neutral-900";

  return (
    <div className="fixed bottom-6 right-6 z-50 group sm:bottom-10 sm:right-10">
      {/* FAB Button */}
      <button
        type="button"
        onClick={handleToggle}
        className={`relative flex h-16 w-16 items-center justify-center rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.35)] transition-all duration-300 ease-out hover:scale-110 active:scale-95 cursor-pointer overflow-hidden focus:outline-none ${bgColor} ${borderClass}`}
      >
        {/* 캐릭터가 잘림 없이 온전히 표시되도록 object-contain 및 약간의 안쪽 여백 컨테이너 적용 */}
        <div className="relative h-12 w-12">
          <Image
            src={characterImage}
            alt="Toggle Recruiting State"
            fill
            priority
            sizes="48px"
            className="object-contain transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      </button>
    </div>
  );
};
