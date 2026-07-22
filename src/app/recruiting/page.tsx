import {
  ApplicationNotes,
  Faq,
  Hero,
  IdealCandidates,
  PartsTable,
  RecruitOverview,
  SectionDivider,
  Timeline,
} from "./_landing";

export default function RecruitingPage() {
  return (
    <main className="flex flex-1 flex-col pb-12 sm:pb-16">
      <Hero />
      <RecruitOverview />
      <SectionDivider />
      <PartsTable />
      <SectionDivider />
      <Timeline />
      <SectionDivider />
      <IdealCandidates />
      <SectionDivider />
      <ApplicationNotes />
      <SectionDivider />
      <Faq />
    </main>
  );
}
