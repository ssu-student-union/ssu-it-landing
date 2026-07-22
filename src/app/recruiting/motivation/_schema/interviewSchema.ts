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

/** 면접 가능 시간 문항이 있으면, 날짜(행)별로 실제 선택 가능한 시간대만 모은다.
 * 문항이 없으면(department 미선택 등) undefined를 반환해 호출부가 전체 풀로 폴백하게 한다. */
function allowedSlotsByDate(
  fields: FieldConfig[],
): Map<string, Set<string>> | undefined {
  const interviewField = interviewFieldOf(fields);
  if (!interviewField) return undefined;

  const map = new Map<string, Set<string>>();
  for (const group of interviewField.groups) {
    for (const row of group.rows) {
      const allowed = group.slots.filter(
        (slot) => group.isSlotAvailable?.(row.id, slot) ?? true,
      );
      map.set(row.id, new Set(allowed));
    }
  }
  return map;
}

/**
 * 선택된 부서의 면접 가능 시간 문항(checkbox-matrix)에서 실제로 보여준 날짜/
 * 시간대만 허용하는 `interviewAvailability` 스키마를 만든다. 문항이 없으면
 * (department 미선택 등) 전체 날짜/시간대 풀로 폴백한다.
 *
 * 날짜마다 허용 시간이 달라도(선택 불가 칸) zod로 "키마다 다른 enum"을 표현할
 * 수는 없어, 여기서는 날짜별 허용 집합의 합집합으로 느슨하게만 걸러내고,
 * 날짜-시간 조합의 정밀한 검증은 `validateInterviewAvailability`가 맡는다.
 */
export function buildInterviewAvailabilityField(
  fields: FieldConfig[],
): z.ZodType<Partial<Record<string, string[]>>> {
  const byDate = allowedSlotsByDate(fields);
  const allowedDates = byDate
    ? [...byDate.keys()]
    : (INTERVIEW_DATES as readonly string[]);
  const allowedSlots = byDate
    ? [...new Set([...byDate.values()].flatMap((slots) => [...slots]))]
    : [...WEEKDAY_SLOT_START_TIMES, ...WEEKEND_SLOT_START_TIMES];

  const dateEnum = z.enum(allowedDates as [string, ...string[]]);
  const slotEnum = z.enum(allowedSlots as [string, ...string[]]);

  // z.record는 zod v4에서 모든 enum 키를 요구하는 exhaustive record라, 고른 날짜만 기록하는 sparse map엔 partialRecord를 써야 한다.
  return z.partialRecord(dateEnum, z.array(slotEnum)).default({});
}

/** 대체 일정을 안 쓰는 한, 면접 가능 시간을 최소 하나는 선택해야 하고, 선택한
 * 날짜-시간 조합은 그 날짜에 실제로 열려있는(선택 가능한) 시간이어야 한다. */
export function validateInterviewAvailability(
  fields: FieldConfig[],
  data: {
    interviewAvailability: Partial<Record<string, string[]>>;
    noAvailableTime: boolean;
  },
  ctx: z.RefinementCtx,
) {
  if (data.noAvailableTime) return;

  const byDate = allowedSlotsByDate(fields);
  let selectedSlotCount = 0;

  for (const [date, slots] of Object.entries(data.interviewAvailability)) {
    for (const slot of slots ?? []) {
      selectedSlotCount++;
      if (byDate && !byDate.get(date)?.has(slot)) {
        ctx.addIssue({
          path: ["interviewAvailability"],
          code: z.ZodIssueCode.custom,
          message: "선택할 수 없는 날짜/시간이에요.",
        });
      }
    }
  }

  if (selectedSlotCount === 0) {
    ctx.addIssue({
      path: ["interviewAvailability"],
      code: z.ZodIssueCode.custom,
      message: "면접 가능한 시간을 최소 하나 선택해주세요.",
    });
  }
}
