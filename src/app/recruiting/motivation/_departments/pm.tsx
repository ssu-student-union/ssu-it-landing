import type { FieldConfig, FormValues } from "../../_lib/schema";
import { buildInterviewField } from "./interviewField";

const TASK_ROWS = [
  { id: "student-council-site", label: "총학생회 홈페이지" },
  { id: "club-council-site", label: "동아리연합회 홈페이지" },
  { id: "ssuport", label: "SSUport (특별장학금)" },
  { id: "etc", label: "기타" },
];

const PRIORITY_SLOTS = ["1", "2", "3", "4"];
const PRIORITY_COLUMNS = ["1순위", "2순위", "3순위", "4순위"];

type TaskPriorities = Record<string, string>;

const taskPrioritiesOf = (values: FormValues): TaskPriorities =>
  (values.taskPriorities as TaskPriorities | undefined) ?? {};

/** 한 과제엔 순위 하나만, 한 순위엔 과제 하나만 배정되게 한다 — 체크 시 같은 열을
 * 쓰던 다른 행의 배정을 함께 지워, 중복 배정 자체가 일어나지 않게 한다. */
function assignPriority(
  current: TaskPriorities,
  rowId: string,
  slot: string,
  checked: boolean,
): TaskPriorities {
  const next = { ...current };
  if (!checked) {
    delete next[rowId];
    return next;
  }
  for (const [otherRow, otherSlot] of Object.entries(next)) {
    if (otherSlot === slot && otherRow !== rowId) delete next[otherRow];
  }
  next[rowId] = slot;
  return next;
}

export const pmFields: FieldConfig[] = [
  buildInterviewField({
    dates: [
      { id: "2026-08-01", start: "13:00", end: "20:00" },
      { id: "2026-08-02", start: "12:00", end: "20:00" },
      { id: "2026-08-03", start: "19:00", end: "22:00" },
    ],
  }),
  {
    key: "taskPriorities",
    type: "checkbox-matrix",
    title:
      "지원자가 IT지원위원회 PM으로서 맡기 원하는 과제의 우선순위를 선택해주세요.",
    groups: [
      {
        columns: PRIORITY_COLUMNS,
        rows: TASK_ROWS,
        slots: PRIORITY_SLOTS,
      },
    ],
    getChecked: (values, rowId, slot) =>
      taskPrioritiesOf(values)[rowId] === slot,
    onToggle: (values, rowId, slot, checked) => ({
      ...values,
      taskPriorities: assignPriority(
        taskPrioritiesOf(values),
        rowId,
        slot,
        checked,
      ),
    }),
    cellAriaLabel: (row, slot) => `${row.label} ${slot}순위`,
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
