import { z } from "zod";
import {
  type DepartmentId,
  departments,
} from "../../../data/recruitingStepTwo";
import { buildAnswerSchema } from "../_lib/questionConfig";

export type StepTwoFormData = { department: DepartmentId | "" } & Record<
  string,
  string | string[]
>;

/**
 * Step2의 zod 스키마는 고정값이 아니라 선택된 부서에 따라 즉석에서 조립된다
 * (부서마다 문항 구성이 다를 수 있어서 — `src/data/recruitingStepTwo.tsx`의
 * `Department.questions` 참고). `department`가 항상 첫 필드라 부서 미선택
 * 시엔 그 에러만 뜨고, 부서를 고르면 그 부서의 `questions` 순서 그대로 뒤에
 * 필드가 붙는다 — 스크롤-투-에러가 문항 배치 순서를 그대로 따라가는 이유.
 */
export function buildStepTwoSchema(
  department: DepartmentId | "",
): z.ZodType<StepTwoFormData, unknown> {
  const selectedDepartment = departments.find((d) => d.id === department);

  return z.object({
    department: z.string().min(1, "지원부서를 선택해주세요."),
    ...(selectedDepartment
      ? buildAnswerSchema(selectedDepartment.questions).shape
      : {}),
  }) as unknown as z.ZodType<StepTwoFormData, unknown>;
}
