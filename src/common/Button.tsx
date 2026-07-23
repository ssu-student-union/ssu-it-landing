"use client";

import { type HTMLMotionProps, motion } from "motion/react";
import Image from "next/image";
import type { ReactNode } from "react";
import arrowIcon from "../assets/icons/arrow.svg";

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
  /** 생략하면 화면 폭에 따라 sm→md→lg로 자동 확대된다. 특정 크기로 고정하려면 지정한다. */
  size?: ButtonSize;
  children?: ReactNode;
} & Omit<HTMLMotionProps<"button">, "children">;

export const Button = ({
  icon,
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
      className={`flex items-center justify-center gap-0.5 whitespace-nowrap rounded-xl bg-brand text-on-brand transition-colors hover:bg-brand-hover active:bg-brand-active ${controlClassName} ${icon ? "font-medium" : "font-semibold"} ${className ?? ""}`}
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
