import { isApplicationActive } from "../../data/recruitingSchedule";
import {
  ApplicationNotes,
  ClosedHero,
  Faq,
  Hero,
  IdealCandidates,
  PartsTable,
  RecruitOverview,
  SectionDivider,
  Timeline,
} from "./_landing";

// 정적 생성(SSG) 페이지라 지원 기간 종료 여부가 빌드 시점에 고정된다 — 주기적으로
// 재렌더해 마감 화면 전환이 재배포 없이도 최대 1시간 지연으로 반영되게 한다.
export const revalidate = 3600;

export default function RecruitingPage() {
  const active = isApplicationActive();

  return (
    <main className="flex flex-1 flex-col pb-12 sm:pb-16">
      {active ? <Hero /> : <ClosedHero />}
      {active && <RecruitOverview />}
      {active && <SectionDivider />}
      <PartsTable />
      <SectionDivider />
      {active && <Timeline />}
      {active && <SectionDivider />}
      <IdealCandidates />
      <SectionDivider />
      {active && <ApplicationNotes />}
      {active && <SectionDivider />}
      <Faq />
    </main>
  );
}
