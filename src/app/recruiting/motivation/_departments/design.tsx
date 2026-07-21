import type { FieldConfig } from "../../_lib/schema";
import { buildInterviewField } from "./interviewField";

const skillPlaceholder =
  "ex) Figma / 중 / Component, AutoLayout 등 주요 기능을 활용하여 원하는 결과물 제작 가능";

export const designFields: FieldConfig[] = [
  buildInterviewField({
    interviewDates: ["2026-02-03", "2026-02-04", "2026-02-07"],
    weekdaySlots: ["20:00", "21:00"],
    weekendSlots: ["13:00", "14:00", "15:00", "16:00"],
  }),
  {
    key: "tasks",
    type: "checkbox-group",
    title: "해당 분야에서 본인이 더 기여하고 싶은 Task를 선택해주세요.",
    options: [
      "UI/UX 디자인 유지보수",
      "IT지원위원회의 서비스 마케팅/굿즈 제작",
    ],
  },
  {
    key: "skillAnswer",
    type: "textarea",
    title: "디자인 툴 숙련도를 작성해 주세요.",
    placeholder: skillPlaceholder,
    maxLength: 500,
    rows: 4,
  },
];
