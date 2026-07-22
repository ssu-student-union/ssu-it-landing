import type { StaticImageData } from "next/image";
import Image from "next/image";
import { Fragment } from "react";
import arrowDownIcon from "../../assets/icons/arrow_down.svg";
import plusIcon from "../../assets/icons/plus.svg";
import dogMascot from "../../assets/images/about-mascot-dog.png";
import ideaImage from "../../assets/images/about-story-idea.jpg";
import lectureImage from "../../assets/images/about-story-lecture.jpg";
import teamImage from "../../assets/images/about-story-team.jpg";
import techstackImage from "../../assets/images/about-story-techstack.jpg";
import { Reveal } from "../../common/Reveal";
import { ABOUT_DARK_FADE_GRADIENT } from "./gradients";
import { StatCounter } from "./StatCounter";

const STATS = [
  { label: "현재 리크루팅 기수", target: 5, suffix: "기", showPlus: false },
  { label: "누적 위원", target: 53, suffix: "명", showPlus: true },
  { label: "프로젝트 수", target: 8, suffix: "개", showPlus: true },
];

type StoryItem = {
  lines: string[];
  image: StaticImageData;
  aspect: string;
  align: "left" | "right";
  theme: "dark" | "light";
  decoratedWord?: string;
};

const STORY_ITEMS: StoryItem[] = [
  {
    lines: ["학교의 불편함,", "기술로 해결합니다"],
    image: lectureImage,
    aspect: "783/430",
    align: "left",
    theme: "dark",
  },
  {
    lines: ["학생이 직접 만들고,", "기획합니다"],
    image: techstackImage,
    aspect: "747/535",
    align: "right",
    theme: "dark",
    decoratedWord: "직접",
  },
  {
    lines: ["기획부터", "개발까지,", "하나의 팀으로"],
    image: teamImage,
    aspect: "660/499",
    align: "left",
    theme: "light",
    decoratedWord: "기획",
  },
  {
    lines: ["아이디어가", "실제로 이루어지기까지"],
    image: ideaImage,
    aspect: "806/422",
    align: "right",
    theme: "light",
  },
];

const StoryBlock = ({ item, delay }: { item: StoryItem; delay: number }) => {
  const isRight = item.align === "right";
  const [firstLine] = item.lines;
  const decoratedWord = item.decoratedWord;
  const decoratedLine = decoratedWord
    ? firstLine.includes(decoratedWord)
      ? firstLine
      : item.lines.find((line) => line.includes(decoratedWord))
    : undefined;
  const renderedLines = item.lines.map((line) => {
    if (!decoratedWord || line !== decoratedLine) return line;

    const [beforeWord, afterWord] = line.split(decoratedWord);

    return (
      <Fragment key={line}>
        {beforeWord}
        <span className="relative inline-block">
          <span className="absolute bottom-[calc(100%+12px)] left-1/2 flex w-[0.9em] -translate-x-1/2 items-center justify-between">
            <span className="h-[10px] w-[10px] rounded-full bg-current" />
            <span className="h-[10px] w-[10px] rounded-full bg-current" />
          </span>
          {decoratedWord}
        </span>
        {afterWord}
      </Fragment>
    );
  });

  return (
    <Reveal
      delay={delay}
      className={`flex w-full max-w-2xl flex-col gap-6 sm:gap-8 lg:max-w-3xl ${
        isRight ? "ml-auto items-end" : "mr-auto items-start"
      }`}
    >
      <p
        className={`whitespace-pre-line font-semibold text-3xl leading-tight sm:text-5xl lg:text-[4.375rem] ${
          isRight ? "text-right" : "text-left"
        } ${item.theme === "light" ? "text-[#f4f4f4]" : "text-[#322e2e]"}`}
      >
        {renderedLines.map((line, index) => (
          <Fragment key={item.lines[index]}>
            {line}
            {index < renderedLines.length - 1 && "\n"}
          </Fragment>
        ))}
      </p>
      <div
        className="relative w-full overflow-hidden rounded-lg shadow-[7px_10px_14px_0px_rgba(0,0,0,0.25)]"
        style={{ aspectRatio: item.aspect }}
      >
        <Image
          src={item.image}
          alt=""
          fill
          sizes="(min-width: 1024px) 48rem, 90vw"
          className="object-cover"
        />
      </div>
    </Reveal>
  );
};

