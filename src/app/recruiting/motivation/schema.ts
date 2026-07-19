import { z } from "zod";
import {
  type DepartmentId,
  departments,
} from "../../../data/recruitingDepartments";
import { maxLengthExceededMessage } from "../_lib/schema";

export type StepTwoFormData = { department: DepartmentId | "" } & Record<
  string,
  string | string[]
>;

const answerText = () =>
  z
    .string()
    .trim()
    .min(1, "내용을 입력해주세요.")
    .max(500, maxLengthExceededMessage(500));

/**
 * 부서마다 문항 구성이 달라 선택된 부서에 따라 즉석에서 스키마를 조립한다.
 * `department`가 항상 첫 필드라, 스크롤-투-에러가 문항 배치 순서를 따라간다.
 * 부서 문항은 모든 부서 공통이라 여기서 직접 검증한다(옵션 자체는 `fields.tsx`가 렌더).
 */
export function buildStepTwoSchema(
  department: DepartmentId | "",
): z.ZodType<StepTwoFormData, unknown> {
  const selected = departments.some((d) => d.id === department);

  return z.object({
    department: z.string().min(1, "지원부서를 선택해주세요."),
    ...(selected
      ? {
          tasks: z.array(z.string()).min(1, "항목을 선택해주세요."),
          motivation: answerText(),
          fitReason: answerText(),
          skillAnswer: answerText(),
        }
      : {}),
  }) as unknown as z.ZodType<StepTwoFormData, unknown>;
}

export const stepTwoInitialValues: StepTwoFormData = { department: "" };
