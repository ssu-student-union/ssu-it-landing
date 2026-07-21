import type { FieldConfig } from "../../_lib/schema";
import { buildInterviewField } from "./interviewField";

export const pmFields: FieldConfig[] = [
  buildInterviewField({
    interviewDates: ["2026-02-02", "2026-02-03", "2026-02-07"],
    weekdaySlots: ["19:00", "20:00"],
    weekendSlots: ["10:00", "11:00", "12:00", "13:00"],
  }),
  {
    key: "tasks",
    type: "checkbox-group",
    title: "지원자가 IT지원위원회 PM으로서 맡기 원하는 과제를 선택해주세요.",
    options: ["일정/이슈 관리", "요구사항 정의"],
  },
  {
    key: "priorityTaskStrategy",
    type: "textarea",
    title:
      "1순위로 선택하신 과제에서 해결하고 싶은 문제는 무엇이며 이를 해결하기 위해 PM으로서 어떤 기획/관리 전략을 펼칠 것인지 구체적으로 서술해 주세요. (500자 이내)",
    maxLength: 500,
    rows: 4,
  },
];
