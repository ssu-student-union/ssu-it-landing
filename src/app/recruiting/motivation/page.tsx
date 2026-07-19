"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { DepartmentId } from "../../../data/recruitingDepartments";
import { Button } from "../_components/fields";
import { FormRenderer } from "../_components/form";
import { StepLayout } from "../_components/StepLayout";
import { RECRUITING_STORAGE_KEYS } from "../_lib/constants";
import { useFormState } from "../_lib/hooks";
import { buildEmptyAnswers } from "../_lib/schema";
import { questionsFor, stepTwoFields } from "./fields";
import {
  buildStepTwoSchema,
  type StepTwoFormData,
  stepTwoInitialValues,
} from "./schema";

export default function RecruitingStepTwoPage() {
  const router = useRouter();

  const [initialValues] = useState<StepTwoFormData>(() => {
    if (typeof window === "undefined") return stepTwoInitialValues;
    try {
      const stepOneRaw = sessionStorage.getItem(
        RECRUITING_STORAGE_KEYS.stepOne,
      );
      const department = stepOneRaw
        ? ((JSON.parse(stepOneRaw).department as DepartmentId | undefined) ??
          "")
        : "";
      return { ...stepTwoInitialValues, department };
    } catch {
      return stepTwoInitialValues;
    }
  });

  const { values, setValues, errors, submitted, fieldError, validate } =
    useFormState(
      (v) => buildStepTwoSchema(v.department as DepartmentId | ""),
      initialValues,
      RECRUITING_STORAGE_KEYS.stepTwo,
    );

  // biome-ignore lint/correctness/useExhaustiveDependencies: 마운트 시 1회만 비교한다
  useEffect(() => {
    const stepOneRaw = sessionStorage.getItem(RECRUITING_STORAGE_KEYS.stepOne);
    const department = stepOneRaw
      ? ((JSON.parse(stepOneRaw).department as DepartmentId | "" | undefined) ??
        "")
      : "";

    if (!department) {
      router.replace("/recruiting/personal-info");
      return;
    }

    setValues((prev) =>
      prev.department === department
        ? prev
        : {
            ...stepTwoInitialValues,
            ...buildEmptyAnswers(questionsFor(department)),
            department,
          },
    );
  }, []);

  const handlePrev = () => router.push("/recruiting/personal-info");
  const handleNext = () => {
    if (validate().success) router.push("/recruiting/portfolio");
  };

  return (
    <StepLayout currentStep={2} title="2. 면접 시간 선택 및 지원동기 작성">
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
