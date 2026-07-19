"use client";

import Image from "next/image";
import { useEffect } from "react";
import astronautImage from "../../../assets/images/complete-astronaut.png";
import {
  ANNOUNCEMENT_DATE,
  formatShortDate,
} from "../../../data/recruitingSchedule";
import { StepLayout } from "../_components/StepLayout";
import { RECRUITING_STEPS, RECRUITING_STORAGE_KEYS } from "../_lib/constants";

export default function RecruitingCompletePage() {
  // 제출이 끝났으니 다음 지원자가 같은 브라우저를 쓸 때 이전 응답이
  // 자동으로 채워지지 않도록 스텝별 임시 저장값을 지운다.
  useEffect(() => {
    for (const key of Object.values(RECRUITING_STORAGE_KEYS)) {
      window.sessionStorage.removeItem(key);
    }
  }, []);

  return (
    <StepLayout
      currentStep={RECRUITING_STEPS.length + 1}
      className="items-center gap-16 text-center"
    >
      <div className="relative flex items-center justify-center">
        <div className="absolute size-[280px] rounded-full bg-brand-tint blur-3xl sm:size-[394px]" />
        <Image
          src={astronautImage}
          alt=""
          priority
          className="relative size-[280px] sm:size-[394px]"
        />
      </div>

      <p className="font-semibold text-black text-xl leading-relaxed sm:text-2xl md:text-[1.875rem]">
        서류 합격 발표일은{" "}
        <span className="font-extrabold text-brand">
          {formatShortDate(ANNOUNCEMENT_DATE)}
        </span>{" "}
        입니다!
        <br />
        지원해 주셔서 감사합니다!
      </p>
    </StepLayout>
  );
}
