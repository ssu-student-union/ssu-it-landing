import Image from "next/image";
import astronautImage from "../../../assets/images/complete-astronaut.png";
import {
  ANNOUNCEMENT_DATE,
  formatShortDate,
} from "../../../data/recruitingSchedule";
import { StepIndicator } from "../_components/StepIndicator";

const steps = [
  "개인정보 동의 및 작성",
  "지원 파트 및 지원동기",
  "포트폴리오 제출",
];

export default function RecruitingCompletePage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col items-center gap-16 px-8 py-16 text-center sm:px-12 lg:px-32 xl:px-40">
      <StepIndicator steps={steps} currentStep={steps.length + 1} />

      <div className="relative flex items-center justify-center">
        <div className="absolute size-[280px] rounded-full bg-[#e9edf7] blur-3xl sm:size-[394px]" />
        <Image
          src={astronautImage}
          alt=""
          priority
          className="relative size-[280px] sm:size-[394px]"
        />
      </div>

      <p className="font-semibold text-black text-xl leading-relaxed sm:text-2xl md:text-[1.875rem]">
        서류 합격 발표일은{" "}
        <span className="font-extrabold text-[#142992]">
          {formatShortDate(ANNOUNCEMENT_DATE)}
        </span>{" "}
        입니다!
        <br />
        지원해 주셔서 감사합니다!
      </p>
    </main>
  );
}
