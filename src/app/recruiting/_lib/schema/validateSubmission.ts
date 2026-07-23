import {
  type DepartmentId,
  isDepartmentId,
} from "../../../../data/recruitingDepartments";
import {
  buildStepTwoSchema,
  type StepTwoFormData,
} from "../../motivation/schema";
import {
  type StepOneFormData,
  stepOneSchema,
} from "../../personal-info/schema";
import {
  type StepThreeFormData,
  stepThreeSchema,
} from "../../portfolio/schema";

export type RecruitingSubmissionPayload = {
  stepOne: unknown;
  stepTwo: unknown;
  stepThree: unknown;
};

export type ValidatedRecruitingSubmission = {
  stepOne: StepOneFormData;
  stepTwo: StepTwoFormData;
  stepThree: StepThreeFormData;
};

export type SubmissionValidationResult =
  | { success: true; data: ValidatedRecruitingSubmission }
  | {
      success: false;
      errors: { stepOne: unknown; stepTwo: unknown; stepThree: unknown };
    };

function extractDepartment(stepOne: unknown): DepartmentId | "" {
  if (
    typeof stepOne === "object" &&
    stepOne !== null &&
    "department" in stepOne &&
    typeof stepOne.department === "string" &&
    isDepartmentId(stepOne.department)
  ) {
    return stepOne.department;
  }
  return "";
}

/** 클라이언트 검증은 신뢰하지 않고 서버에서 3단계 데이터를 다시 검증한다. `stepOneSchema`는 `.superRefine()`으로 `.shape` 병합이 안 돼 세 스키마를 각각 `safeParse`한다. */
export function validateSubmission(
  payload: RecruitingSubmissionPayload,
): SubmissionValidationResult {
  const stepOneResult = stepOneSchema.safeParse(payload.stepOne);
  const stepTwoResult = buildStepTwoSchema(
    extractDepartment(payload.stepOne),
  ).safeParse(payload.stepTwo);
  const stepThreeResult = stepThreeSchema.safeParse(payload.stepThree);

  if (
    !stepOneResult.success ||
    !stepTwoResult.success ||
    !stepThreeResult.success
  ) {
    return {
      success: false,
      errors: {
        stepOne: stepOneResult.success
          ? {}
          : stepOneResult.error.flatten().fieldErrors,
        stepTwo: stepTwoResult.success
          ? {}
          : stepTwoResult.error.flatten().fieldErrors,
        stepThree: stepThreeResult.success
          ? {}
          : stepThreeResult.error.flatten().fieldErrors,
      },
    };
  }

  return {
    success: true,
    data: {
      stepOne: stepOneResult.data,
      stepTwo: stepTwoResult.data,
      stepThree: stepThreeResult.data,
    },
  };
}
