import type { FieldConfig } from "../../_lib/schema";
import { buildInterviewField } from "./interviewField";

const skillPlaceholder = "ex) 채용 프로세스 기획 경험 (플레이스홀더)";

export const hrFields: FieldConfig[] = [
  buildInterviewField({
    interviewDates: ["2026-02-02", "2026-02-07", "2026-02-08"],
    weekdaySlots: ["19:00", "20:00"],
    weekendSlots: ["10:00", "11:00", "15:00", "16:00"],
  }),
  {
    key: "tasks",
    type: "checkbox-group",
    title: "해당 분야에서 본인이 더 기여하고 싶은 Task를 선택해주세요.",
    options: ["채용 프로세스 운영", "조직 문화 기획"],
  },
  {
    key: "skillAnswer",
    type: "textarea",
    title:
      "해당 분야와 관련된 본인의 역량을 구체적으로 서술해주세요. (500자 이내)",
    placeholder: skillPlaceholder,
    maxLength: 500,
    rows: 4,
  },
];