export const About = () => {
  return (
    <section className="flex flex-col items-center gap-20 px-4 pt-20 sm:gap-28 sm:px-8 sm:pt-32 lg:gap-83 lg:px-0 lg:pt-50">
      <div className="flex w-full flex-col gap-20 px-4 sm:gap-28 sm:px-8 lg:gap-32 lg:px-40">
        <StoryBlock item={STORY_ITEMS[0]} delay={0} />
        <StoryBlock item={STORY_ITEMS[1]} delay={100} />
      </div>

      <div
        className="flex w-full flex-col gap-20 px-4 py-20 sm:gap-28 sm:px-8 sm:py-28 lg:gap-32 lg:px-40 lg:py-32"
        style={{ backgroundImage: ABOUT_DARK_FADE_GRADIENT }}
      >
        <StoryBlock item={STORY_ITEMS[2]} delay={0} />
        <StoryBlock item={STORY_ITEMS[3]} delay={100} />
      </div>

      <div className="relative flex w-full flex-col items-center gap-16 overflow-x-clip px-4 sm:gap-20 sm:px-8 lg:mt-[10.5rem] lg:gap-40">
        <Reveal className="flex flex-col items-center gap-3 text-center">
          <p className="font-semibold text-2xl text-[#121212] sm:text-3xl lg:text-[2.8125rem]">
            IT지원위원회에서
          </p>
          <p className="font-semibold text-4xl sm:text-6xl lg:text-[4.375rem]">
            <span className="text-[#141414]">함께 만들고, </span>
            <span className="bg-gradient-to-r from-[#6896f8] to-[#3d5892] bg-clip-text text-transparent">
              성장합니다
            </span>
          </p>
        </Reveal>

        <Image
          src={arrowDownIcon}
          alt=""
          className="h-8 w-8 -rotate-90 sm:h-10 sm:w-10 lg:h-16 lg:w-16"
        />

        <div className="relative flex w-full max-w-5xl flex-col items-center gap-10 sm:flex-row sm:items-stretch sm:justify-center lg:mt-[16.5rem]">
          {STATS.map((stat, index) => (
            <Fragment key={stat.label}>
              {index > 0 && (
                <div className="mx-2 hidden h-32 w-px shrink-0 self-center bg-[#9599a1] sm:block lg:mx-6 lg:h-40" />
              )}
              <Reveal
                delay={index * 120}
                className="flex w-full flex-col items-center justify-center gap-7 sm:min-w-52 sm:gap-8 lg:min-w-[286px]"
              >
                <div className="flex items-end whitespace-nowrap">
                  <StatCounter target={stat.target} suffix={stat.suffix} />
                  {stat.showPlus && (
                    <Image
                      src={plusIcon}
                      alt=""
                      className="mb-1 h-8 w-8 shrink-0 sm:mb-1.5 sm:h-10 sm:w-10 lg:mb-2 lg:h-[85px] lg:w-[85px]"
                    />
                  )}
                </div>
                <p className="text-center font-semibold text-lg leading-none text-[#404b52] sm:text-xl lg:text-2xl">
                  {stat.label}
                </p>
              </Reveal>
            </Fragment>
          ))}
        </div>

        <Image
          src={dogMascot}
          alt=""
          className="pointer-events-none absolute right-[-180px] hidden h-36 w-36 rotate-[-15.86deg] lg:top-[300px] lg:block lg:h-[459.114px] lg:w-[459.114px]"
        />

        <p className="w-full pr-10 pb-7 text-right font-normal text-xs tracking-[0.05em] sm:text-sm lg:text-lg lg:tracking-[0.075rem]">
          *2026년 기준 데이터
        </p>
      </div>
    </section>
  );
};
