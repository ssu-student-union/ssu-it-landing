"use client";

import {
  type MotionValue,
  motion,
  useScroll,
  useTransform,
} from "motion/react";
import Image, { type StaticImageData } from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import earthImage from "../../../assets/images/hero/earth-bottom-left.webp";
import planetBottomRightImage from "../../../assets/images/hero/planet-bottom-right.webp";
import planetTopRightImage from "../../../assets/images/hero/planet-top-right.webp";
import { Button } from "../../../common/Button";
import { dayjs } from "../../../lib";
import { EASE_EXPO_OUT } from "../_lib/ui";
import { hero } from "./content";

type PlanetConfig = {
  key: string;
  src: StaticImageData;
  style: { left: string; top: string; width: string };
  float: { y: number[]; rotate: number[]; duration: number; delay: number };
  /** 스크롤 시 이 행성만 독립적으로 이동하는 거리(px). 행성마다 달라야 패럴랙스처럼 보인다. */
  parallax: number;
};

/** 프레임(1276×615) 기준 % 좌표. Figma 원본 레이어 위치/크기를 그대로 비율 환산했다. */
const PLANETS: PlanetConfig[] = [
  {
    key: "earth",
    src: earthImage,
    style: { left: "-14.7%", top: "28.6%", width: "40.7%" },
    float: { y: [0, -32, 0], rotate: [0, -3, 3, 0], duration: 8, delay: 0 },
    parallax: 180,
  },
  {
    key: "top-right",
    src: planetTopRightImage,
    style: { left: "78.1%", top: "-22.8%", width: "30.2%" },
    float: { y: [0, 28, 0], rotate: [0, 4, -4, 0], duration: 10, delay: 0.6 },
    parallax: -120,
  },
  {
    key: "bottom-right",
    src: planetBottomRightImage,
    style: { left: "86.3%", top: "78.4%", width: "17.7%" },
    float: { y: [0, -22, 0], rotate: [0, -5, 5, 0], duration: 7, delay: 1.1 },
    parallax: 260,
  },
];

/** 고정 좌표(결정론적) 별 필드. 서버/클라이언트 렌더가 어긋나지 않도록 매 렌더 난수 대신 하드코딩한다. */
const STARS = [
  { top: "8%", left: "10%", size: 2, duration: 2.6, delay: 0 },
  { top: "14%", left: "22%", size: 1, duration: 3.2, delay: 0.4 },
  { top: "10%", left: "62%", size: 2, duration: 2.8, delay: 0.8 },
  { top: "20%", left: "75%", size: 1, duration: 3.6, delay: 0.2 },
  { top: "6%", left: "88%", size: 2, duration: 2.4, delay: 1.2 },
  { top: "32%", left: "6%", size: 1, duration: 3.4, delay: 0.6 },
  { top: "40%", left: "18%", size: 2, duration: 2.9, delay: 1.5 },
  { top: "48%", left: "8%", size: 1, duration: 3.1, delay: 0.3 },
  { top: "28%", left: "48%", size: 1, duration: 3.8, delay: 1.8 },
  { top: "18%", left: "42%", size: 2, duration: 2.5, delay: 0.9 },
  { top: "60%", left: "14%", size: 1, duration: 3.3, delay: 0.5 },
  { top: "70%", left: "22%", size: 2, duration: 2.7, delay: 1.4 },
  { top: "16%", left: "58%", size: 1, duration: 3.5, delay: 1.0 },
  { top: "36%", left: "68%", size: 2, duration: 2.6, delay: 0.2 },
  { top: "50%", left: "82%", size: 1, duration: 3.0, delay: 1.6 },
  { top: "62%", left: "90%", size: 2, duration: 2.9, delay: 0.7 },
  { top: "78%", left: "62%", size: 1, duration: 3.7, delay: 1.1 },
  { top: "84%", left: "48%", size: 2, duration: 2.4, delay: 0.4 },
  { top: "12%", left: "32%", size: 1, duration: 3.2, delay: 1.3 },
  { top: "44%", left: "36%", size: 1, duration: 3.6, delay: 0.1 },
] as const;

/** 마감일까지 남은 일수를 "D - N" 형태로. 마감 당일은 "D - DAY", 지난 뒤엔 "마감". */
function formatDday(deadline: string): string {
  const days = dayjs(deadline)
    .startOf("day")
    .diff(dayjs().startOf("day"), "day");
  if (days > 0) return `D - ${days}`;
  if (days === 0) return "D - DAY";
  return "마감";
}

