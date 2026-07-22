"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import logo from "../assets/logo.svg";

const NAV_LINKS = [
  { href: "#", label: "위원회 소개" },
  { href: "#", label: "진행 프로젝트" },
];

const EASE = [0.4, 0, 0.2, 1] as const;

const ChevronIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    className="opacity-30"
    aria-hidden="true"
  >
    <path
      d="M6 3l6 6-6 6"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const Header = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="relative z-50 flex h-16 w-full items-center justify-between bg-white px-4 sm:h-20 sm:px-6 lg:h-25 lg:px-20">
      <Link
        href="/"
        className="flex items-center gap-1.5 sm:gap-2"
        onClick={() => setOpen(false)}
      >
        <Image
          src={logo}
          alt="IT지원위원회"
          className="h-auto w-7 sm:w-8 lg:w-10"
          priority
        />
        <span className="font-bold text-ink text-lg tracking-[-0.02em] sm:text-xl lg:text-[1.75rem]">
          IT지원위원회
        </span>
      </Link>

      <nav className="hidden items-center gap-8 md:flex xl:gap-16">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className="font-semibold text-ink text-xl whitespace-nowrap transition-opacity hover:opacity-70 xl:text-2xl"
          >
            {link.label}
          </Link>
        ))}
        <Link
          href="/recruiting"
          className="flex items-center justify-center whitespace-nowrap rounded-4xl bg-linear-to-b from-charcoal to-black px-6 py-2.5 font-semibold text-on-brand text-xl transition-opacity hover:opacity-70 xl:px-8 xl:py-3 xl:text-2xl"
        >
          리크루팅
        </Link>
      </nav>

      <button
        type="button"
        aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        className="relative flex size-9 flex-col items-center justify-center gap-1.5 md:hidden"
      >
        <motion.span
          animate={open ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
          transition={{ duration: 0.22, ease: EASE }}
          className="block h-0.5 w-6 origin-center rounded-full bg-ink"
        />
        <motion.span
          animate={open ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.18, ease: EASE }}
          className="block h-0.5 w-6 rounded-full bg-ink"
        />
        <motion.span
          animate={open ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
          transition={{ duration: 0.22, ease: EASE }}
          className="block h-0.5 w-6 origin-center rounded-full bg-ink"
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-nav-dim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="fixed inset-x-0 top-16 bottom-0 z-40 bg-black/30 backdrop-blur-sm sm:top-20 md:hidden"
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.nav
            key="mobile-nav"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="absolute top-full left-0 z-50 flex w-full flex-col overflow-hidden bg-white shadow-md md:hidden"
          >
            <div className="flex flex-col px-4 pt-1 pb-5">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.2,
                    delay: 0.05 + i * 0.05,
                    ease: EASE,
                  }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between border-b border-line py-4 font-semibold text-ink text-lg active:opacity-60"
                  >
                    {link.label}
                    <ChevronIcon />
                  </Link>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.2,
                  delay: 0.05 + NAV_LINKS.length * 0.05,
                  ease: EASE,
                }}
                className="mt-5"
              >
                <Link
                  href="/recruiting"
                  onClick={() => setOpen(false)}
                  className="block w-full whitespace-nowrap rounded-2xl bg-linear-to-b from-charcoal to-black py-4 text-center font-semibold text-on-brand text-base active:opacity-80 sm:text-lg"
                >
                  리크루팅
                </Link>
              </motion.div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};
