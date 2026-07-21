"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { EASE_EXPO_OUT } from "../../_lib/ui";

type RevealProps = {
  children: ReactNode;
  /** 리스트/카드 그룹의 스태거용 지연(초). */
  delay?: number;
  className?: string;
};

/**
 * 스크롤 진입 시 한 번만 살짝 떠오르는 공통 리빌. Hero가 큰 모션을 담당하므로 이동은 y:16로
 * 작게 둔다. prefers-reduced-motion이면 애니메이션 없이 제자리에 렌더한다.
 */
export const Reveal = ({ children, delay = 0, className }: RevealProps) => {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 16 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, delay, ease: EASE_EXPO_OUT }}
    >
      {children}
    </motion.div>
  );
};
