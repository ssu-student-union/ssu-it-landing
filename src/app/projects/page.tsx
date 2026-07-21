import type { Metadata } from "next";
import { DARK_SECTION_GRADIENT } from "../_components/gradients";
import { ProjectList } from "./_components/ProjectList";

export const metadata: Metadata = {
  title: "진행 프로젝트 | 숭실대학교 IT지원위원회",
};

export default function ProjectsPage() {
  return (
    <main
      className="flex flex-1 flex-col items-center gap-10 px-4 py-16 sm:gap-14 sm:py-24 lg:gap-16 lg:py-32"
      style={{ backgroundImage: DARK_SECTION_GRADIENT }}
    >
      <div className="flex w-full max-w-5xl flex-col gap-2 sm:gap-3">
        <h1 className="font-semibold text-4xl text-white sm:text-5xl lg:text-5xl 1440:text-[4rem]">
          Projects
        </h1>
        <p className="font-semibold text-lg text-white sm:text-2xl lg:text-2xl 1440:text-[2.25rem]">
          함께 고민하고, 함께 만들며 성장한 프로젝트를 소개합니다!
        </p>
      </div>

      <ProjectList />
    </main>
  );
}
