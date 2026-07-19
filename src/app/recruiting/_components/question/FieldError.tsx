"use client";

import { AnimatePresence, motion } from "motion/react";
import { EASE_EXPO_OUT } from "../../_lib/ui";

type FieldErrorProps = {
  message?: string;
};

/**
 * 애니메이션되는 에러 문구. `AnimatePresence`가 퇴장 애니메이션 동안 마지막
 * `message`를 자동으로 붙잡아두므로, `message`가 `undefined`가 된 순간에도
 * 별도 state 없이 exit 애니메이션이 끊기지 않는다.
 */
export const FieldError = ({ message }: FieldErrorProps) => (
  <AnimatePresence initial={false}>
    {message && (
      <motion.div
        key="error"
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.3, ease: EASE_EXPO_OUT }}
        className="overflow-hidden text-sm"
      >
        <p className="overflow-hidden text-red-500">{message}</p>
      </motion.div>
    )}
  </AnimatePresence>
);
