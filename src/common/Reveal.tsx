"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** 등장 방향. "up"은 아래→위(기본), "down"은 위→아래로 슬라이드된다. */
  direction?: "up" | "down";
};

/**
 * 뷰포트에 들어오면 페이드인 + 슬라이드되는 스크롤 등장 애니메이션 래퍼.
 */
export const Reveal = ({
  children,
  className,
  delay = 0,
  direction = "up",
}: RevealProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setIsVisible(true);
        observer.disconnect();
      },
      { threshold: 0.15 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const hiddenTranslate =
    direction === "down" ? "-translate-y-10" : "translate-y-10";

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        isVisible ? "translate-y-0 opacity-100" : `${hiddenTranslate} opacity-0`
      } ${className ?? ""}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};
