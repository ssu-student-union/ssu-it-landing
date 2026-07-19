"use client";

import { useRouter } from "next/navigation";
import type { DepartmentId } from "../../../data/recruitingDepartments";
import { Button } from "../_components/fields";
import { FormRenderer } from "../_components/form";
import { StepLayout } from "../_components/StepLayout";
import { RECRUITING_STORAGE_KEYS } from "../_lib/constants";
import { useFormState } from "../_lib/hooks";
import { stepTwoFields } from "./fields";
import { buildStepTwoSchema, stepTwoInitialValues } from "./schema";

export default function RecruitingStepTwoPage() {
  const router = useRouter();
  const { values, setValues, errors, submitted, fieldError, validate } =
    useFormState(
      (v) => buildStepTwoSchema(v.department as DepartmentId | ""),
      stepTwoInitialValues,
      RECRUITING_STORAGE_KEYS.stepTwo,
    );

  const handlePrev = () => router.push("/recruiting/personal-info");
  const handleNext = () => {
    if (validate().success) router.push("/recruiting/portfolio");
  };

  return (
    <StepLayout currentStep={2} title="2. 지원 파트 및 지원동기 작성">
      <FormRenderer
        fields={stepTwoFields}
        values={values}
        errors={errors}
        submitted={submitted}
        fieldError={fieldError}
        setValues={setValues}
      />
      <div className="flex items-center justify-between gap-4">
        <Button icon="prev" onClick={handlePrev}>
          이전
        </Button>
        <Button icon="next" onClick={handleNext}>
          다음
        </Button>
      </div>
    </StepLayout>
  );
}
