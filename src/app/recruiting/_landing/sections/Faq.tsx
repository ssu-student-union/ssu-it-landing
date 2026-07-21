"use client";

import { motion } from "motion/react";
import { useState } from "react";
import { Expandable } from "../../_components/form/Expandable";
import { ChevronIcon, SectionTitle } from "../components";
import { faq } from "../content";

export const Faq = () => {
  // single-open: 열린 항목을 다시 누르면 닫힌다.
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="w-full px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl py-12 sm:py-16 lg:py-20">
        <SectionTitle>{faq.title}</SectionTitle>
        <ul className="mt-8 flex flex-col gap-4 sm:mt-10 sm:gap-6">
          {faq.items.map((item, i) => {
            const open = openIndex === i;
            return (
              <li
                key={item.q}
                className="rounded-3xl bg-surface px-5 py-4 sm:px-7 sm:py-5"
              >
                <button
                  type="button"
                  id={`faq-btn-${i}`}
                  aria-expanded={open}
                  aria-controls={`faq-panel-${i}`}
                  onClick={() => setOpenIndex(open ? null : i)}
                  className="flex w-full items-center justify-between gap-4 text-left"
                >
                  <span className="font-semibold text-base text-ink sm:text-lg lg:text-xl">
                    {item.q}
                  </span>
                  <motion.span
                    aria-hidden="true"
                    className="shrink-0 text-ink"
                    animate={{ rotate: open ? 90 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronIcon className="size-6" />
                  </motion.span>
                </button>
                <Expandable open={open}>
                  <section
                    id={`faq-panel-${i}`}
                    aria-labelledby={`faq-btn-${i}`}
                    className="pt-3 text-muted text-sm leading-relaxed sm:text-base lg:text-lg"
                  >
                    {item.a}
                  </section>
                </Expandable>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};
