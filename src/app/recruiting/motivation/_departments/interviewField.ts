import {
  expandTimeRangeToSlots,
  formatInterviewDate,
  formatSlotLabel,
  INTERVIEW_PERIOD_MAX,
  INTERVIEW_PERIOD_MIN,
  isWeekendDate,
} from "../../../../data/recruitingSchedule";
import type { FieldConfig, FormValues } from "../../_lib/schema";

type MatrixGroup = Extract<
  FieldConfig,
  { type: "checkbox-matrix" }
>["groups"][number];

type Availability = Partial<Record<string, string[]>>;

const availabilityOf = (values: FormValues): Availability =>
  (values.interviewAvailability as Availability | undefined) ?? {};

// 시간대 선택과 "가능한 시간이 없음"은 상호배타적이라 각 필드의 onToggle이
// 서로의 값을 함께 갱신한다.
const toggleSlot = (
  selection: Availability,
  day: string,
  slot: string,
  checked: boolean,
): Availability => {
  const current = selection[day] ?? [];
  const next = checked
    ? [...current, slot]
    : current.filter((item) => item !== slot);
  return { ...selection, [day]: next };
};

type InterviewDateRange = { id: string; start: string; end: string };

type InterviewFieldParams = {
  dates: InterviewDateRange[];
};

/** 주어진 날짜 묶음(같은 평일/주말 그룹)의 열(시간대 합집합)과 행, 날짜별 선택 가능 여부를 만든다.
 * 날짜마다 실제 가능한 시간이 달라도 표는 하나로 두고, 그 날짜에 해당하지 않는 칸만 선택 불가로 표시한다. */
function buildGroup(
  groupDates: InterviewDateRange[],
  cornerLabel: string,
  className?: string,
): MatrixGroup | undefined {
  if (groupDates.length === 0) return undefined;

  const slotsByDate = new Map(
    groupDates.map((d) => [
      d.id,
      new Set(expandTimeRangeToSlots(d.start, d.end)),
    ]),
  );
  const allSlots = [
    ...new Set(
      groupDates.flatMap((d) => expandTimeRangeToSlots(d.start, d.end)),
    ),
  ].sort();

  return {
    cornerLabel,
    className,
    columns: allSlots.map(formatSlotLabel),
    rows: groupDates.map((d) => ({
      id: d.id,
      label: formatInterviewDate(d.id),
    })),
    slots: allSlots,
    isSlotAvailable: (rowId, slot) =>
      slotsByDate.get(rowId)?.has(slot) ?? false,
  };
}

/** 면접 가능 시간 문항. 부서별 날짜/시간 범위는 호출부(각 부서 파일)가 직접 넘긴다. */
export function buildInterviewField({
  dates,
}: InterviewFieldParams): FieldConfig {
  const weekdayGroup = buildGroup(
    dates.filter((d) => !isWeekendDate(d.id)),
    "평일",
  );
  const weekendGroup = buildGroup(
    dates.filter((d) => isWeekendDate(d.id)),
    "주말",
    "mt-8",
  );

  return {
    type: "checkbox-matrix",
    key: "interviewAvailability",
    title: "면접 가능한 시간을 선택해주세요.",
    groups: [weekdayGroup, weekendGroup].filter((g): g is MatrixGroup =>
      Boolean(g),
    ),
    disabledWhen: (values) => Boolean(values.noAvailableTime),
    getChecked: (values, rowId, slot) =>
      availabilityOf(values)[rowId]?.includes(slot) ?? false,
    onToggle: (values, rowId, slot, checked) => ({
      ...values,
      interviewAvailability: toggleSlot(
        availabilityOf(values),
        rowId,
        slot,
        checked,
      ),
      noAvailableTime: checked ? false : values.noAvailableTime,
    }),
    cellAriaLabel: (row, slot) => `${formatInterviewDate(row.id)} ${slot}`,
    extraCheckbox: {
      key: "noAvailableTime",
      label: "가능한 시간이 없음",
      onToggle: (checked, values) => ({
        ...values,
        noAvailableTime: checked,
        interviewAvailability: checked ? {} : availabilityOf(values),
        otherTime: checked ? values.otherTime : [],
      }),
      timeRange: {
        key: "otherTime",
        description: "면접 가능한 일자 및 시간을 작성해주세요. (대면 기준)",
        min: INTERVIEW_PERIOD_MIN,
        max: INTERVIEW_PERIOD_MAX,
      },
    },
  };
}
