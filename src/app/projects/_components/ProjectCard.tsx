import Image from "next/image";
import Link from "next/link";
import type { Project } from "../../../data/projects";

type ProjectCardProps = {
  project: Project;
};

export const ProjectCard = ({ project }: ProjectCardProps) => {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="flex cursor-pointer flex-col items-center gap-6 rounded-2xl bg-[#434343]/50 p-6 transition-transform duration-300 ease-in-out hover:scale-105 sm:gap-10 sm:p-8 lg:p-10"
    >
      <div className="relative h-40 w-full overflow-hidden rounded-lg sm:h-52 lg:h-[15.75rem]">
        <Image
          src={project.image}
          alt={project.title}
          fill
          sizes="(min-width: 640px) 428px, 100vw"
          className="object-cover"
        />
      </div>

      <div className="flex flex-col items-center gap-2 text-center sm:gap-3">
        <h3 className="font-bold text-2xl text-[#e2d7d7] sm:text-3xl lg:text-3xl 1440:text-[2.5rem]">
          {project.title}
        </h3>
        <p className="text-base text-[#e2d7d7] leading-[1.4] sm:text-lg sm:leading-[1.5625rem] lg:text-lg 1440:text-xl">
          {project.description}
        </p>
      </div>
    </Link>
  );
};
