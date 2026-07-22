import Image from "next/image";
import heroGraphicLeft1 from "../../assets/images/hero-graphic-left-1.webp";
import heroGraphicLeft2 from "../../assets/images/hero-graphic-left-2.webp";
import heroGraphicRight1 from "../../assets/images/hero-graphic-right-1.webp";
import heroGraphicRight2 from "../../assets/images/hero-graphic-right-2.webp";
import { TrackedLink } from "../../common/TrackedLink";
import { DARK_SECTION_GRADIENT } from "./gradients";

export const Hero = () => {
  return (
    <section
      className="relative h-[26rem] overflow-hidden sm:h-[32rem] lg:h-212.5"
      style={{ backgroundImage: DARK_SECTION_GRADIENT }}
    >
      <div className="pointer-events-none absolute right-0 bottom-0 hidden h-[23.6425rem] w-[28.515rem] md:block">
        <Image
          src={heroGraphicRight2}
          alt=""
          fill
          sizes="457px"
          className="z-0 animate-float-slow object-contain object-right-bottom"
        />
        <Image
          src={heroGraphicRight1}
          alt=""
          fill
          sizes="457px"
          className="z-10 animate-float-slow object-contain object-right-bottom"
        />
      </div>

      <div className="pointer-events-none absolute top-0 left-0 hidden h-[18.0625rem] w-[17.4375rem] md:block">
        <Image
          src={heroGraphicLeft2}
          alt=""
          fill
          sizes="280px"
          className="z-0 animate-float object-contain object-left-top"
        />
        <Image
          src={heroGraphicLeft1}
          alt=""
          fill
          sizes="280px"
          className="z-10 animate-float object-contain object-left-top"
        />
      </div>

      <div className="absolute bottom-10 left-6 z-10 flex flex-col gap-5 sm:bottom-16 sm:left-12 sm:gap-6 lg:bottom-32.5 lg:left-26 lg:gap-8">
        <h1 className="text-white leading-[1.6] sm:leading-[1.8] lg:leading-[2.1]">
          <div className="flex items-center gap-3 font-medium text-xl sm:text-3xl lg:text-4xl">
            <span>더 나은 숭실대학교의 발전을 추구하는</span>

            <span
              aria-hidden
              className="h-px w-10 shrink-0 bg-[#ffebeb] sm:w-16 lg:w-[11.625rem]"
            />
          </div>
          <div className="font-bold text-3xl sm:text-5xl lg:text-[4rem]">
            숭실대학교 IT 지원위원회
          </div>
        </h1>

        {/* 리크루팅 페이지 경로 연결 */}
        <TrackedLink
          href="/recruiting"
          eventName="cta_apply_click"
          className="flex h-14 w-36 items-center justify-center rounded-xl border-[3px] border-[#9dcfeb] sm:h-18 sm:w-44 lg:h-[5.625rem] lg:w-[13.25rem]"
        >
          <span className="bg-gradient-to-r from-[#9dcfeb] to-[#6a8a9c] bg-clip-text font-bold text-lg text-transparent sm:text-2xl lg:text-2xl">
            지금 지원하기
          </span>
        </TrackedLink>
      </div>
    </section>
  );
};
