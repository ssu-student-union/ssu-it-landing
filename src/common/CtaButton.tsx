"use client";

import { type HTMLMotionProps, motion } from "motion/react";
import type { ReactNode } from "react";

/** Figma 원본 디자인의 그라디언트 색(Hero CTA 등). 스톱 간격은 원본처럼 비균등(0/40/75/100%). */
const GRADIENT =
  "linear-gradient(90deg, #6197ee 0%, #10d7e2 40%, #45b5e9 75%, #6197ee 100%)";

type CtaButtonProps = {
  children?: ReactNode;
} & Omit<HTMLMotionProps<"button">, "children">;

/**
 * 랜딩 페이지 CTA 전용 그라디언트 버튼(Hero "지원하기", 마감 화면 "알림 신청하기").
 * 폼 스텝 내비게이션에 쓰는 `Button`은 화면 폭이 커질수록 글자가 30px까지 커지는데,
 * 짧은 CTA 문구엔 과했다 — 여기선 화면 폭과 무관하게 작고 고정된 크기를 쓴다.
 */
export const CtaButton = ({
  className,
  children,
  type = "button",
  ...props
}: CtaButtonProps) => (
  <motion.button
    type={type}
    className={`flex items-center justify-center gap-0.5 whitespace-nowrap rounded-xl px-5 py-2.5 font-semibold text-[#041621] text-base transition-colors sm:text-lg ${className ?? ""}`}
    style={{ backgroundImage: GRADIENT }}
    whileTap={{ scale: 0.97, transition: { duration: 0.1 } }}
    {...props}
  >
    {children}
  </motion.button>
);
