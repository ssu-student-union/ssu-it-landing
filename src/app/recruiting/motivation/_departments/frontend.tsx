import { type FieldConfig, NOTION_TEXT_MAX_LENGTH } from "../../_lib/schema";
import { buildInterviewField } from "./interviewField";

export const frontendFields: FieldConfig[] = [
  buildInterviewField({
    interviewDates: ["2026-02-04", "2026-02-05", "2026-02-08"],
    weekdaySlots: ["19:00", "20:00", "21:00"],
    weekendSlots: ["10:00", "11:00", "14:00", "15:00"],
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
