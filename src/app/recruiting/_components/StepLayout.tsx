import type { ReactNode } from "react";
import { Heading } from "../../../common/Heading";
import { RECRUITING_STEPS } from "../_lib/constants";
import { StepIndicator } from "./StepIndicator";

type StepLayoutProps = {
  /** 완료 화면은 `RECRUITING_STEPS.length + 1`을 넘겨 모든 스텝을 지난 상태로 표시한다. */
  currentStep: number;
  /** h1 제목. 완료 화면처럼 제목이 없는 페이지는 생략한다. */
  title?: string;
  /** 페이지별 레이아웃 클래스. 기본 `gap-10`을 통째로 대체하므로 다른 gap이 필요하면 gap까지 포함해 넘긴다. */
  className?: string;
  children: ReactNode;
};

/** 리크루팅 4개 페이지가 공유하는 페이지 골격: `<main>` + 스텝 표시 + 제목. */
export const StepLayout = ({
  currentStep,
  title,
  className = "gap-10",
  children,
}: StepLayoutProps) => (
  <main
    className={`mx-auto flex w-full max-w-6xl flex-col px-8 py-16 sm:px-12 lg:px-32 xl:px-40 ${className}`}
  >
    <StepIndicator steps={RECRUITING_STEPS} currentStep={currentStep} />
    {title && <Heading as="h1">{title}</Heading>}
    {children}
  </main>
);
