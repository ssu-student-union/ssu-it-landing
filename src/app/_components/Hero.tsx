import Image from "next/image";
import Link from "next/link";
import heroGraphicLeft1 from "../../assets/images/hero-graphic-left-1.png";
import heroGraphicLeft2 from "../../assets/images/hero-graphic-left-2.png";
import heroGraphicRight1 from "../../assets/images/hero-graphic-right-1.png";
import heroGraphicRight2 from "../../assets/images/hero-graphic-right-2.png";
import { DARK_SECTION_GRADIENT } from "./gradients";

export const Hero = () => {
  return (
    <section
      className="relative h-212.5 overflow-hidden"
      style={{ backgroundImage: DARK_SECTION_GRADIENT }}
    >
      {/* 장식용 반짝임 아이콘 (Figma: Vector, 3개) - src/assets/images/hero-sparkle.svg 추가 후 next/image로 교체 */}
      <div className="pointer-events-none absolute top-[7%] left-[11%] size-6" />
      <div className="pointer-events-none absolute top-[12%] left-[55%] size-6" />
      <div className="pointer-events-none absolute top-[4%] left-[85%] size-6" />

      {/* 장식용 배경 그래픽 */}
      <div className="pointer-events-none absolute right-0 bottom-0 hidden h-[23.6425rem] w-[28.515rem] md:block">
        <Image
          src={heroGraphicRight2}
          alt=""
          fill
          sizes="457px"
          className="z-0 animate-float-slow object-contain object-right-bottom [animation-delay:-2.5s]"
        />
        <Image
          src={heroGraphicRight1}
          alt=""
          fill
          sizes="457px"
          className="z-10 animate-float-slow object-contain object-right-bottom"
        />
      </div>

      {/* 장식용 배경 그래픽 */}
      <div className="pointer-events-none absolute top-0 left-0 hidden h-[18.0625rem] w-[17.4375rem] md:block">
        <Image
          src={heroGraphicLeft2}
          alt=""
          fill
          sizes="280px"
          className="z-0 animate-float object-contain object-left-top [animation-delay:-2s]"
        />
        <Image
          src={heroGraphicLeft1}
          alt=""
          fill
          sizes="280px"
          className="z-10 animate-float object-contain object-left-top"
        />
      </div>

      <div className="absolute bottom-32.5 left-26 z-10 flex flex-col gap-8">
        <h1 className="text-white leading-[1.9]">
          <div className=" font-medium text-4xl">
            더 나은 숭실대학교의 발전을 추구하는
          </div>
          {/* 장식용 언더라인 스와시 (Figma: Vector15) - src/assets/images/hero-accent-line.svg 추가 후 next/image로 교체 */}
          <div className="font-bold text-[3.125rem]">
            숭실대학교 IT 지원위원회
          </div>
        </h1>

        {/* 리크루팅 페이지 연결 예정 (실제 경로 미정) */}
        <Link
          href="#"
          className="flex h-22.5 w-53 items-center justify-center rounded-xl border-[3px] border-[#9dcfeb]"
        >
          <span className="bg-gradient-to-r from-[#9dcfeb] to-[#6a8a9c] bg-clip-text font-bold text-2xl text-transparent">
            지금 지원하기
          </span>
        </Link>
      </div>
    </section>
  );
};
