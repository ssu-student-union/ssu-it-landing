import { z } from "zod";
import {
  type DepartmentId,
  departments,
} from "../../../data/recruitingDepartments";
import {
  INTERVIEW_DATES,
  LOCAL_DATETIME_FORMAT,
  WEEKDAY_SLOT_START_TIMES,
  WEEKEND_SLOT_START_TIMES,
} from "../../../data/recruitingSchedule";
import { dayjs } from "../../../lib";
import {
  maxLengthExceededMessage,
  TIME_RANGE_ORDER_MESSAGE,
} from "../_lib/schema";

export type StepTwoFormData = {
  department: DepartmentId | "";
  interviewAvailability: Partial<Record<string, string[]>>;
  noAvailableTime: boolean;
  otherTime: { start: string; end: string }[];
  tasks?: string[];
  motivation?: string;
  fitReason?: string;
  skillAnswer?: string;
} & Record<string, unknown>;

const AnswerText = () =>
  z
    .string()
    .trim()
    .min(1, "내용을 입력해주세요.")
    .max(500, maxLengthExceededMessage(500));

const dateEnum = z.enum(INTERVIEW_DATES);
const slotEnum = z.enum([
  ...WEEKDAY_SLOT_START_TIMES,
  ...WEEKEND_SLOT_START_TIMES,
]);

// z.record는 zod v4에서 모든 enum 키를 요구하는 exhaustive record라, 고른 날짜만 기록하는 sparse map엔 partialRecord를 써야 한다.
const interviewAvailability = z
  .partialRecord(dateEnum, z.array(slotEnum))
  .default({});

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

/**
 * 부서마다 문항 구성이 달라 선택된 부서에 따라 즉석에서 스키마를 조립한다.
 * `department`가 항상 첫 필드라, 스크롤-투-에러가 문항 배치 순서를 따라간다.
 * 부서 문항은 모든 부서 공통이라 여기서 직접 검증한다(옵션 자체는 `fields.tsx`가 렌더).
 */
export function buildStepTwoSchema(
  department: DepartmentId | "",
): z.ZodType<StepTwoFormData, unknown> {
  const selected = departments.some((d) => d.id === department);

  return z
    .object({
      department: z.string().min(1, "지원부서를 선택해주세요."),
      interviewAvailability,
      noAvailableTime: z.boolean().default(false),
      otherTime: z.array(timeRangeSchema).default([]),
      ...(selected
        ? {
            tasks: z.array(z.string()).min(1, "항목을 선택해주세요."),
            motivation: AnswerText(),
            fitReason: AnswerText(),
            skillAnswer: AnswerText(),
          }
        : {}),
    })
    .superRefine((data, ctx) => {
      const selectedSlotCount = Object.values(
        data.interviewAvailability,
      ).reduce((sum, slots) => sum + (slots?.length ?? 0), 0);

      if (!data.noAvailableTime && selectedSlotCount === 0) {
        ctx.addIssue({
          path: ["interviewAvailability"],
          code: z.ZodIssueCode.custom,
          message: "면접 가능한 시간을 최소 하나 선택해주세요.",
        });
      }

      const validRanges = data.otherTime.filter((r) => r.start && r.end);

      if (data.noAvailableTime && validRanges.length === 0) {
        ctx.addIssue({
          path: ["otherTime"],
          code: z.ZodIssueCode.custom,
          message: "면접 가능한 일자 및 시간을 최소 하나 입력해주세요.",
        });
        return;
      }

      if (
        data.noAvailableTime &&
        validRanges.some((r) => dayjs(r.start).isSameOrAfter(dayjs(r.end)))
      ) {
        ctx.addIssue({
          path: ["otherTime"],
          code: z.ZodIssueCode.custom,
          message: TIME_RANGE_ORDER_MESSAGE,
        });
      }
    }) as unknown as z.ZodType<StepTwoFormData, unknown>;
}

export const stepTwoInitialValues: StepTwoFormData = {
  department: "",
  interviewAvailability: {},
  noAvailableTime: false,
  otherTime: [],
};
