"use client";

import { AnimatePresence, motion } from "motion/react";
import type { ReactNode } from "react";
import { EASE_EXPO_OUT } from "../../_lib/ui";

type ExpandableProps = {
  open: boolean;
  children: ReactNode;
};

export const Expandable = ({ open, children }: ExpandableProps) => (
  <AnimatePresence initial={false}>
    {open && (
      <motion.div
        key="content"
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.3, ease: EASE_EXPO_OUT }}
        className="overflow-hidden"
      >
        {children}
      </motion.div>
    )}
  </AnimatePresence>
);
