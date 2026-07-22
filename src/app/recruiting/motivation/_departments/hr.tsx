import type { FieldConfig } from "../../_lib/schema";
import { buildInterviewField } from "./interviewField";

export const hrFields: FieldConfig[] = [
  buildInterviewField({
    dates: [
      { id: "2026-08-01", start: "12:00", end: "17:00" },
      { id: "2026-08-02", start: "12:00", end: "20:00" },
      { id: "2026-08-03", start: "19:00", end: "22:00" },
    ],
  }),
  {
    key: "processStructureExperience",
    type: "textarea",
    title:
      "조직 활동 중 반복되는 비효율이나 문제를 발견하고, 이를 임시방편이 아닌 지속 가능한 운영 구조(매뉴얼, 규칙, 템플릿 등)를 만들어 근본적으로 해결했던 경험에 대해 서술해 주세요. (500자 이내)",
    maxLength: 500,
    rows: 4,
  },
  {
    key: "stakeholderCoordinationExperience",
    type: "textarea",
    title:
      "프로젝트나 행사 기획 등에서 다양한 이해관계자와의 의견 차이나 일정 충돌을 조율해야 했던 경험을 적고, 당시 상황을 어떻게 정확하고 빠르게 해결했는지 본인만의 소통 방식을 포함하여 작성해 주세요. (500자 이내)",
    maxLength: 500,
    rows: 4,
  },
];
