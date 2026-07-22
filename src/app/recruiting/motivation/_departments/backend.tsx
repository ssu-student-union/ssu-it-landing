import type { FieldConfig } from "../../_lib/schema";
import { buildInterviewField } from "./interviewField";

const skillPlaceholder = "ex) Node.js / 중 / API 설계 경험 (플레이스홀더)";

export const backendFields: FieldConfig[] = [
  buildInterviewField({
    dates: [
      { id: "2026-08-01", start: "12:00", end: "20:00" },
      { id: "2026-08-02", start: "12:00", end: "20:00" },
      { id: "2026-08-03", start: "19:00", end: "22:00" },
    ],
  }),
  {
    key: "skillAnswer",
    type: "textarea",
    title: "사용 가능한 기술 스택과 관련 경험을 작성해주세요. (500자 이내)",
    description:
      "AWS, SSO, 데이터베이스 등 인프라 관련 경험이 있다면 함께 작성해주세요.",
    placeholder: skillPlaceholder,
    maxLength: 500,
    rows: 4,
  },
];
