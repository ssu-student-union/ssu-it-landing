import dayjs from "dayjs";
import { z } from "zod";
import {
  INTERVIEW_DATES,
  WEEKDAY_SLOT_START_TIMES,
  WEEKEND_SLOT_START_TIMES,
} from "../../../data/recruitingSchedule";
import { TIME_RANGE_ORDER_MESSAGE } from "../_lib/schema";

const dateEnum = z.enum(INTERVIEW_DATES);
const slotEnum = z.enum([
  ...WEEKDAY_SLOT_START_TIMES,
  ...WEEKEND_SLOT_START_TIMES,
]);

// z.record(dateEnum, ...)는 zod v4에서 모든 enum 키가 존재해야 하는
// exhaustive record로 취급돼서, "고른 날짜만 기록"하는 sparse map엔
// partialRecord를 써야 한다.
const interviewAvailability = z
  .partialRecord(dateEnum, z.array(slotEnum))
  .default({});

const localDateTimeString = z
  .string()
  .refine(
    (v) => v === "" || /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(v),
    "날짜/시간 형식이 올바르지 않아요.",
  );

const timeRangeSchema = z.object({
  start: localDateTimeString,
  end: localDateTimeString,
});

export const stepOneSchema = z
  .object({
    agree: z
      .boolean()
      .refine((v) => v === true, "개인정보 수집 및 이용에 동의해주세요."),
    name: z.string().trim().min(1, "이름을 입력해주세요."),
    studentId: z
      .string()
      .regex(/^\d{8}$/, "학번은 숫자 8자리로 입력해주세요. (예: 20240000)"),
    phone: z
      .string()
      .regex(
        /^01[0-9]-\d{3,4}-\d{4}$/,
        "전화번호 형식이 올바르지 않아요. (예: 010-1234-5678)",
      ),
    college: z.string().trim().min(1, "소속 단과대학을 입력해주세요."),
    department: z.string().trim().min(1, "소속 학과(부)를 입력해주세요."),
    grade: z.string().min(1, "학년/학기를 선택해주세요."),
    interviewAvailability,
    noAvailableTime: z.boolean().default(false),
    otherTime: z.array(timeRangeSchema).default([]),
  })
  .superRefine((data, ctx) => {
    const selectedSlotCount = Object.values(data.interviewAvailability).reduce(
      (sum, slots) => sum + (slots?.length ?? 0),
      0,
    );

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
      validRanges.some(
        (r) => dayjs(r.start).valueOf() >= dayjs(r.end).valueOf(),
      )
    ) {
      ctx.addIssue({
        path: ["otherTime"],
        code: z.ZodIssueCode.custom,
        message: TIME_RANGE_ORDER_MESSAGE,
      });
    }
  });

export type StepOneFormData = z.infer<typeof stepOneSchema>;
