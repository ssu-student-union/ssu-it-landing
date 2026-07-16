const PROJECTS = [
  {
    title: "SSUPORT",
    description: "총학생회 특별장학금 신청/관리 시스템 서비스",
    imageAssetHint: "src/assets/images/project-ssuport.png",
  },
  {
    title: "동아리연합회 홈페이지",
    description: "중앙동아리들의 정보 전달 및 행정처리를 위한 서비스",
    imageAssetHint: "src/assets/images/project-club-union.png",
  },
  {
    title: "총학생회 홈페이지",
    description: "학생과 자치기구를 잇는 소통의 장",
    imageAssetHint: "src/assets/images/project-student-council.png",
  },
  {
    title: "PASSU",
    description:
      "수기 수령증 작성과 재학생 인증을 간소화한 디지털 수령증 서비스",
    imageAssetHint: "src/assets/images/project-passu.png",
  },
];

export const MainProjects = () => {
  return (
    <div className="relative px-4 py-32">
      <div className="absolute top-0 right-8">
        {/* 배경 워터마크 텍스트 (장식용) */}
        <p
          aria-hidden
          className="pointer-events-none select-none text-[9.375rem] font-bold leading-none text-white/[0.14]"
        >
          Main
        </p>
        <div className="absolute inset-0 flex -translate-x-8 items-end justify-start gap-1 pb-4">
          <h2 className="whitespace-nowrap text-5xl leading-none font-bold text-white">
            메인 프로젝트
          </h2>
          {/* 화살표 아이콘 (Figma: ei:arrow-left, 180도 회전) - src/assets/icons/arrow-left.svg 추가 후 next/image로 교체 */}
          <div className="size-16 rotate-180" />
        </div>
      </div>

      <div className="relative mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-x-12 gap-y-16 sm:grid-cols-2">
        {PROJECTS.map((project) => (
          <div key={project.title} className="flex flex-col gap-14">
            {/* {project.title} 썸네일 - {project.imageAssetHint} 추가 후 next/image로 교체 */}
            <div className="h-[15.75rem] w-full max-w-[26.75rem] rounded-lg bg-white/10" />

            <div>
              <h3 className="text-left font-bold text-[#e2d7d7] text-[2.5rem]">
                {project.title}
              </h3>
              <p className="max-w-103 self-start text-left text-xl text-[#e2d7d7] leading-[1.5625rem]">
                {project.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
