"use client";

import { useEffect, useRef, useState } from "react";

type StatCounterProps = {
  target: number;
  suffix: string;
  duration?: number;
};

export const StatCounter = ({
  target,
  suffix,
  duration = 1500,
}: StatCounterProps) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLParagraphElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasAnimated.current) return;
        hasAnimated.current = true;

        const startTime = performance.now();

        const step = (now: number) => {
          const progress = Math.min((now - startTime) / duration, 1);
          const eased = 1 - (1 - progress) ** 3;
          setCount(Math.round(target * eased));

          if (progress < 1) {
            requestAnimationFrame(step);
          }
        };

        requestAnimationFrame(step);
        observer.disconnect();
      },
      { threshold: 0.5 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  return (
    <p
      ref={ref}
      className="text-4xl font-bold text-[#383e42] sm:text-5xl lg:text-5xl min-[1440px]:text-[4rem]"
    >
      {count}
      {suffix}
    </p>
  );
};
