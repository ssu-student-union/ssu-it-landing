"use client";

import { useEffect, useState } from "react";
import {
  checkApplicationActiveClient,
  isApplicationActive,
} from "../../data/recruitingSchedule";
import { RecruitingToggleFAB } from "./_components/RecruitingToggleFAB";
import { SHOW_AUTOFILL } from "./_components/StepLayout";
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

export default function RecruitingPage() {
  const [active, setActive] = useState(isApplicationActive());

  useEffect(() => {
    setActive(checkApplicationActiveClient());
  }, []);

  return (
    <main className="flex flex-1 flex-col pb-12 sm:pb-16">
      {active ? <Hero /> : <ClosedHero />}
      {active && <RecruitOverview />}
      {active && <SectionDivider />}
      {active && <PartsTable />}
      {active && <SectionDivider />}
      {active && <Timeline />}
      {active && <SectionDivider />}
      <IdealCandidates />
      <SectionDivider />
      {active && <ApplicationNotes />}
      {active && <SectionDivider />}
      <Faq />
      {SHOW_AUTOFILL && <RecruitingToggleFAB />}
    </main>
  );
}
