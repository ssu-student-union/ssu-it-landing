"use client";

import { type HTMLMotionProps, motion } from "motion/react";
import Image from "next/image";
import type { ReactNode } from "react";
import arrowIcon from "../assets/icons/arrow.svg";

/** Figma 원본 디자인의 그라디언트 색(Hero CTA 등). 스톱 간격은 원본처럼 비균등(0/40/75/100%). */
const GRADIENT =
  "linear-gradient(90deg, #6197ee 0%, #10d7e2 40%, #45b5e9 75%, #6197ee 100%)";

type ButtonProps = {
  icon?: "prev" | "next";
  /** true면 브랜드 solid 대신 유동적으로 흐르는 그라디언트 배경을 쓴다(Hero CTA 등). */
  gradient?: boolean;
  children?: ReactNode;
} & Omit<HTMLMotionProps<"button">, "children">;

export const Button = ({
  icon,
  gradient,
  className,
  children,
  type = "button",
  ...props
}: ButtonProps) => {
  return (
    <motion.button
      type={type}
      className={`flex items-center justify-center gap-0.5 whitespace-nowrap rounded-xl px-5 py-3 text-[1.875rem] transition-colors ${
        gradient
          ? "text-[#041621]"
          : "bg-brand text-on-brand hover:bg-brand-hover active:bg-brand-active"
      } ${icon ? "font-medium" : "font-semibold"} ${className ?? ""}`}
      style={gradient ? { backgroundImage: GRADIENT } : undefined}
      whileHover={{ scale: 1.03, transition: { duration: 0.15 } }}
      whileTap={{ scale: 0.97, transition: { duration: 0.1 } }}
      {...props}
    >
      {icon === "prev" && (
        <Image src={arrowIcon} alt="" className="size-10 rotate-180" />
      )}
      {children}
      {icon === "next" && <Image src={arrowIcon} alt="" className="size-10" />}
    </motion.button>
  );
};
