import { type FieldConfig, NOTION_TEXT_MAX_LENGTH } from "../../_lib/schema";
import { buildInterviewField } from "./interviewField";

export const frontendFields: FieldConfig[] = [
  buildInterviewField({
    // Frontend는 이번 기수 미채용 — 실제 일정 확정 전 자리표시자.
    dates: [
      { id: "2026-02-04", start: "19:00", end: "22:00" },
      { id: "2026-02-05", start: "19:00", end: "22:00" },
      { id: "2026-02-08", start: "10:00", end: "16:00" },
    ],
  }),
  {
    key: "techStack",
    type: "textarea",
    title: "사용해 본 프론트엔드 관련 기술 스택을 작성해 주세요.",
    rows: 4,
    maxLength: NOTION_TEXT_MAX_LENGTH,
  },
  {
    key: "projectExperience",
    type: "textarea",
    title:
      "본인이 개발한 프로젝트(팀 프로젝트 포함)가 있다면, 사용 기술과 구현한 기능을 설명해 주세요.",
    rows: 4,
    maxLength: NOTION_TEXT_MAX_LENGTH,
  },
];
