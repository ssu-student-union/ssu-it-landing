import { z } from "zod";
import { LOCAL_DATETIME_FORMAT } from "../../../../data/recruitingSchedule";
import { dayjs } from "../../../../lib";
import { TIME_RANGE_ORDER_MESSAGE } from "../../_lib/schema";

const localDateTimeString = z
  .string()
  .refine(
    (v) => v === "" || dayjs(v, LOCAL_DATETIME_FORMAT, true).isValid(),
    "날짜/시간 형식이 올바르지 않아요.",
  );

const timeRangeSchema = z.object({
  start: localDateTimeString,
  end: localDateTimeString,
});

/** "가능한 시간이 없음" 체크 시 입력하는 대체 일정. 부서/문항과 무관한 고정 스키마. */
export const otherTimeShape = z.array(timeRangeSchema).default([]);

/** 대체 일정을 쓰기로 했다면 최소 한 건은 채워야 하고, 채운 건 시작<종료여야 한다. */
export function validateOtherTime(
  data: {
    otherTime: { start: string; end: string }[];
    noAvailableTime: boolean;
  },
  ctx: z.RefinementCtx,
) {
  if (!data.noAvailableTime) return;

  const validRanges = data.otherTime.filter((r) => r.start && r.end);

  if (validRanges.length === 0) {
    ctx.addIssue({
      path: ["otherTime"],
      code: z.ZodIssueCode.custom,
      message: "면접 가능한 일자 및 시간을 최소 하나 입력해주세요.",
    });
    return;
  }

  if (validRanges.some((r) => dayjs(r.start).isSameOrAfter(dayjs(r.end)))) {
    ctx.addIssue({
      path: ["otherTime"],
      code: z.ZodIssueCode.custom,
      message: TIME_RANGE_ORDER_MESSAGE,
    });
  }
}
