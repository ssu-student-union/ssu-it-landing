const PART_CARD_GRADIENT =
  "linear-gradient(54.28deg, #6197ee 3.19%, #45b5e9 50.1%, #10d7e2 91.44%)";

const PART_CARD_BACK_GRADIENT = `linear-gradient(rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.25)), ${PART_CARD_GRADIENT}`;

// TODO: Product/Backend/Frontend 소개 문구는 정확한 카피로 교체 필요
const PARTS = [
  {
    label: "Product",
    description:
      "프로젝트의 방향과 일정을 관리합니다. 파트 간 협업이 매끄럽게 굴러가도록 조율합니다.\n 아이디어가 실제 서비스로 완성되게 이끕니다.",
  },
  {
    label: "Design",
    description:
      "서비스의 화면과 사용자 경험을 설계합니다.\n보기 좋고 쓰기 편한 인터페이스를 디자인합니다. IT지원위원회의 시각적 정체성을 만듭니다.",
  },
  {
    label: "Backend",
    description:
      "서비스의 데이터와 핵심 로직을 담당합니다. 서버가 안정적으로 돌아가도록 관리합니다.\n눈에 안 보이는 곳에서 서비스를 떠받칩니다.",
  },
  {
    label: "Frontend",
    description:
      "디자인을 실제 동작하는 화면으로 구현합니다. 사용자와 서비스가 만나는 접점을 만듭니다.\n빠르고 편안한 사용 경험을 완성합니다.",
  },
];

export const PartIntro = () => {
  return (
    <div className="relative px-4 py-32">
      <div className="absolute top-0 left-8">
        <p
          aria-hidden
          className="pointer-events-none select-none text-[9.375rem] font-bold leading-none text-[#dddddd]/[0.14]"
        >
          Part
        </p>
        <h2 className="absolute inset-0 flex items-end justify-center whitespace-nowrap pb-4 text-5xl leading-none font-bold text-white">
          파트 소개
        </h2>
      </div>

      <div className="relative mx-auto flex max-w-5xl items-center justify-end">
        <div className="flex h-9 w-[4.6875rem] items-center justify-center gap-0.5 rounded-[1.25rem] border border-white p-2">
          {/* 이전 화살표 아이콘 (Figma: iconamoon:arrow-up-2-light) - src/assets/icons/chevron.svg 추가 후 next/image로 교체 */}
          <div className="size-7.5 -rotate-90" />
          {/* 다음 화살표 아이콘 (Figma: iconamoon:arrow-up-2-light) - src/assets/icons/chevron.svg 추가 후 next/image로 교체 */}
          <div className="size-7.5 rotate-90" />
        </div>
      </div>

      <div className="relative mx-auto mt-16 grid max-w-5xl grid-cols-2 gap-8 sm:grid-cols-4">
        {PARTS.map((part) => (
          <div
            key={part.label}
            className="group h-68 w-full perspective-[1000px]"
          >
            <div className="relative h-full w-full transition-transform duration-700 ease-in-out transform-3d group-hover:rotate-y-180">
              <div
                className="absolute inset-0 flex flex-col justify-between rounded-lg py-5 px-6 shadow-[6px_6px_4px_2px_#303030] backface-hidden"
                style={{ backgroundImage: PART_CARD_GRADIENT }}
              >
                <p className="text-4xl font-semibold text-[#2f2f2f]">
                  {part.label}
                </p>
                {/* {part.label} 파트 아이콘 - src/assets/icons/part-{lowercase label}.svg 추가 후 next/image로 교체 */}
                <div className="flex w-full justify-end">
                  <div className="size-21.25 rounded-full bg-white/20" />
                </div>
              </div>

              <div
                className="absolute inset-0 flex rotate-y-180 flex-col gap-3 rounded-lg py-5 px-6 shadow-[6px_6px_4px_2px_#303030] backface-hidden"
                style={{ backgroundImage: PART_CARD_BACK_GRADIENT }}
              >
                <p className="text-4xl font-semibold text-white">
                  {part.label}
                </p>
                <p className="whitespace-pre-line text-base leading-relaxed font-medium text-white">
                  {part.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
