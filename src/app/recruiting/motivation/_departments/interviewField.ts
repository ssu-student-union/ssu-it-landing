import {
  formatInterviewDate,
  formatSlotLabel,
  INTERVIEW_PERIOD_MAX,
  INTERVIEW_PERIOD_MIN,
  isWeekendDate,
} from "../../../../data/recruitingSchedule";
import type { FieldConfig, FormValues } from "../../_lib/schema";

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

type InterviewFieldParams = {
  interviewDates: readonly string[];
  weekdaySlots: readonly string[];
  weekendSlots: readonly string[];
};

/** 면접 가능 시간 문항. 부서별 날짜/시간대는 호출부(각 부서 파일)가 직접 넘긴다. */
export function buildInterviewField({
  interviewDates,
  weekdaySlots,
  weekendSlots,
}: InterviewFieldParams): FieldConfig {
  const weekdayInterviewDates = interviewDates.filter((d) => !isWeekendDate(d));
  const weekendInterviewDates = interviewDates.filter(isWeekendDate);

  return {
    type: "checkbox-matrix",
    key: "interviewAvailability",
    title: "면접 가능한 시간을 선택해주세요.",
    groups: [
      {
        cornerLabel: "평일",
        columns: weekdaySlots.map(formatSlotLabel),
        rows: weekdayInterviewDates.map((day) => ({
          id: day,
          label: formatInterviewDate(day),
        })),
        slots: [...weekdaySlots],
      },
      {
        cornerLabel: "주말",
        className: "mt-8",
        columns: weekendSlots.map(formatSlotLabel),
        rows: weekendInterviewDates.map((day) => ({
          id: day,
          label: formatInterviewDate(day),
        })),
        slots: [...weekendSlots],
      },
    ],
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
