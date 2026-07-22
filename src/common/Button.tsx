"use client";

import { type HTMLMotionProps, motion } from "motion/react";
import Image from "next/image";
import type { ReactNode } from "react";
import arrowIcon from "../assets/icons/arrow.svg";

/** Figma 원본 디자인의 그라디언트 색(Hero CTA 등). 스톱 간격은 원본처럼 비균등(0/40/75/100%). */
const GRADIENT =
  "linear-gradient(90deg, #6197ee 0%, #10d7e2 40%, #45b5e9 75%, #6197ee 100%)";

type ButtonSize = "sm" | "md" | "lg";

/** 크기별 padding/글자/아이콘 프리셋. `size`를 지정하면 이 값으로 고정된다. */
const SIZE_PRESETS: Record<ButtonSize, { control: string; icon: string }> = {
  sm: { control: "px-4 py-2 text-lg", icon: "size-6" },
  md: { control: "px-5 py-2.5 text-2xl", icon: "size-8" },
  lg: { control: "px-5 py-3 text-[1.875rem]", icon: "size-10" },
};

/** `size` 미지정 시 기본값: 화면 폭이 커질수록 sm → md → lg로 자동 확대된다. */
const RESPONSIVE_CONTROL_CLASSES =
  "px-4 py-2 text-lg sm:px-5 sm:py-2.5 sm:text-2xl md:px-5 md:py-3 md:text-[1.875rem]";
const RESPONSIVE_ICON_CLASSES = "size-6 sm:size-8 md:size-10";

type ButtonProps = {
  icon?: "prev" | "next";
  /** true면 브랜드 solid 대신 유동적으로 흐르는 그라디언트 배경을 쓴다(Hero CTA 등). */
  gradient?: boolean;
  /** 생략하면 화면 폭에 따라 sm→md→lg로 자동 확대된다. 특정 크기로 고정하려면 지정한다. */
  size?: ButtonSize;
  children?: ReactNode;
} & Omit<HTMLMotionProps<"button">, "children">;

export const Button = ({
  icon,
  gradient,
  size,
  className,
  children,
  type = "button",
  ...props
}: ButtonProps) => {
  const controlClassName = size
    ? SIZE_PRESETS[size].control
    : RESPONSIVE_CONTROL_CLASSES;
  const iconClassName = size
    ? SIZE_PRESETS[size].icon
    : RESPONSIVE_ICON_CLASSES;

  return (
    <motion.button
      type={type}
      className={`flex items-center justify-center gap-0.5 whitespace-nowrap rounded-xl transition-colors ${controlClassName} ${
        gradient
          ? "text-[#041621]"
          : "bg-brand text-on-brand hover:bg-brand-hover active:bg-brand-active"
      } ${icon ? "font-medium" : "font-semibold"} ${className ?? ""}`}
      style={gradient ? { backgroundImage: GRADIENT } : undefined}
      whileTap={{ scale: 0.97, transition: { duration: 0.1 } }}
      {...props}
    >
      {icon === "prev" && (
        <Image
          src={arrowIcon}
          alt=""
          className={`${iconClassName} rotate-180`}
        />
      )}
      {children}
      {icon === "next" && (
        <Image src={arrowIcon} alt="" className={iconClassName} />
      )}
    </motion.button>
  );
};
