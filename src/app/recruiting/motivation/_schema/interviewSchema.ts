import { z } from "zod";
import {
  INTERVIEW_DATES,
  WEEKDAY_SLOT_START_TIMES,
  WEEKEND_SLOT_START_TIMES,
} from "../../../../data/recruitingSchedule";
import type { FieldConfig } from "../../_lib/schema";

function interviewFieldOf(fields: FieldConfig[]) {
  return fields.find(
    (field): field is Extract<FieldConfig, { type: "checkbox-matrix" }> =>
      field.type === "checkbox-matrix",
  );
}

/**
 * 선택된 부서의 면접 가능 시간 문항(checkbox-matrix)에서 실제로 보여준 날짜/
 * 시간대만 허용하는 `interviewAvailability` 스키마를 만든다. 문항이 없으면
 * (department 미선택 등) 전체 날짜/시간대 풀로 폴백한다.
 */
export function buildInterviewAvailabilityField(
  fields: FieldConfig[],
): z.ZodType<Partial<Record<string, string[]>>> {
  const interviewField = interviewFieldOf(fields);
  const allowedDates = interviewField
    ? interviewField.groups.flatMap((group) => group.rows.map((row) => row.id))
    : (INTERVIEW_DATES as readonly string[]);
  const allowedSlots = interviewField
    ? interviewField.groups.flatMap((group) => group.slots)
    : [...WEEKDAY_SLOT_START_TIMES, ...WEEKEND_SLOT_START_TIMES];

  const dateEnum = z.enum(allowedDates as [string, ...string[]]);
  const slotEnum = z.enum(allowedSlots as [string, ...string[]]);

  // z.record는 zod v4에서 모든 enum 키를 요구하는 exhaustive record라, 고른 날짜만 기록하는 sparse map엔 partialRecord를 써야 한다.
  return z.partialRecord(dateEnum, z.array(slotEnum)).default({});
}

/** 대체 일정을 안 쓰는 한, 면접 가능 시간을 최소 하나는 선택해야 한다. */
export function validateInterviewAvailability(
  data: {
    interviewAvailability: Partial<Record<string, string[]>>;
    noAvailableTime: boolean;
  },
  ctx: z.RefinementCtx,
) {
  if (data.noAvailableTime) return;

  const selectedSlotCount = Object.values(data.interviewAvailability).reduce(
    (sum, slots) => sum + (slots?.length ?? 0),
    0,
  );

  if (selectedSlotCount === 0) {
    ctx.addIssue({
      path: ["interviewAvailability"],
      code: z.ZodIssueCode.custom,
      message: "면접 가능한 시간을 최소 하나 선택해주세요.",
    });
  }
}
