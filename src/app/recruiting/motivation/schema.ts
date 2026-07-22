import { z } from "zod";
import type { DepartmentId } from "../../../data/recruitingDepartments";
import {
  buildInterviewAvailabilityField,
  fieldSchemaEntry,
  otherTimeShape,
  taskPrioritiesShape,
  validateInterviewAvailability,
  validateOtherTime,
  validateTaskPriorities,
} from "./_schema";
import { questionsFor } from "./fields";

export type StepTwoFormData = {
  department: DepartmentId | "";
  interviewAvailability: Partial<Record<string, string[]>>;
  noAvailableTime: boolean;
  otherTime: { start: string; end: string }[];
  taskPriorities: Record<string, string>;
  motivation?: string;
  fitReason?: string;
} & Record<string, unknown>;

/**
 * 부서마다 문항 구성이 달라 선택된 부서에 따라 즉석에서 스키마를 조립한다.
 * `department`가 항상 첫 필드라, 스크롤-투-에러가 문항 배치 순서를 따라간다.
 */
export function buildStepTwoSchema(
  department: DepartmentId | "",
): z.ZodType<StepTwoFormData, unknown> {
  const fields = questionsFor(department);

  const dynamicShape = Object.fromEntries(
    fields
      .map(fieldSchemaEntry)
      .filter((entry): entry is [string, z.ZodTypeAny] => Boolean(entry)),
  );

  return z
    .object({
      department: z.string().min(1, "지원부서를 선택해주세요."),
      interviewAvailability: buildInterviewAvailabilityField(fields),
      noAvailableTime: z.boolean().default(false),
      otherTime: otherTimeShape,
      taskPriorities: taskPrioritiesShape,
      ...dynamicShape,
    })
    .superRefine((data, ctx) => {
      validateInterviewAvailability(fields, data, ctx);
      validateOtherTime(data, ctx);
      validateTaskPriorities(fields, data, ctx);
    }) as unknown as z.ZodType<StepTwoFormData, unknown>;
}

export const stepTwoInitialValues: StepTwoFormData = {
  department: "",
  interviewAvailability: {},
  noAvailableTime: false,
  otherTime: [],
  taskPriorities: {},
};
