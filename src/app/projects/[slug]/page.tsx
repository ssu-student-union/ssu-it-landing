import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PROJECTS } from "../../../data/projects";
import { DARK_SECTION_GRADIENT } from "../../_components/gradients";
import { ProjectDescription } from "./_components/ProjectDescription";
import { ProjectFuturePlans } from "./_components/ProjectFuturePlans";
import { ProjectHeader } from "./_components/ProjectHeader";
import { ProjectProgress } from "./_components/ProjectProgress";
import { ProjectTeam } from "./_components/ProjectTeam";

type ProjectDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export const generateStaticParams = () => {
  return PROJECTS.map((project) => ({ slug: project.slug }));
};

export const generateMetadata = async ({
  params,
}: ProjectDetailPageProps): Promise<Metadata> => {
  const { slug } = await params;
  const project = PROJECTS.find((item) => item.slug === slug);

  return {
    title: project
      ? `${project.title} | 숭실대학교 IT지원위원회`
      : "숭실대학교 IT지원위원회",
  };
};

export default async function ProjectDetailPage({
  params,
}: ProjectDetailPageProps) {
  const { slug } = await params;
  const project = PROJECTS.find((item) => item.slug === slug);

  if (!project) {
    notFound();
  }

  const { detail } = project;

  return (
    <main
      className="flex flex-1 flex-col items-center gap-10 px-4 py-16 sm:gap-14 sm:py-24 lg:gap-16 lg:py-32"
      style={{ backgroundImage: DARK_SECTION_GRADIENT }}
    >
      <ProjectHeader title={project.title} subtitle={detail?.subtitle} />

      {detail ? (
        <>
          <ProjectDescription description={detail.description} />

          <div className="grid w-full max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8">
            <ProjectTeam team={detail.team} />
            <ProjectProgress progressStatus={detail.progressStatus} />
          </div>

          <ProjectFuturePlans futurePlans={detail.futurePlans} />
        </>
      ) : (
        <div className="flex w-full max-w-5xl flex-col gap-4 rounded-[1.25rem] bg-[rgba(208,234,255,0.1)] p-6 sm:p-8 lg:p-10">
          <p className="font-medium text-base text-white sm:text-lg lg:text-lg min-[1440px]:text-xl">
            {project.description}
          </p>
          <p className="text-[#cccccc] text-sm sm:text-base">
            상세 소개 페이지는 준비 중입니다.
          </p>
        </div>
      )}
    </main>
  );
}
