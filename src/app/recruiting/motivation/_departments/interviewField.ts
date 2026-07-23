import {
  expandTimeRangeToSlots,
  formatInterviewDate,
  formatSlotLabel,
  INTERVIEW_PERIOD_MAX,
  INTERVIEW_PERIOD_MIN,
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

/** 날짜마다 실제 가능한 시간이 달라도 표는 하나로 두고, 해당 없는 칸만 선택 불가로 표시한다.
 * 날짜(보통 3~4개)보다 시간대가 더 많아 행에 시간대를, 열에 날짜를 두는 게(transpose)
 * 모바일에서 가로 스크롤을 줄여 더 읽기 쉽다. */
function buildGroup(groupDates: InterviewDateRange[]): MatrixGroup | undefined {
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
    columns: groupDates.map((d) => formatInterviewDate(d.id)),
    rows: allSlots.map((slot) => ({
      id: slot,
      label: formatSlotLabel(slot),
    })),
    slots: groupDates.map((d) => d.id),
    // 행=시간대(rowId), 열=날짜(slot)로 뒤집혔으니 조회 순서도 맞춰 뒤집는다.
    isSlotAvailable: (rowId, slot) =>
      slotsByDate.get(slot)?.has(rowId) ?? false,
  };
}

/** 면접 가능 시간 문항. 부서별 날짜/시간 범위는 호출부(각 부서 파일)가 직접 넘긴다.
 * 평일/주말을 나누지 않고 모든 날짜를 표 하나에 담는다 — 날짜별로 실제 가능한 시간이
 * 달라도 `isSlotAvailable`이 칸 단위로 선택 가능 여부를 가려준다. */
export function buildInterviewField({
  dates,
}: InterviewFieldParams): FieldConfig {
  const group = buildGroup(dates);

  return {
    type: "checkbox-matrix",
    key: "interviewAvailability",
    title: "면접 가능한 시간을 선택해주세요.",
    groups: group ? [group] : [],
    disabledWhen: (values) => Boolean(values.noAvailableTime),
    // 표에서 행=시간대(rowId), 열=날짜(slot)로 뒤집혔지만 저장 형태(날짜 → 시간대 목록)는
    // 그대로 유지한다 — 그래서 아래 세 함수만 두 인자의 역할을 뒤집어 호출한다.
    getChecked: (values, rowId, slot) =>
      availabilityOf(values)[slot]?.includes(rowId) ?? false,
    onToggle: (values, rowId, slot, checked) => ({
      ...values,
      interviewAvailability: toggleSlot(
        availabilityOf(values),
        slot,
        rowId,
        checked,
      ),
      noAvailableTime: checked ? false : values.noAvailableTime,
    }),
    cellAriaLabel: (row, slot) => `${formatInterviewDate(slot)} ${row.label}`,
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
