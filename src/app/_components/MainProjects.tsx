import Image from "next/image";
import arrowCircleIcon from "../../assets/icons/arrow_circle.svg";
import campusClubImage from "../../assets/images/campus-club.png";
import passuImage from "../../assets/images/passu.png";
import ssuportImage from "../../assets/images/ssuport.png";
import studentCouncilImage from "../../assets/images/student-council.png";

const PROJECTS = [
  {
    title: "SSUPORT",
    description: "총학생회 특별장학금 신청/관리 시스템 서비스",
    image: ssuportImage,
  },
  {
    title: "동아리연합회 홈페이지",
    description: "중앙동아리들의 정보 전달 및 행정처리를 위한 서비스",
    image: campusClubImage,
  },
  {
    title: "총학생회 홈페이지",
    description: "학생과 자치기구를 잇는 소통의 장",
    image: studentCouncilImage,
  },
  {
    title: "PASSU",
    description:
      "수기 수령증 작성과 재학생 인증을 간소화한 디지털 수령증 서비스",
    image: passuImage,
  },
];

export const MainProjects = () => {
  return (
    <div className="relative px-4 py-16 sm:py-24 lg:py-32">
      <div className="absolute top-0 right-4 sm:right-8">
        <p
          aria-hidden
          className="pointer-events-none select-none text-6xl font-bold leading-none text-white/[0.14] sm:text-8xl lg:text-8xl min-[1440px]:text-[9.375rem]"
        >
          Main
        </p>
        <div className="absolute inset-0 flex -translate-x-6 translate-y-1 items-end justify-start gap-1 pb-2 sm:-translate-x-10 sm:translate-y-3 sm:pb-4 lg:-translate-x-14 lg:translate-y-4 min-[1440px]:-translate-x-20 min-[1440px]:translate-y-6">
          <h2 className="flex h-10 items-center whitespace-nowrap text-2xl leading-none font-bold text-white sm:h-12 sm:text-4xl lg:h-12 lg:text-4xl min-[1440px]:h-16 min-[1440px]:text-5xl">
            메인 프로젝트
          </h2>
          <Image
            src={arrowCircleIcon}
            alt=""
            width={64}
            height={64}
            className="h-8 w-8 cursor-pointer sm:h-10 sm:w-10 lg:h-10 lg:w-10 min-[1440px]:h-16 min-[1440px]:w-16"
          />
        </div>
      </div>

      <div className="relative mx-auto mt-24 grid max-w-5xl grid-cols-1 gap-x-12 gap-y-12 sm:mt-16 sm:grid-cols-2 sm:gap-y-16">
        {PROJECTS.map((project) => (
          <div
            key={project.title}
            className="flex flex-col gap-4 sm:gap-7 lg:gap-10"
          >
            <div className="relative h-48 w-full max-w-[26.75rem] overflow-hidden rounded-lg sm:h-52 lg:h-[15.75rem]">
              <Image
                src={project.image}
                alt={project.title}
                fill
                sizes="(min-width: 640px) 428px, 100vw"
                className="object-cover"
              />
            </div>

            <div>
              <h3 className="text-left font-bold text-[#e2d7d7] text-2xl sm:text-3xl lg:text-3xl min-[1440px]:text-[2.5rem]">
                {project.title}
              </h3>
              <p className="max-w-103 self-start text-left text-base text-[#e2d7d7] leading-[1.4] sm:text-lg lg:text-lg min-[1440px]:text-xl min-[1440px]:leading-[1.5625rem]">
                {project.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
