import Image from "next/image";
import aboutPhoto from "../../assets/images/about-photo.jpg";
import { Reveal } from "../../common/Reveal";
import { StatCounter } from "./StatCounter";

const INTRO_PARAGRAPH = `IT지원위원회는 학내 서비스의 안정적인 운영과 학생 자치 문화의 활성화를 목표로, 학생들이 실제로 사용하는 디지털 서비스와 플랫폼을 직접 기획하고 개발하며 운영하는 조직입니다.

우리는 단순히 무언가를 만드는 데서 그치지 않습니다. 기획·디자인·개발 파트의 위원들이 하나의 팀으로 협업하며, 학내 구성원이 겪는 불편을 발견하고 이를 기술로 해결해 나갑니다.

아이디어가 실제 서비스가 되어 캠퍼스에 자리 잡는 과정을 위원 모두가 함께 경험합니다. 프로젝트를 통해 실무에 가까운 경험을 쌓고, 파트를 넘나드는 협업 속에서 함께 성장하는 것. 그리고 그 결과물이 학교라는 공간에 실질적인 변화를 만들어내는 것. 그것이 IT지원위원회가 일하는 방식입니다.`;

const STATS = [
  { label: "현재 리크루팅 기수", target: 5, suffix: "기" },
  { label: "누적 위원", target: 53, suffix: "명" },
  { label: "파트 수", target: 5, suffix: "개" },
];

export const About = () => {
  return (
    <section className="flex flex-col items-center gap-20 px-4 pt-20 sm:gap-28 sm:px-8 sm:pt-32 lg:gap-83 lg:px-0 lg:pt-50">
      <div className="flex flex-col items-center gap-10 sm:gap-16 lg:gap-33">
        <h2 className="text-2xl font-bold text-[#121212] sm:text-3xl lg:text-3xl min-[1440px]:text-4xl">
          IT지원위원회란?
        </h2>
        <div className="flex w-full flex-col items-center gap-10 sm:gap-16 lg:flex-row lg:gap-25">
          <Reveal className="relative h-64 w-full max-w-80 shrink-0 overflow-hidden rounded-xl sm:h-96 sm:max-w-96 lg:h-[37.375rem] lg:w-[26rem] lg:max-w-none">
            <Image
              src={aboutPhoto}
              alt="IT지원위원회 소개 사진"
              fill
              sizes="(min-width: 1024px) 416px, (min-width: 640px) 384px, 320px"
              className="object-cover transition-transform duration-700 ease-out hover:scale-110"
            />
          </Reveal>

          <Reveal
            delay={150}
            className="max-w-[36.625rem] whitespace-pre-line font-semibold text-base text-[#282323] leading-[1.75rem] sm:text-xl sm:leading-[2rem] lg:text-xl lg:leading-[2rem] min-[1440px]:text-[1.625rem] min-[1440px]:leading-[2.5rem]"
          >
            {INTRO_PARAGRAPH}
          </Reveal>
        </div>
      </div>

      <div
        className="flex w-full flex-col items-center gap-10 rounded-t-xl px-6 pt-12 pb-16 sm:gap-16 sm:px-12 sm:pt-16 sm:pb-24 lg:gap-25 lg:px-37 lg:pt-20 lg:pb-36"
        style={{
          background:
            "linear-gradient(180deg, rgba(169, 195, 224, 0.20) 0%, rgba(53, 80, 92, 0.20) 100%)",
        }}
      >
        <Reveal>
          <h3 className="text-center font-medium text-lg text-black tracking-[0.3rem] sm:text-2xl sm:tracking-[0.6rem] lg:text-2xl lg:tracking-[0.6rem] min-[1440px]:text-[2rem] min-[1440px]:tracking-[1.08rem]">
            2026 IT 지원위원회
          </h3>
        </Reveal>

        <div className="grid w-full grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-8 lg:gap-16">
          {STATS.map((stat, index) => (
            <Reveal
              key={stat.label}
              delay={index * 120}
              className="flex flex-col items-center gap-8 whitespace-nowrap sm:gap-10 lg:gap-16"
            >
              <div className="flex w-full flex-col items-center gap-2">
                <p className="font-medium text-xl text-[#312a2a] sm:text-2xl lg:text-2xl min-[1440px]:text-4xl">
                  {stat.label}
                </p>
                <div className="h-px w-full max-w-71.5 bg-[#858C90] border-r" />
              </div>
              <StatCounter target={stat.target} suffix={stat.suffix} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};