/**
 * 우주 테마 Hero. 행성 3장(Figma에서 각각 export)만 사진 에셋으로 쓰고, 배경 그라디언트·
 * 글로우·별·타이틀·D-day·버튼은 모두 라이브 CSS/모션으로 직접 구현한다(D-day가 실시간으로
 * 계산되도록). "지원하기"는 리쿠르팅 폼과 공유하는 `Button`(`src/common/Button`)을 그대로 쓴다.
 * D-day는 hydration 불일치를 피하려고 마운트 후에 채운다.
 */
export const Hero = () => {
  const router = useRouter();
  const [dday, setDday] = useState<string | null>(null);
  useEffect(() => setDday(formatDday(hero.deadline)), []);

  // 히어로가 뷰포트 위쪽을 지나가는 동안(진입~이탈)의 스크롤 진행도. 행성마다
  // parallax 값이 달라 같은 진행도에도 서로 다른 속도로 움직이는 것처럼 보인다.
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const earthParallaxY = useTransform(
    scrollYProgress,
    [0, 1],
    [0, PLANETS[0].parallax],
  );
  const topRightParallaxY = useTransform(
    scrollYProgress,
    [0, 1],
    [0, PLANETS[1].parallax],
  );
  const bottomRightParallaxY = useTransform(
    scrollYProgress,
    [0, 1],
    [0, PLANETS[2].parallax],
  );
  const parallaxByKey: Record<string, MotionValue<number>> = {
    earth: earthParallaxY,
    "top-right": topRightParallaxY,
    "bottom-right": bottomRightParallaxY,
  };

  return (
    <section className="w-full px-4 sm:px-6 lg:px-18">
      <div
        ref={heroRef}
        className="@container relative aspect-1276/615 w-full overflow-hidden rounded-2xl"
        style={{
          background:
            "linear-gradient(180deg, #060608 0%, #170b30 45%, #2c1150 100%)",
        }}
      >
        {/* 방사형 글로우 — 원 자체가 천천히 떠다니듯 위치를 옮겨 다닌다 */}
        <motion.div
          className="absolute h-[160%] w-[160%]"
          style={{
            top: "-30%",
            left: "-30%",
            background:
              "radial-gradient(40% 45% at 50% 50%, rgba(168,85,247,0.95) 0%, rgba(99,50,190,0.6) 40%, rgba(6,6,8,0) 75%)",
          }}
          animate={{
            x: [0, 40, -30, 20, 0],
            y: [0, -30, 20, -15, 0],
            scale: [1, 1.12, 0.95, 1.05, 1],
          }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* 별 */}
        {STARS.map((star) => (
          <motion.span
            key={`${star.top}-${star.left}`}
            className="absolute rounded-full bg-white"
            style={{
              top: star.top,
              left: star.left,
              width: star.size,
              height: star.size,
            }}
            animate={{ opacity: [0.15, 1, 0.15] }}
            transition={{
              duration: star.duration,
              delay: star.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* 행성 — 바깥 div는 스크롤에 따라 행성마다 다른 속도로 움직이는 패럴랙스,
            안쪽 div는 항상 도는 둥둥 떠다니는 idle 애니메이션을 맡는다. */}
        {PLANETS.map((planet) => (
          <motion.div
            key={planet.key}
            className="pointer-events-none absolute"
            style={{ ...planet.style, y: parallaxByKey[planet.key] }}
          >
            <motion.div
              animate={{ y: planet.float.y, rotate: planet.float.rotate }}
              transition={{
                duration: planet.float.duration,
                delay: planet.float.delay,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Image
                src={planet.src}
                alt=""
                className="h-auto w-full"
                priority
              />
            </motion.div>
          </motion.div>
        ))}

        {/* 타이틀 · D-day · CTA */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-[3.5%]">
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE_EXPO_OUT }}
            className="whitespace-nowrap font-semibold text-[#f9f6f6] text-[5.2cqw] leading-none sm:text-[5.49cqw]"
          >
            {hero.title}
          </motion.p>

          {dday && (
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15, ease: EASE_EXPO_OUT }}
              className="whitespace-nowrap font-semibold text-[#f9f6f6] text-[2.66cqw] leading-none"
            >
              {dday}
            </motion.p>
          )}

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: EASE_EXPO_OUT }}
          >
            <Button gradient onClick={() => router.push(hero.applyHref)}>
              지원하기
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
