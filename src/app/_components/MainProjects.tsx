import Image from "next/image";
import Link from "next/link";
import arrowCircleIcon from "../../assets/icons/arrow_circle.svg";
import { Reveal } from "../../common/Reveal";
import { PROJECTS } from "../../data/projects";

export const MainProjects = () => {
  return (
    <div className="relative px-4 py-16 sm:py-24 lg:py-32">
      <div className="absolute top-0 right-4 sm:right-8">
        <p
          aria-hidden
          className="pointer-events-none select-none text-6xl font-bold leading-none text-white/[0.14] sm:text-8xl lg:text-[9.375rem]"
        >
          Main
        </p>
        <div className="absolute inset-0 flex -translate-x-6 translate-y-1 items-end justify-start gap-1 pb-2 sm:-translate-x-10 sm:translate-y-3 sm:pb-4 lg:-translate-x-20 lg:translate-y-6">
          <h2 className="flex h-10 items-center whitespace-nowrap text-2xl leading-none font-bold text-white sm:h-12 sm:text-4xl lg:h-16 lg:text-5xl">
            메인 프로젝트
          </h2>
          <Link href="/projects" aria-label="진행 프로젝트 더보기">
            <Image
              src={arrowCircleIcon}
              alt=""
              width={64}
              height={64}
              className="h-10 w-10 max-w-none shrink-0 sm:h-12 sm:w-12 lg:h-16 lg:w-16 cursor-pointer"
            />
          </Link>
        </div>
      </div>

      <div className="relative mx-auto mt-24 grid max-w-5xl grid-cols-1 gap-x-12 gap-y-12 sm:mt-16 sm:grid-cols-2 sm:gap-y-16">
        {PROJECTS.slice(0, 4).map((project, index) => (
          <Reveal key={project.title} delay={index * 100}>
            <Link
              href={`/projects/${project.slug}`}
              className="group flex flex-col gap-4 sm:gap-7 lg:gap-10"
            >
              <div className="relative h-48 w-full max-w-[26.75rem] overflow-hidden rounded-lg sm:h-52 lg:h-[15.75rem]">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  sizes="(min-width: 640px) 428px, 100vw"
                  className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                />
              </div>

              <div>
                <h3 className="text-left font-bold text-[#e2d7d7] text-2xl transition-colors duration-300 group-hover:text-white sm:text-3xl lg:text-[2.625rem]">
                  {project.title}
                </h3>
                <p className="max-w-103 self-start text-left text-base text-[#e2d7d7] leading-[1.4] sm:text-lg lg:text-xl lg:leading-[1.5625rem]">
                  {project.description}
                </p>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </div>
  );
};
